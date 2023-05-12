package net.artsy.app;

import android.app.Application;
import android.content.Context;
import android.util.Log;

import com.braze.Braze;
import com.braze.support.BrazeLogger;
import com.appboy.AppboyLifecycleCallbackListener;
import com.segment.analytics.Analytics;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.config.ReactFeatureFlags;
import com.facebook.soloader.SoLoader;
import net.artsy.app.utils.newarchitecture.MainApplicationReactNativeHost;
import net.artsy.app.utils.ReactNativeConfigUtils;
import io.sentry.react.RNSentryPackage;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import com.google.firebase.messaging.FirebaseMessaging;

public class MainApplication extends Application implements ReactApplication {
  private static final String TAG = MainApplication.class.getName();

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
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
  };

  private final ReactNativeHost mNewArchitectureNativeHost =
    new MainApplicationReactNativeHost(this);

  @Override
  public ReactNativeHost getReactNativeHost() {
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      return mNewArchitectureNativeHost;
    } else {
      return mReactNativeHost;
    }
  }

  @Override
  public void onCreate() {
    super.onCreate();
    // If you opted-in for the New Architecture, we enable the TurboModule system
    ReactFeatureFlags.useTurboModules = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;

    SoLoader.init(this, /* native exopackage */ false);

    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
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
      Braze.getInstance(applicationContext).registerAppboyPushMessages(token);
    });

    registerActivityLifecycleCallbacks(new AppboyLifecycleCallbackListener());
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method
   * with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         * We use reflection here to pick up the class that initializes Flipper,
         * since Flipper library is not available in release mode
         */
        Class<?> aClass = Class.forName("net.artsy.app.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
