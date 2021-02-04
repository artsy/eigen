package net.artsy.app;

import android.content.SharedPreferences;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;

public class ArtsyNativeModule extends ReactContextBaseJavaModule {
    // this is called on application launch by MainApplication#onCreate
    private static String LAUNCH_COUNT = "launchCount";
    public static void didLaunch(SharedPreferences prefs) {
        launchCount = prefs.getInt(LAUNCH_COUNT, 0) + 1;
        prefs.edit().putInt(LAUNCH_COUNT, launchCount).commit();
    }
    private static Integer launchCount = 0;
    ArtsyNativeModule(ReactApplicationContext context) {
        super(context);
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
        return constants;
    }
}
