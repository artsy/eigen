package net.artsy.app
import android.content.res.Configuration
import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ReactNativeHostWrapper

import android.app.Application
import android.content.Context
import android.util.Log
import com.braze.Braze
import com.braze.BrazeActivityLifecycleCallbackListener
import com.braze.support.BrazeLogger
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.segment.analytics.Analytics
import io.sentry.react.RNSentryPackage
import com.reactnativekeysjsi.KeysModule.getSecureFor

class MainApplication : Application(), ReactApplication {

    override val reactNativeHost: ReactNativeHost =
      ReactNativeHostWrapper(this, object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
              add(ArtsyNativePackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      })

  override val reactHost: ReactHost
    get() = ReactNativeHostWrapper.createReactHost(applicationContext, reactNativeHost)

    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, OpenSourceMergedSoMapping)
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // If you opted-in for the New Architecture, we load the native entry point for this app.
            load()
        }

        ArtsyNativeModule.didLaunch(this.getSharedPreferences("launchConfig", MODE_PRIVATE))

        var segmentWriteKey: String = getSecureFor("SEGMENT_PRODUCTION_WRITE_KEY_ANDROID")
        if (BuildConfig.DEBUG) {
            segmentWriteKey = getSecureFor("SEGMENT_STAGING_WRITE_KEY_ANDROID")
        }

        val analytics = Analytics.Builder(this, segmentWriteKey).build()

        Analytics.setSingletonInstance(analytics)

        registerActivityLifecycleCallbacks(BrazeActivityLifecycleCallbackListener())
        ApplicationLifecycleDispatcher.onApplicationCreate(this)
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
      super.onConfigurationChanged(newConfig)
      ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
    }
}
