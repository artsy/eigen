import path from "path"
import { pipeline } from "stream/promises"
import spawnAsync from "@expo/spawn-async"
import glob from "fast-glob"
import fs from "fs-extra"
import { extract } from "tar"
import { v4 as uuidv4 } from "uuid"
import { getTmpDirectory } from "./helpers"

async function downloadFileAsync(url: string, outputPath: string): Promise<void> {
  try {
    const fetch = (await import("node-fetch")).default
    const headers: Record<string, string> = {
      "User-Agent": "expo-cli",
    }

    // Add GitHub token if available for private repos
    if (process.env.GH_TOKEN) {
      headers["Authorization"] = `token ${process.env.GH_TOKEN}`
    }

    // For GitHub API asset URLs, we need to specify we want the raw content
    if (url.includes("api.github.com/repos") && url.includes("/releases/assets/")) {
      headers["Accept"] = "application/octet-stream"
    }

    const response = await fetch(url, {
      headers,
      redirect: "follow",
    })

    if (!response.ok) {
      throw new Error(
        `Failed to download file from ${url}: ${response.status} ${response.statusText}`
      )
    }

    if (!response.body) {
      throw new Error(`No response body from ${url}`)
    }

    await pipeline(response.body, fs.createWriteStream(outputPath))
    console.log(`Successfully downloaded file to ${outputPath}`)
  } catch (error: any) {
    console.error(`Download error for ${url}:`, error.message)
    if (await fs.pathExists(outputPath)) {
      await fs.remove(outputPath)
    }
    throw error
  }
}

async function maybeCacheAppAsync(appPath: string, cachedAppPath?: string): Promise<string> {
  if (cachedAppPath) {
    await fs.ensureDir(path.dirname(cachedAppPath))
    await fs.move(appPath, cachedAppPath)
    return cachedAppPath
  }
  return appPath
}

export async function downloadAndMaybeExtractAppAsync(
  url: string,
  platform: "ios" | "android",
  cachedAppPath?: string,
  assetName?: string
): Promise<string> {
  const outputDir = path.join(await getTmpDirectory(), uuidv4())
  await fs.promises.mkdir(outputDir, { recursive: true })

  // For Android APK files, download directly without extraction
  const isApkFile =
    platform === "android" &&
    (url.endsWith("apk") ||
      url.includes("app-debug.apk") ||
      (assetName && assetName.endsWith(".apk")))

  if (isApkFile) {
    const apkFilePath = path.join(outputDir, `${uuidv4()}.apk`)
    await downloadFileAsync(url, apkFilePath)
    console.log("Successfully downloaded app")
    return await maybeCacheAppAsync(apkFilePath, cachedAppPath)
  } else {
    // For iOS or archived builds
    const tmpArchivePathDir = path.join(await getTmpDirectory(), uuidv4())
    await fs.mkdir(tmpArchivePathDir, { recursive: true })

    const tmpArchivePath = path.join(tmpArchivePathDir, `${uuidv4()}.tar.gz`)

    await downloadFileAsync(url, tmpArchivePath)
    console.log("Successfully downloaded app archive")
    await tarExtractAsync(tmpArchivePath, outputDir)

    const appPath = await getAppPathAsync(outputDir, platform === "ios" ? "app" : "apk")

    return await maybeCacheAppAsync(appPath, cachedAppPath)
  }
}

export async function extractAppFromLocalArchiveAsync(
  appArchivePath: string,
  platform: "ios" | "android"
): Promise<string> {
  const outputDir = path.join(await getTmpDirectory(), uuidv4())
  await fs.promises.mkdir(outputDir, { recursive: true })

  await tarExtractAsync(appArchivePath, outputDir)

  return await getAppPathAsync(outputDir, platform === "android" ? "apk" : "app")
}

async function getAppPathAsync(outputDir: string, applicationExtension: string): Promise<string> {
  const appFilePaths = await glob(`./**/*.${applicationExtension}`, {
    cwd: outputDir,
    onlyFiles: false,
  })

  if (appFilePaths.length === 0) {
    throw Error("Did not find any installable apps inside tarball.")
  }

  return path.join(outputDir, appFilePaths[0])
}

async function tarExtractAsync(input: string, output: string): Promise<void> {
  try {
    if (process.platform !== "win32") {
      await spawnAsync("tar", ["-xf", input, "-C", output], {
        stdio: "inherit",
      })
      return
    }
  } catch (error: any) {
    console.warn(
      `Failed to extract tar using native tools, falling back on JS tar module. ${error.message}`
    )
  }
  console.debug(`Extracting ${input} to ${output} using JS tar module`)
  // tar node module has previously had problems with big files, and seems to
  // be slower, so only use it as a backup.
  await extract({ file: input, cwd: output })
}
