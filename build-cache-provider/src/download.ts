import path from "path"
import { Readable } from "stream"
import { pipeline } from "stream/promises"
import spawnAsync from "@expo/spawn-async"
import glob from "fast-glob"
import fs from "fs-extra"
import { extract } from "tar"
import { v4 as uuidv4 } from "uuid"
import { getTmpDirectory } from "./helpers"

async function downloadFileAsync(url: string, outputPath: string): Promise<void> {
  try {
    const response = await fetch(url)

    if (!response.ok || !response.body) {
      throw new Error(`Failed to download file from ${url}`)
    }

    await pipeline(Readable.fromWeb(response.body as any), fs.createWriteStream(outputPath))
  } catch (error: any) {
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
  cachedAppPath?: string
): Promise<string> {
  const outputDir = path.join(getTmpDirectory(), uuidv4())
  await fs.promises.mkdir(outputDir, { recursive: true })

  if (url.endsWith("apk")) {
    const apkFilePath = path.join(outputDir, `${uuidv4()}.apk`)
    await downloadFileAsync(url, apkFilePath)
    console.log("Successfully downloaded app")
    return await maybeCacheAppAsync(apkFilePath, cachedAppPath)
  } else {
    const tmpArchivePathDir = path.join(getTmpDirectory(), uuidv4())
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
  const outputDir = path.join(getTmpDirectory(), uuidv4())
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
