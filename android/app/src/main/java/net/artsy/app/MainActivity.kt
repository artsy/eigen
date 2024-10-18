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
import android.content.IntentSender
import android.net.Uri
import androidx.annotation.Nullable
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.zoontek.rnbootsplash.RNBootSplash

import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import com.google.android.play.core.appupdate.AppUpdateManagerFactory;
import androidx.activity.result.contract.ActivityResultContracts
import com.google.android.gms.tasks.Task
import com.google.android.play.core.appupdate.AppUpdateInfo
import com.google.android.play.core.appupdate.AppUpdateManager
import com.google.android.play.core.appupdate.AppUpdateOptions
import com.google.android.play.core.install.model.AppUpdateType
import com.google.android.play.core.install.model.UpdateAvailability

import android.util.Log

class MainActivity : ReactActivity() {
    private val DAYS_FOR_FLEXIBLE_UPDATE = 7
    private lateinit var appUpdateManager: AppUpdateManager

    /**
     * Returns the name of the main component registered from JavaScript. This is
     * used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String = "main"

    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flag [fabricEnabled].
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        ReactActivityDelegateWrapper(this, BuildConfig.IS_NEW_ARCHITECTURE_ENABLED, DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled))

    override fun onCreate(savedInstanceState: Bundle?) {
        RNBootSplash.init(this, R.style.BootTheme)

        // Following line is required to prevent a crash
        // See HACKS.md for more context
        // https://github.com/software-mansion/react-native-screens/issues/17
        super.onCreate(null)

        // The purpose of this is to lock the orientation for the splash screen.
        val isTablet = (resources.configuration.screenLayout and Configuration.SCREENLAYOUT_SIZE_MASK) >= Configuration.SCREENLAYOUT_SIZE_LARGE
        if (!isTablet) {
            // prevent screen rotation on phones
            requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
        }

        appUpdateManager = AppUpdateManagerFactory.create(this)

        checkForAppUpdate()
    }

    private fun checkForAppUpdate() {
        val appUpdateInfoTask: Task<AppUpdateInfo> = appUpdateManager.appUpdateInfo

        appUpdateInfoTask.addOnSuccessListener { appUpdateInfo ->
            if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE &&
                (appUpdateInfo.clientVersionStalenessDays() ?: -1) >= DAYS_FOR_FLEXIBLE_UPDATE &&
                appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE)) {
                // Start a flexible update
                try {
                    appUpdateManager.startUpdateFlowForResult(
                        appUpdateInfo,
                        registerForActivityResult(ActivityResultContracts.StartIntentSenderForResult()) { result ->
                            // handle callback
                            if (result.resultCode != RESULT_OK) {
                                Log.d("ARTSY", "Update flow failed! Result code: ${result.resultCode}")
                                // If the update is canceled or fails,
                                // you can request to start the update again.
                            }
                        },
                        AppUpdateOptions.newBuilder(AppUpdateType.FLEXIBLE).build()
                    )
                } catch (e: IntentSender.SendIntentException) {
                    e.printStackTrace()
                }
            }
        }
    }

    // Basic overriding this class required for braze integration:
    // https://www.braze.com/docs/developer_guide/platform_integration_guides/react_native/react_sdk_setup/#step-2-complete-native-setup
    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
    }
}
