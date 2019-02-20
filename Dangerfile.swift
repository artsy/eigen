// Want to improve this file?
// run `swift run danger-swift edit` in the terminal
// and it will pop open in Xcode

import Danger
import Foundation
import Yams

let danger = Danger()

// This one runs on Travis CI
// There is another on Circle which validates the tests
let modified = danger.git.modifiedFiles
let editedFiles = modified + danger.git.createdFiles
let testFiles = editedFiles.filter { $0.contains("Tests") && ($0.fileType == .swift  || $0.fileType == .m) }

// Validates that we've not accidentally let in a testing
// shortcut to simplify dev work
let testingShortcuts = ["fdescribe", "fit(@", "fit("]
for file in testFiles {
    let content = danger.utils.readFile(file)
    for shortcut in testingShortcuts {
        if content.contains(shortcut) {
            fail(message: "Found a testing shortcut", file: file, line: 0)
        }
    }
}

// A shortcut to say "I know what I'm doing thanks"
let knownDevTools = danger.github.pullRequest.body.contains("#known")

// These files are ones we really don't want changes to, except in really occasional
// cases, so offer a way out.
let devOnlyFiles = ["Artsy/View_Controllers/App_Navigation/ARTopMenuViewController+DeveloperExtras.m",
 "Artsy/View_Controllers/App_Navigation/ARTopMenuViewController+SwiftDeveloperExtras.swift",
 "Artsy.xcodeproj/xcshareddata/xcschemes/Artsy.xcscheme"]
for file in devOnlyFiles {
    if modified.contains(file) && !knownDevTools {
        fail("Developer Specific file shouldn't be changed, you can skip by adding #known to the PR body and re-runnning CI")
    }
}

// Did you make analytics changes? Well you should also include a change to our analytics spec
let madeAnalyticsChanges = modified.contains("/Artsy/App/ARAppDelegate+Analytics.m")
let madeAnalyticsSpecsChanges = modified.contains("/Artsy_Tests/Analytics_Tests/ARAppAnalyticsSpec.m")
if madeAnalyticsChanges {
    if !madeAnalyticsSpecsChanges {
        fail("Analytics changes should have reflected specs changes in ARAppAnalyticsSpec.m")
    }

    // And note to pay extra attention anyway
    message("Analytics dict changed, double check for ?: `@\"\"` on new entries to ensure nils don't crash the app.")
    let docs = "https://docs.google.com/spreadsheets/u/1/d/1bLbeOgVFaWzLSjxLOBDNOKs757-zBGoLSM1lIz3OPiI/edit#gid=497747862"
    message("Also, double check the [Analytics Eigen schema](\(docs)) if the changes are non-trivial.")
}

// Ensure the CHANGELOG is set up like we need
do {
    // Ensure it is valid yaml
    let changelogYML = danger.utils.readFile("CHANGELOG.yml")
    let loadedDictionary = try Yams.load(yaml: changelogYML) as? [String: Any]

    // So that we don't accidentally copy & paste oour upcoming section wrong
    if let upcoming = loadedDictionary?["upcoming"] {
        if upcoming is Array<Any> {
            fail("Upcoming an array in the CHANGELOG")
        }

        // Deployments rely on this to send info to reviewers
        if upcoming is Dictionary<String, Any> {
            let upcomingDict = upcoming as! Dictionary<String, Any>
            if upcomingDict["user_facing"] == nil {
                fail("There must be a `user_facing` section in the upcoming section of the CHANGELOG")
            }
        }
    }
} catch {
    fail("The CHANGELOG is not valid YML")
}
