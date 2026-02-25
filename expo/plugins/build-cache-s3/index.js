/**
 * S3 Build Cache Plugin for Expo
 *
 * Stores build artifacts in S3.
 * Uses AWS CLI for uploads/downloads with progress.
 */

const { spawn, execSync } = require("child_process")
const fs = require("fs")
const os = require("os")
const path = require("path")

const DEBUG = process.env.EXPO_BUILD_CACHE_DEBUG

function log(...args) {
  console.log("[s3-cache]", ...args)
}

function debug(...args) {
  if (DEBUG) console.log("[s3-cache:debug]", ...args)
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

function getS3Path(options, key) {
  const bucket = options?.bucket || "mobile-cached-builds"
  const prefix = options?.prefix || "eigen/cached-builds"
  return `s3://${bucket}/${prefix}/${key}`
}

function getCacheKey(fingerprintHash, platform, isDevClient) {
  const ext = "tar.gz"
  const suffix = isDevClient ? ".dev-client" : ""
  return `${fingerprintHash}${suffix}.${platform}.${ext}`
}

function isDevClientBuild(runOptions) {
  const variant = runOptions?.variant?.toLowerCase() || ""
  const configuration = runOptions?.configuration?.toLowerCase() || ""
  return variant.includes("debug") || configuration.includes("debug")
}

function s3ObjectExists(s3Path) {
  try {
    execSync(`aws s3 ls "${s3Path}"`, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    })
    return true
  } catch {
    return false
  }
}

function getS3ObjectSize(s3Path) {
  try {
    const output = execSync(`aws s3 ls "${s3Path}"`, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    })
    const match = output.match(/\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+(\d+)/)
    return match ? parseInt(match[1], 10) : 0
  } catch {
    return 0
  }
}

function downloadFromS3(s3Path, localPath) {
  return new Promise((resolve, reject) => {
    // Use inherit for stderr so AWS CLI shows its native progress
    const proc = spawn("aws", ["s3", "cp", s3Path, localPath], {
      stdio: ["pipe", "inherit", "inherit"],
    })

    proc.on("close", (code) => {
      code === 0 ? resolve(true) : reject(new Error(`aws s3 cp exited with code ${code}`))
    })

    proc.on("error", reject)
  })
}

function uploadToS3(localPath, s3Path) {
  return new Promise((resolve, reject) => {
    // Use inherit for stderr so AWS CLI shows its native progress
    const proc = spawn("aws", ["s3", "cp", localPath, s3Path], {
      stdio: ["pipe", "inherit", "inherit"],
    })

    proc.on("close", (code) => {
      code === 0 ? resolve(true) : reject(new Error(`aws s3 cp exited with code ${code}`))
    })

    proc.on("error", reject)
  })
}

async function resolveBuildCache(props, options) {
  const { platform, fingerprintHash, runOptions } = props
  const isDevClient = isDevClientBuild(runOptions)
  const key = getCacheKey(fingerprintHash, platform, isDevClient)
  const s3Path = getS3Path(options, key)

  log(`🔍 Looking for fingerprint ${fingerprintHash.slice(0, 12)}... in S3`)

  if (!s3ObjectExists(s3Path)) {
    log(`❌ No fingerprint ${fingerprintHash.slice(0, 12)}... found in S3`)
    return null
  }

  const size = getS3ObjectSize(s3Path)
  log(`✅ Found fingerprint ${fingerprintHash.slice(0, 12)}... in S3 (${formatBytes(size)})`)

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "expo-build-cache-"))
  const downloadPath = path.join(tempDir, key)

  log(`⬇️  Downloading...`)
  try {
    await downloadFromS3(s3Path, downloadPath)
    log(`✅ Downloaded from S3`)
  } catch (err) {
    log(`❌ Failed to download from S3`)
    debug(err.message)
    return null
  }

  const extractDir = path.join(tempDir, "extracted")
  fs.mkdirSync(extractDir, { recursive: true })
  execSync(`tar -xzf "${downloadPath}" -C "${extractDir}"`, { encoding: "utf-8" })

  if (platform === "ios") {
    const appBundle = fs.readdirSync(extractDir).find((f) => f.endsWith(".app"))
    return appBundle ? path.join(extractDir, appBundle) : null
  }

  const apk = fs.readdirSync(extractDir).find((f) => f.endsWith(".apk"))
  return apk ? path.join(extractDir, apk) : null
}

async function uploadBuildCache(props, options) {
  if (process.env.EXPO_BUILD_CACHE_UPLOAD !== "1") {
    debug("Upload skipped: EXPO_BUILD_CACHE_UPLOAD is not set")
    return null
  }

  const { platform, fingerprintHash, buildPath, runOptions } = props

  if (!fs.existsSync(buildPath)) {
    debug("Build path does not exist:", buildPath)
    return null
  }

  const isDevClient = isDevClientBuild(runOptions)
  const key = getCacheKey(fingerprintHash, platform, isDevClient)
  const s3Path = getS3Path(options, key)

  log(`⬆️  Uploading fingerprint ${fingerprintHash.slice(0, 12)}... to S3`)

  let uploadPath = buildPath

  if (platform === "ios" && fs.statSync(buildPath).isDirectory()) {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "expo-build-cache-"))
    uploadPath = path.join(tempDir, key)
    log(`📦 Compressing iOS app bundle...`)
    execSync(
      `tar -czf "${uploadPath}" -C "${path.dirname(buildPath)}" "${path.basename(buildPath)}"`,
      { encoding: "utf-8" }
    )
  } else if (platform === "android") {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "expo-build-cache-"))
    uploadPath = path.join(tempDir, key)
    log(`📦 Compressing Android APK...`)
    execSync(
      `tar -czf "${uploadPath}" -C "${path.dirname(buildPath)}" "${path.basename(buildPath)}"`,
      { encoding: "utf-8" }
    )
  }

  try {
    await uploadToS3(uploadPath, s3Path)
    log(`✅ Uploaded to S3: ${s3Path}`)
    return s3Path
  } catch (err) {
    log(`❌ Failed to upload to S3`)
    debug(err.message)
    return null
  }
}

module.exports = {
  resolveBuildCache,
  uploadBuildCache,
}
