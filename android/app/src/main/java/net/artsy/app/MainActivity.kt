package net.artsy.app
import expo.modules.ReactActivityDelegateWrapper

import android.graphics.Color
import android.os.Build
import android.os.Bundle
import android.content.pm.ActivityInfo
import android.content.res.Configuration
import android.view.View
import android.view.WindowInsets
import android.view.WindowManager
import android.content.Intent
import android.net.Uri
import androidx.annotation.Nullable
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.zoontek.rnbootsplash.RNBootSplash
import com.dieam.reactnativepushnotification.modules.RNPushNotification
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import android.util.Log

class MainActivity : ReactActivity() {

    /**
     * Returns the name of the main component registered from JavaScript. This is
     * used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String = "eigen"

    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flag [fabricEnabled].
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        ReactActivityDelegateWrapper(this, BuildConfig.IS_NEW_ARCHITECTURE_ENABLED, DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled))

    private fun isTablet(): Boolean {
        return (this.resources.configuration.screenLayout
                and Configuration.SCREENLAYOUT_SIZE_MASK) >= Configuration.SCREENLAYOUT_SIZE_LARGE
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        RNBootSplash.init(this, R.style.BootTheme)

        // Following line is required to prevent a crash
        // See HACKS.md for more context
        // https://github.com/software-mansion/react-native-screens/issues/17
        super.onCreate(null)

        if (!isTablet()) {
            // prevent screen rotation on phones
            requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
        }


        RNPushNotification.IntentHandlers.add(object : RNPushNotification.RNIntentHandler {
            override fun onNewIntent(intent: Intent) {
                // If your provider requires some parsing on the intent before the data can be
                // used, add that code here. Otherwise leave empty.
            }

            override fun getBundleFromIntent(intent: Intent): Bundle? {
                // See here:
                // https://github.com/zo0r/react-native-push-notification#handling-custom-payloads

                // This should return the bundle data that will be serialized to the
                // `notification.data`
                // property sent to the `onNotification()` handler. Return `null` if there is no
                // data
                // or this is not an intent from your provider.

                // Parse braze notifications and
                // send the url in the data bundle so
                // it can be read in our notification callback
                // on ts side, we may want to pass other stuff for tracking
                val source = intent.getStringExtra("source")
                if (source != null && source.equals("appboy", ignoreCase = true)) {
                    if (intent.hasExtra("uri")) {
                        val bundle = Bundle()
                        val uriBundle = Bundle()
                        val uri = intent.getStringExtra("uri")
                        uriBundle.putString("url", uri)
                        bundle.putBundle("data", uriBundle)
                        return bundle
                    }
                }

                return null
            }
        })
    }

    // Basic overriding this class required for braze integration:
    // https://www.braze.com/docs/developer_guide/platform_integration_guides/react_native/react_sdk_setup/#step-2-complete-native-setup
    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
    }
}
