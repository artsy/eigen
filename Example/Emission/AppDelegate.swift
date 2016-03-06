import UIKit

import Emission
import React

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

  // TODO How to best share this throughout the app?
  var reactBridge: RCTBridge?

  var window: UIWindow?

  func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
    let URL = NSURL(string: "http://localhost:8081/index.ios.bundle?platform=ios")
    self.reactBridge = RCTBridge(bundleURL: URL, moduleProvider: nil, launchOptions: nil)

    self.window = UIWindow(frame: UIScreen.mainScreen().bounds)
    window?.rootViewController = UINavigationController(rootViewController: ARComponentViewController(bridge: self.reactBridge, moduleName: "ArtworksGrid"))
    window?.makeKeyAndVisible()

    return true
  }
}

