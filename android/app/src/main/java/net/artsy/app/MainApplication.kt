package net.artsy.app
import android.content.res.Configuration
import expo.modules.ApplicationLifecycleDispatcher

import android.app.Application
import android.content.Context
import android.util.Log
import com.braze.Braze
import com.braze.BrazeActivityLifecycleCallbackListener
import com.braze.support.BrazeLogger
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.common.ReleaseLevel
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.facebook.react.defaults.DefaultReactNativeHost
import expo.modules.ExpoReactHostFactory.getDefaultReactHost
import com.segment.analytics.Analytics
import io.sentry.react.RNSentryPackage
import com.reactnativekeysjsi.KeysModule.getSecureFor

class MainApplication : Application(), ReactApplication {

    override val reactHost: ReactHost by lazy {
      getDefaultReactHost(
        context = applicationContext,
        packageList =
          PackageList(this).packages.apply {
            // Packages that cannot be autolinked yet can be added manually here, for example:
            add(ArtsyNativePackage())
          },
      )
    }

    override fun onCreate() {
        super.onCreate()

        try {
          DefaultNewArchitectureEntryPoint.releaseLevel = ReleaseLevel.valueOf(BuildConfig.REACT_NATIVE_RELEASE_LEVEL.uppercase())
        } catch (e: IllegalArgumentException) {
          DefaultNewArchitectureEntryPoint.releaseLevel = ReleaseLevel.STABLE
        }

        loadReactNative(this)

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
