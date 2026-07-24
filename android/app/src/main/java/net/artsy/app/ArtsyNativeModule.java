package net.artsy.app;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import java.io.File;
import java.util.HashMap;
import java.util.Map;


public class ArtsyNativeModule extends ReactContextBaseJavaModule {
    // this is called on application launch by MainApplication#onCreate
    private static final String LAUNCH_COUNT = "launchCount";
    private static final String TAG = "ArtsyApp";
    public static void didLaunch(SharedPreferences prefs) {
        launchCount = prefs.getInt(LAUNCH_COUNT, 0) + 1;
        prefs.edit().putInt(LAUNCH_COUNT, launchCount).commit();
    }
    private static Integer launchCount = 0;

    // Reference to MainActivity for update functionality
    private static MainActivity mainActivity;
    public static void setMainActivity(MainActivity activity) {
        mainActivity = activity;
    }

    // Update state management
    private static boolean updateDownloaded = false;
    private static ArtsyNativeModule instance = null;

    public static void setUpdateDownloadedState(boolean state) {
        updateDownloaded = state;
    }

    public static void triggerUpdateDownloadedEvent() {
        if (instance != null) {
            WritableMap params = Arguments.createMap();
            params.putString("message", "Update downloaded successfully");
            instance.sendEvent(params);
        }
    }

    ReactApplicationContext context;

    ArtsyNativeModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
        context = reactApplicationContext;
        instance = this;
    }

    @NonNull
    @Override
    public String getName() {
        return "ArtsyNativeModule";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("launchCount", ArtsyNativeModule.launchCount);
        constants.put("gitCommitShortHash", BuildConfig.GITCommitShortHash);
        constants.put("isBeta", BuildConfig.IS_BETA);
        constants.put("updateDownloaded", ArtsyNativeModule.updateDownloaded);
        return constants;
    }

    @ReactMethod
    public void checkForAppUpdate(Promise promise) {
        if (mainActivity != null) {
            mainActivity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        mainActivity.checkForAppUpdateFromRN();
                        promise.resolve(true);
                    } catch (Exception e) {
                        promise.reject("UPDATE_CHECK_FAILED", "Failed to check for app update", e);
                    }
                }
            });
        } else {
            promise.reject("NO_MAIN_ACTIVITY", "MainActivity reference not available");
        }
    }

    private void sendEvent(WritableMap params) {
        getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("onAppUpdateDownloaded", params);
    }

    @ReactMethod
    public void completeAppUpdate(Promise promise) {
        if (mainActivity != null) {
            mainActivity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        mainActivity.completeAppUpdate();
                        promise.resolve(true);
                    } catch (Exception e) {
                        promise.reject("UPDATE_COMPLETE_FAILED", "Failed to complete app update", e);
                    }
                }
            });
        } else {
            promise.reject("NO_MAIN_ACTIVITY", "MainActivity reference not available");
        }
    }

}
