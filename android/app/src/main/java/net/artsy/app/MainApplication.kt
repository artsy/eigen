package net.artsy.app

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
import com.google.firebase.messaging.FirebaseMessaging
import com.microsoft.codepush.react.CodePush
import com.segment.analytics.Analytics
import net.artsy.app.utils.ReactNativeConfigUtils
import io.sentry.react.RNSentryPackage
import com.facebook.react.flipper.ReactNativeFlipper

class MainApplication : Application(), ReactApplication {

    override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
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
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(this.applicationContext, reactNativeHost)


    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, /* native exopackage */ false)
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // If you opted-in for the New Architecture, we load the native entry point for this app.
            load()
        }

        ArtsyNativeModule.didLaunch(this.getSharedPreferences("launchConfig", MODE_PRIVATE))

        var segmentWriteKey = BuildConfig.SEGMENT_PRODUCTION_WRITE_KEY_ANDROID
        if (BuildConfig.DEBUG) {
            segmentWriteKey = BuildConfig.SEGMENT_STAGING_WRITE_KEY_ANDROID
        }

        val analytics = Analytics.Builder(this,
            ReactNativeConfigUtils.decode(segmentWriteKey, BuildConfig.GRAVITY_API_KEY)
        ).build()

        Analytics.setSingletonInstance(analytics)

        // Register for Firebase Cloud Messaging manually.
        val applicationContext = this
        FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
            if (!task.isSuccessful) {
                return@addOnCompleteListener
            }
            val token = task.result
        }

        ReactNativeFlipper.initializeFlipper(this, reactNativeHost.reactInstanceManager)

        registerActivityLifecycleCallbacks(BrazeActivityLifecycleCallbackListener())
    }
}
