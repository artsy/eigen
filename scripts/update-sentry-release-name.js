// @ts-check

const path = require("path")
const fs = require("fs")
const { execSync } = require("child_process")

const appJSONPath = "./app.json"
const appJSON = JSON.parse(fs.readFileSync(appJSONPath).toString())
const appVersion = appJSON['version']
const bundleVersion = execSync("/usr/libexec/PlistBuddy -c 'print CFBundleVersion' ./Artsy/App_Resources/Artsy-Info.plist").toString().trim()
const releaseName = "ios-" + appVersion + "+" + bundleVersion
appJSON['sentryReleaseName'] = releaseName
fs.writeFileSync(appJSONPath, JSON.stringify(appJSON, null, 2))
