// @ts-check

const fs = require("fs")
const plist = require("simple-plist");

const appJSONPath = "./app.json"
const appJSON = JSON.parse(fs.readFileSync(appJSONPath).toString())
const appVersion = appJSON['version']
const data = plist.readFileSync("./Artsy/App_Resources/Artsy-Info.plist")
const bundleVersion = data['CFBundleVersion'].toString().trim()
const releaseName = "ios-" + appVersion + "+" + bundleVersion
appJSON['sentryReleaseName'] = releaseName
fs.writeFileSync(appJSONPath, JSON.stringify(appJSON, null, 2))
