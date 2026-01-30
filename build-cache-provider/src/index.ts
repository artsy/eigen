import path from "path"
import {
  BuildCacheProviderPlugin,
  ResolveBuildCacheProps,
  RunOptions,
  UploadBuildCacheProps,
} from "@expo/config"
import fs from "fs-extra"
import { downloadAndMaybeExtractAppAsync } from "./download"
import { getReleaseAssetsByTag, createReleaseAndUploadAsset } from "./github"
import { isDevClientBuild, getBuildRunCacheDirectoryPath } from "./helpers"

export async function resolveGitHubRemoteBuildCache(
  { projectRoot, platform, fingerprintHash, runOptions }: ResolveBuildCacheProps,
  { owner, repo }: { owner: string; repo: string }
): Promise<string | null> {
  const cachedAppPath = await getCachedAppPath({
    fingerprintHash,
    platform,
    projectRoot,
    runOptions,
  })
  if (fs.existsSync(cachedAppPath)) {
    console.log("Cached build found, skipping download")
    return cachedAppPath
  }
  console.log(`Searching builds with matching fingerprint on Github Releases`)
  try {
    const tagName = getTagName({
      fingerprintHash,
      projectRoot,
      runOptions,
    })
    console.log("Looking for release with tag:", tagName)

    const assets = await getReleaseAssetsByTag({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      token: process.env.GH_TOKEN!,
      owner,
      repo,
      tag: tagName,
    })

    console.log(
      "Found assets:",
      assets.map((a) => ({ name: a.name, url: a.browser_download_url }))
    )

    // Filter assets by platform
    const platformAssets = assets.filter((asset) => {
      if (platform === "ios") {
        return asset.name.endsWith(".app.tar.gz") || asset.name.endsWith(".ipa")
      } else if (platform === "android") {
        return asset.name.endsWith(".apk")
      }
      return false
    })

    if (platformAssets.length === 0) {
      throw new Error(`No ${platform} build found in release assets`)
    }

    const asset = platformAssets[0]
    console.log("buildDownloadURL", asset.browser_download_url)
    console.log("asset.url", asset.url)

    // Try using the GitHub API URL instead of browser download URL
    // Pass the asset name to help determine if it's an APK
    return await downloadAndMaybeExtractAppAsync(asset.url, platform, cachedAppPath, asset.name)
  } catch (error) {
    console.log("No cached builds available for this fingerprint")
    console.error("Download error:", error)
  }
  return null
}

export async function uploadGitHubRemoteBuildCache(
  { projectRoot, fingerprintHash, runOptions, buildPath }: UploadBuildCacheProps,
  { owner, repo }: { owner: string; repo: string }
): Promise<string | null> {
  console.log(`Uploading build to Github Releases`)
  try {
    const result = await createReleaseAndUploadAsset({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      token: process.env.GH_TOKEN!,
      owner,
      repo,
      tagName: getTagName({
        fingerprintHash,
        projectRoot,
        runOptions,
      }),
      binaryPath: buildPath,
    })

    return result
  } catch (error) {
    console.log("error", error)
    console.error("Release failed:", error instanceof Error ? error.message : "Unknown error")
    process.exit(1)
  }
}

function getTagName({
  fingerprintHash,
  projectRoot,
  runOptions,
}: {
  fingerprintHash: string
  projectRoot: string
  runOptions: RunOptions
}): string {
  const isDevClient = isDevClientBuild({ projectRoot, runOptions })

  return `fingerprint.${fingerprintHash}${
    // eslint-disable-next-line no-constant-condition
    isDevClient || true ? ".dev-client" : ""
  }`
}

async function getCachedAppPath({
  fingerprintHash,
  platform,
  projectRoot,
  runOptions,
}: {
  fingerprintHash: string
  projectRoot: string
  runOptions: RunOptions
  platform: "ios" | "android"
}): Promise<string> {
  return path.join(
    await getBuildRunCacheDirectoryPath(),
    `${getTagName({
      fingerprintHash,
      projectRoot,
      runOptions,
    })}.${platform === "ios" ? "app" : "apk"}`
  )
}

const providerPlugin: BuildCacheProviderPlugin = {
  resolveBuildCache: resolveGitHubRemoteBuildCache,
  uploadBuildCache: uploadGitHubRemoteBuildCache,
}

export default providerPlugin
