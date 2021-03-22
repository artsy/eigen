package net.artsy.app;

import android.app.Activity;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Build;
import android.view.View;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowManager;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
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


    @ReactMethod
    public void setNavigationBarColor(final String color) {
        final Activity activity = getCurrentActivity();
        final int colorInt = Color.parseColor(color);
        if(activity == null)
            return;

        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    activity.getWindow().setNavigationBarColor(colorInt);
                }
            }
        });
    }

    @ReactMethod
    public void setAppStyling(Promise promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                final Activity activity = getCurrentActivity();
                if(activity == null)
                    return;

                activity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        final Window window = activity.getWindow();

                        WindowManager.LayoutParams winParams = window.getAttributes();
                        winParams.flags &= ~WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS;
                        window.setAttributes(winParams);
                        setStatusBarColor("#00FFFFFF"); // Color.TRANSPARENT
                        setNavigationBarColor("#FFFFFF"); // Color.WHITE
                        View decorView = window.getDecorView();
                        decorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR | View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN );
                    }
                });
            }
            promise.resolve("success");
        } catch (Exception e) {
            promise.reject("Failed to set app style", e);
        }

    }

    @ReactMethod
    public void setStatusBarColor(final String color) {
        final Activity activity = getCurrentActivity();
        final int colorInt = Color.parseColor(color);
        if(activity == null)
            return;

        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    activity.getWindow().setStatusBarColor(colorInt);
                }
            }
        });
    }
}
