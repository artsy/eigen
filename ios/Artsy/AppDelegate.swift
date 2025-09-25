import Expo
import React
import ReactAppDependencyProvider
import UserNotifications

class AppDelegate: ExpoAppDelegate, UNUserNotificationCenterDelegate {
    var window: UIWindow?

    @objc static var shared: AppDelegate? {
        return UIApplication.shared.delegate as? AppDelegate
    }

    var reactNativeDelegate: ExpoReactNativeFactoryDelegate?
    var reactNativeFactory: RCTReactNativeFactory?

    let helper = ARAppDelegateHelper.sharedInstance()

    public override func application(
      _ application: UIApplication,
      didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
      helper?.setup(launchOptions: launchOptions)

      // Set the UNUserNotificationCenter delegate to enable notification tap handling
      UNUserNotificationCenter.current().delegate = self

      let delegate = ReactNativeDelegate()
      let factory = ExpoReactNativeFactory(delegate: delegate)
      delegate.dependencyProvider = RCTAppDependencyProvider()

      reactNativeDelegate = delegate
      reactNativeFactory = factory
      bindReactNativeFactory(factory)

  #if os(iOS) || os(tvOS)
      window = UIWindow(frame: UIScreen.main.bounds)

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

    // MARK: Linking API
    public override func application(
      _ app: UIApplication,
      open url: URL,
      options: [UIApplication.OpenURLOptionsKey: Any] = [:]
    ) -> Bool {
      return super.application(app, open: url, options: options) || RCTLinkingManager.application(app, open: url, options: options)
    }

    // MARK: UserNotifications
    override func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        super.application(application, didRegisterForRemoteNotificationsWithDeviceToken: deviceToken)
        helper?.application(application, didRegisterForRemoteNotificationsWithDeviceToken: deviceToken)
    }

    override func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: any Error) {
        super.application(application, didFailToRegisterForRemoteNotificationsWithError: error)
        helper?.application(application, didFailToRegisterForRemoteNotificationsWithError: error)
    }

    override func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        super.application(application, didReceiveRemoteNotification: userInfo, fetchCompletionHandler: completionHandler)
        helper?.application(application, didReceiveRemoteNotification: userInfo, fetchCompletionHandler: completionHandler)
    }

    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        helper?.userNotificationCenter(center, willPresent: notification, withCompletionHandler: completionHandler)
    }

    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        helper?.userNotificationCenter(center, didReceive: response, withCompletionHandler: completionHandler)
    }

    // MARK: Shortcut Items
    override func application(_ application: UIApplication, performActionFor shortcutItem: UIApplicationShortcutItem, completionHandler: @escaping (Bool) -> Void) {
        super.application(application, performActionFor: shortcutItem, completionHandler: completionHandler)
        helper?.application(application, performActionFor: shortcutItem, completionHandler: completionHandler)
    }

    // MARK: ActivityContinuation + Universal Links
    override func application(_ application: UIApplication, willContinueUserActivityWithType userActivityType: String) -> Bool {
        return helper?.application(application, willContinueUserActivityWithType: userActivityType) ?? false
    }

    override func application(
      _ application: UIApplication,
      continue userActivity: NSUserActivity,
      restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
    ) -> Bool {
        let result = helper?.application(
            application,
            continue: userActivity,
            restorationHandler: { objects in
                restorationHandler(objects as? [UIUserActivityRestoring])
            }
        )
        return result ?? false
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
