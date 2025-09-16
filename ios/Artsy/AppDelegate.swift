import Expo
import React
import ReactAppDependencyProvider

class AppDelegate: ExpoAppDelegate {
    var window: UIWindow?

    var reactNativeDelegate: ExpoReactNativeFactoryDelegate?
    var reactNativeFactory: RCTReactNativeFactory?

    let helper = ARAppDelegateHelper.sharedInstance()

    public override func application(
      _ application: UIApplication,
      didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
      helper?.setup(launchOptions: launchOptions)

      let delegate = ReactNativeDelegate()
      let factory = ExpoReactNativeFactory(delegate: delegate)
      delegate.dependencyProvider = RCTAppDependencyProvider()

      reactNativeDelegate = delegate
      reactNativeFactory = factory
      bindReactNativeFactory(factory)

  #if os(iOS) || os(tvOS)
      // Use ARWindow if it exists in helper, otherwise create UIWindow
      if let arWindow = helper?.window {
          window = arWindow
      } else {
          window = UIWindow(frame: UIScreen.main.bounds)
          helper?.window = window as? ARWindow
      }
      
      factory.startReactNative(
        withModuleName: "main",
        in: window,
        launchOptions: launchOptions)
  #endif

      return super.application(application, didFinishLaunchingWithOptions: launchOptions)
    }
    
    // Forward applicationDidBecomeActive to helper
    override func applicationDidBecomeActive(_ application: UIApplication) {
        super.applicationDidBecomeActive(application)
        helper?.applicationDidBecomeActive()
    }

    // Linking API
    public override func application(
      _ app: UIApplication,
      open url: URL,
      options: [UIApplication.OpenURLOptionsKey: Any] = [:]
    ) -> Bool {
      return super.application(app, open: url, options: options) || RCTLinkingManager.application(app, open: url, options: options)
    }

    // Universal Links
    public override func application(
      _ application: UIApplication,
      continue userActivity: NSUserActivity,
      restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
    ) -> Bool {
      let result = RCTLinkingManager.application(application, continue: userActivity, restorationHandler: restorationHandler)
      return super.application(application, continue: userActivity, restorationHandler: restorationHandler) || result
    }
  }

  class ReactNativeDelegate: ExpoReactNativeFactoryDelegate {
    // Extension point for config-plugins

    override func sourceURL(for bridge: RCTBridge) -> URL? {
      // needed to return the correct URL for expo-dev-client.
      bridge.bundleURL ?? bundleURL()
    }

    override func bundleURL() -> URL? {
  #if DEBUG
      return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: ".expo/.virtual-metro-entry")
  #else
      return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
  #endif
    }
  }
