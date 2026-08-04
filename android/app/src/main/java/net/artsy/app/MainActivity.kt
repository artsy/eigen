package net.artsy.app
import expo.modules.ReactActivityDelegateWrapper

import android.os.Bundle
import android.content.pm.ActivityInfo
import android.content.res.Configuration
import android.content.Intent
import android.content.IntentSender
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.zoontek.rnbootsplash.RNBootSplash

import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import androidx.activity.result.contract.ActivityResultContracts
import com.google.android.play.core.appupdate.AppUpdateManagerFactory
import com.google.android.play.core.appupdate.AppUpdateInfo
import com.google.android.play.core.appupdate.AppUpdateManager
import com.google.android.play.core.appupdate.AppUpdateOptions
import com.google.android.play.core.install.model.AppUpdateType
import com.google.android.play.core.install.model.UpdateAvailability
import com.google.android.play.core.install.model.InstallStatus
import com.google.android.play.core.install.InstallStateUpdatedListener

import android.util.Log

class MainActivity : ReactActivity() {
    private val DAYS_FOR_FLEXIBLE_UPDATE = -1
    private val TAG = "ArtsyApp"
    private lateinit var appUpdateManager: AppUpdateManager

    private val updateResultLauncher = registerForActivityResult(
        ActivityResultContracts.StartIntentSenderForResult()
    ) { result ->
        if (result.resultCode != RESULT_OK) {
            Log.d(TAG, "Update flow failed! Result code: ${result.resultCode}")
        }
    }

    private lateinit var installStateUpdatedListener: InstallStateUpdatedListener

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

        installStateUpdatedListener = InstallStateUpdatedListener { state ->
            when (state.installStatus()) {
                InstallStatus.DOWNLOADED -> {
                    notifyReactNativeUpdateDownloaded()
                }
                InstallStatus.INSTALLED -> {
                    appUpdateManager.unregisterListener(installStateUpdatedListener)
                }
                InstallStatus.FAILED -> {
                    appUpdateManager.unregisterListener(installStateUpdatedListener)
                }
            }
        }

        appUpdateManager.registerListener(installStateUpdatedListener)

        // Register this activity with the native module for RN bridge
        ArtsyNativeModule.setMainActivity(this)
    }

    override fun onResume() {
        super.onResume()

        appUpdateManager
            .appUpdateInfo
            .addOnSuccessListener { appUpdateInfo ->
                if (appUpdateInfo.installStatus() == InstallStatus.DOWNLOADED) {
                    notifyReactNativeUpdateDownloaded()
                }
            }
    }

    override fun onDestroy() {
        super.onDestroy()
        appUpdateManager.unregisterListener(installStateUpdatedListener)
    }

    fun checkForAppUpdateFromRN() {
        checkForAppUpdate()
    }

    private fun checkForAppUpdate() {
        val appUpdateInfoTask = appUpdateManager.appUpdateInfo

        appUpdateInfoTask.addOnFailureListener { appUpdateInfo ->
            Log.d(TAG, "checkForAppUpdate: task failed: ${appUpdateInfo.toString()}")
        }

        appUpdateInfoTask.addOnSuccessListener { appUpdateInfo ->
            val staleDays = appUpdateInfo.clientVersionStalenessDays() ?: -1

            if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE) {
                when {
                    staleDays >= DAYS_FOR_FLEXIBLE_UPDATE && appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE) -> {
                        startUpdateFlow(appUpdateInfo)
                    }
                    else -> {
                        Log.d(TAG, "Update available but conditions not met for update prompt")
                    }
                }
            }
        }
    }

    private fun startUpdateFlow(appUpdateInfo: AppUpdateInfo,) {
        try {
            appUpdateManager.startUpdateFlowForResult(
                appUpdateInfo,
                updateResultLauncher,
                AppUpdateOptions.newBuilder(AppUpdateType.FLEXIBLE).build()
            )
        } catch (e: IntentSender.SendIntentException) {
            e.printStackTrace()
        }
    }

    private fun notifyReactNativeUpdateDownloaded() {
        // Store the update state and trigger event
        ArtsyNativeModule.setUpdateDownloadedState(true)
        ArtsyNativeModule.triggerUpdateDownloadedEvent()
    }

    fun completeAppUpdate() {
        appUpdateManager.completeUpdate()
    }

    // Basic overriding this class required for braze integration:
    // https://www.braze.com/docs/developer_guide/platform_integration_guides/react_native/react_sdk_setup/#step-2-complete-native-setup
    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
    }
}
