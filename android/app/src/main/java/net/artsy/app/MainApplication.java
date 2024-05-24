package net.artsy.app;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.util.List;

import android.content.Context;
import android.util.Log;
import com.braze.Braze;
import com.braze.support.BrazeLogger;

import com.braze.BrazeActivityLifecycleCallbackListener;
import com.segment.analytics.Analytics;
import net.artsy.app.utils.ReactNativeConfigUtils;
import io.sentry.react.RNSentryPackage;
import com.google.firebase.messaging.FirebaseMessaging;
import com.microsoft.codepush.react.CodePush;


public class MainApplication extends Application implements ReactApplication {
  private static final String TAG = MainApplication.class.getName();

  private final ReactNativeHost mReactNativeHost = new DefaultReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for
      // example:
      packages.add(new ArtsyNativePackage());
      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }

    @Override
    protected boolean isNewArchEnabled() {
      return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }
    @Override
    protected Boolean isHermesEnabled() {
      return BuildConfig.IS_HERMES_ENABLED;
    }

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }

    ArtsyNativeModule.didLaunch(
        this.getSharedPreferences("launchConfig", MODE_PRIVATE));

    String segmentWriteKey = BuildConfig.SEGMENT_PRODUCTION_WRITE_KEY_ANDROID;
    if (BuildConfig.DEBUG) {
      segmentWriteKey = BuildConfig.SEGMENT_STAGING_WRITE_KEY_ANDROID;
    }

    Analytics analytics = new Analytics.Builder(this,
        ReactNativeConfigUtils.decode(segmentWriteKey, BuildConfig.GRAVITY_API_KEY))
        .build();

    Analytics.setSingletonInstance(analytics);

    // Register for Firebase Cloud Messaging manually.
    final Context applicationContext = this;
    FirebaseMessaging.getInstance().getToken().addOnCompleteListener(task -> {
      if (!task.isSuccessful()) {
        Log.i(TAG, "TOKEN failed to fetch registration token");
        Log.w(TAG, "Fetching FCM registration token failed", task.getException());
        return;
      }
      final String token = task.getResult();
      Log.i(TAG, "TOKEN firebase messaging token " + token);
      Braze.getInstance(applicationContext).setRegisteredPushToken(token);
    });

    ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());

    registerActivityLifecycleCallbacks(new BrazeActivityLifecycleCallbackListener());
  }
}
