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
import com.dieam.reactnativepushnotification.modules.RNPushNotification
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
        Log.d(TAG, "Update flow result: ${result.resultCode}")
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
        appUpdateManager = AppUpdateManagerFactory.create(this)

        installStateUpdatedListener = InstallStateUpdatedListener { state ->
            Log.d(TAG, "Install state updated: ${state.installStatus()}")
            when (state.installStatus()) {
                InstallStatus.DOWNLOADED -> {
                    Log.d(TAG, "Update downloaded, notifying React Native")
                    notifyReactNativeUpdateDownloaded()
                }
                InstallStatus.INSTALLED -> {
                    Log.d(TAG, "Update installed successfully")
                    appUpdateManager.unregisterListener(installStateUpdatedListener)
                }
                InstallStatus.FAILED -> {
                    Log.d(TAG, "Update installation failed")
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
                    Log.d(TAG, "onResume: Update downloaded, notifying React Native")
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
        Log.d(TAG, "here we go!")
        Log.d(TAG, "checkForAppUpdate: started checking for update!")
        val appUpdateInfoTask = appUpdateManager.appUpdateInfo

        appUpdateInfoTask.addOnFailureListener { appUpdateInfo ->
            Log.d(TAG, "checkForAppUpdate: task failed: ${appUpdateInfo.toString()}")
        }

        appUpdateInfoTask.addOnSuccessListener { appUpdateInfo ->
            Log.d(TAG, "checkForAppUpdate: adding listener, appUpdateInfo: ${appUpdateInfo.toString()}")

            val staleDays = appUpdateInfo.clientVersionStalenessDays() ?: -1

            Log.d(TAG, "checkForAppUpdate: conditions: \n" +
                    "appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE: ${appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE}\n" +
                    "staleDays ($staleDays) >= DAYS_FOR_FLEXIBLE_UPDATE ($DAYS_FOR_FLEXIBLE_UPDATE): ${staleDays >= DAYS_FOR_FLEXIBLE_UPDATE}\n" +
                    "appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE): ${appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE)}\n" +
                    "appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE): ${appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)}"
            )

            if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE) {
                when {
                    staleDays >= DAYS_FOR_FLEXIBLE_UPDATE && appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE) -> {
                        Log.d(TAG, "Starting flexible update (app is $staleDays days stale)")
                        startUpdateFlow(appUpdateInfo, AppUpdateType.FLEXIBLE)
                    }
                    else -> {
                        Log.d(TAG, "Update available but conditions not met for update prompt")
                    }
                }
            }
        }
    }

    private fun startUpdateFlow(appUpdateInfo: AppUpdateInfo, updateType: Int) {
        try {
            val updateTypeString = if (updateType == AppUpdateType.IMMEDIATE) "immediate" else "flexible"
            Log.d(TAG, "startUpdateFlow: Starting $updateTypeString update flow")

            appUpdateManager.startUpdateFlowForResult(
                appUpdateInfo,
                updateResultLauncher,
                AppUpdateOptions.newBuilder(updateType).build()
            )
            Log.d(TAG, "startUpdateFlow: $updateTypeString update flow started successfully")
        } catch (e: IntentSender.SendIntentException) {
            Log.e(TAG, "startUpdateFlow: Failed to start update flow", e)
            e.printStackTrace()
        }
    }

    private fun notifyReactNativeUpdateDownloaded() {
        // Store the update state and trigger event
        ArtsyNativeModule.setUpdateDownloadedState(true)
        ArtsyNativeModule.triggerUpdateDownloadedEvent()
        Log.d(TAG, "Update downloaded state set and event triggered for React Native")
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
