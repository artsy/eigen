package net.artsy.app;

import android.app.Application;
import android.content.Context;

import com.appboy.AppboyLifecycleCallbackListener;
import com.segment.analytics.android.integrations.adjust.AdjustIntegration;
import com.segment.analytics.Analytics;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import net.artsy.app.utils.ReactNativeConfigUtils;
import io.sentry.react.RNSentryPackage;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
            packages.add(new ArtsyNativePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
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
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    ArtsyNativeModule.didLaunch(
        this.getSharedPreferences("launchConfig", MODE_PRIVATE));

    String segmentWriteKey = BuildConfig.SEGMENT_PRODUCTION_WRITE_KEY_ANDROID;
    if (BuildConfig.DEBUG) {
      segmentWriteKey = BuildConfig.SEGMENT_STAGING_WRITE_KEY_ANDROID;
    }
    Analytics analytics = new Analytics.Builder(this, ReactNativeConfigUtils.decode(segmentWriteKey, BuildConfig.XOR_KEY))
            .use(AdjustIntegration.FACTORY)
                .build();
    Analytics.setSingletonInstance(analytics);
    registerActivityLifecycleCallbacks(new AppboyLifecycleCallbackListener(true, true));
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
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
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
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
