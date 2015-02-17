#import "SnapshotHelper.js"

var target = UIATarget.localTarget();
var app = target.frontMostApp();
var window = app.mainWindow();


target.delay(3)
captureLocalizedScreenshot("0-LandingScreen")

window.buttons()['TRY WITHOUT AN ACCOUNT'].tap()
target.delay(3)
captureLocalizedScreenshot("1-MainMenu")

window.buttons()['BROWSE'].tap()
target.delay(3)
captureLocalizedScreenshot("2-Browse")

window.buttons()['YOU'].tap()
target.delay(3)
captureLocalizedScreenshot("2-You")