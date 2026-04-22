#!/usr/bin/env node
// Generates sentry.options.json from the project's keys file.
// The Sentry Metro plugin (getSentryExpoConfig) reads this file at build time.
const fs = require("fs")
const path = require("path")

const ROOT = path.join(__dirname, "../..")
const OUTPUT = path.join(ROOT, "sentry.options.json")
const ANDROID_ASSETS_OUTPUT = path.join(ROOT, "android/app/src/main/assets/sentry.options.json")

const keyFiles = ["keys.shared.json", "keys.example.json"]

let dsn = null

for (const fileName of keyFiles) {
  const filePath = path.join(ROOT, fileName)
  if (!fs.existsSync(filePath)) continue

  try {
    const keys = JSON.parse(fs.readFileSync(filePath, "utf8"))
    const candidate = keys?.secure?.SENTRY_DSN
    if (candidate && candidate !== "-") {
      dsn = candidate
      console.log(`[generate-sentry-options] Using SENTRY_DSN from ${fileName}`)
      break
    }
  } catch (e) {
    console.warn(`[generate-sentry-options] Could not parse ${fileName}: ${e.message}`)
  }
}

if (!dsn) {
  console.warn(
    "[generate-sentry-options] SENTRY_DSN not found in keys files — sentry.options.json will have an empty DSN."
  )
  dsn = ""
}

const content = JSON.stringify({ dsn }, null, 2) + "\n"
fs.writeFileSync(OUTPUT, content)
console.log(`[generate-sentry-options] Written to sentry.options.json`)
fs.writeFileSync(ANDROID_ASSETS_OUTPUT, content)
console.log(`[generate-sentry-options] Written to android/app/src/main/assets/sentry.options.json`)
