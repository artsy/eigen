package net.artsy.app;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.graphics.Color;
import android.os.Build;
import android.view.View;
import android.view.ViewConfiguration;
import android.view.Window;
import android.view.WindowManager;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.apache.commons.io.FileUtils;

import java.io.File;
import java.util.HashMap;
import java.util.Map;


public class ArtsyNativeModule extends ReactContextBaseJavaModule {
    // this is called on application launch by MainApplication#onCreate
    private static final String LAUNCH_COUNT = "launchCount";
    public static void didLaunch(SharedPreferences prefs) {
        launchCount = prefs.getInt(LAUNCH_COUNT, 0) + 1;
        prefs.edit().putInt(LAUNCH_COUNT, launchCount).commit();
    }
    private static Integer launchCount = 0;

    ReactApplicationContext context;

    ArtsyNativeModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
        context = reactApplicationContext;
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
        constants.put("navigationBarHeight", getNavigationBarSize(this.getReactApplicationContext()));
        constants.put("gitCommitShortHash", BuildConfig.GITCommitShortHash);
        constants.put("isBeta", BuildConfig.IS_BETA);
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
                        setStatusBarColor("#00FFFFFF");
                    }
                });
            }
            promise.resolve("success");
        } catch (Exception e) {
            promise.reject("Failed to set app style", e);
        }

    }

    @ReactMethod
    public void setAppLightContrast(final Boolean isLight, Promise promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                final Activity activity = getCurrentActivity();
                if(activity == null)
                    return;

                activity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        final Window window = activity.getWindow();
                        // clear any existing flags
                        window.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_VISIBLE);
                        if(isLight) {
                            window.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN );
                        } else {
                            window.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR );
                        }
                    }
                });
            }
            promise.resolve("success");
        } catch (Exception e) {
            promise.reject("Failed to set the app theme", e);
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

    public static int getNavigationBarSize(Context context) {
        boolean hasHardwareMenuKey = ViewConfiguration.get(context).hasPermanentMenuKey();
        int resourceId = context.getResources().getIdentifier("navigation_bar_height", "dimen", "android");
        if (resourceId > 0 && !hasHardwareMenuKey)
        {
            return context.getResources().getDimensionPixelSize(resourceId);
        }
        return 0;
    }

    private boolean isTablet() {
        return (getCurrentActivity().getResources().getConfiguration().screenLayout
                & Configuration.SCREENLAYOUT_SIZE_MASK)
                >= Configuration.SCREENLAYOUT_SIZE_LARGE;
    }

    @ReactMethod
    public void lockActivityScreenOrientation() {
        // We only want to lock screen orientation on phones
        if (!isTablet()) {
            getCurrentActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        }
    }

    private boolean deleteDir(File dir) {
        if (dir == null) return true;
        if (dir.isDirectory()) {
            String[] children = dir.list();
            if (children != null) {
                for (String child : children) {
                    // delete everything in the directory one by one recursively
                    boolean success = deleteDir(new File(dir, child));
                    if (!success) {
                        return false;
                    }
                }
            }
        }
        // The directory is now empty so delete it
        return dir.delete();
    }

    @ReactMethod
    public void clearCache(Promise promise) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            try {
                deleteDir(context.getCacheDir());
                deleteDir(context.getExternalCacheDir());
                promise.resolve(true);
            } catch (Exception e) {
                promise.resolve(false);
            }
        } else {
            try {
                FileUtils.deleteQuietly(context.getCacheDir());
                FileUtils.deleteQuietly(context.getExternalCacheDir());
                promise.resolve(true);
            } catch (Exception e) {
                promise.resolve(false);
            }
        }
    }

}
