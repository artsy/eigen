package net.artsy.app;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowManager;
import android.content.Intent;
import android.net.Uri;
import androidx.annotation.Nullable;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.zoontek.rnbootsplash.RNBootSplash;
import com.dieam.reactnativepushnotification.modules.RNPushNotification;

import android.util.Log;

public class MainActivity extends ReactActivity {
  private static final String TAG = MainActivity.class.getName();

  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "eigen";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the renderer you wish to use - the new renderer (Fabric) or the old renderer
   * (Paper).
  */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }
  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }
    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }

    @Override
    protected boolean isConcurrentRootEnabled() {
      // If you opted-in for the New Architecture, we enable Concurrent Root (i.e. React 18).
      // More on this on https://reactjs.org/blog/2022/03/29/react-v18.html
      return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }
  }

  private boolean isTablet() {
    return (this.getResources().getConfiguration().screenLayout
        & Configuration.SCREENLAYOUT_SIZE_MASK) >= Configuration.SCREENLAYOUT_SIZE_LARGE;
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // Following line is required to prevent a crash
    // See HACKS.md for more context
    // https://github.com/software-mansion/react-native-screens/issues/17
    super.onCreate(null);

    if (!isTablet()) {
      // prevent screen rotation on phones
      setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
    }
    RNBootSplash.init(R.drawable.bootsplash, MainActivity.this);

    RNPushNotification.IntentHandlers.add(new RNPushNotification.RNIntentHandler() {
      @Override
      public void onNewIntent(Intent intent) {
        // If your provider requires some parsing on the intent before the data can be
        // used, add that code here. Otherwise leave empty.
      }

      @Nullable
      @Override
      public Bundle getBundleFromIntent(Intent intent) {
        // See here:
        // https://github.com/zo0r/react-native-push-notification#handling-custom-payloads

        // This should return the bundle data that will be serialized to the
        // `notification.data`
        // property sent to the `onNotification()` handler. Return `null` if there is no
        // data
        // or this is not an intent from your provider.

        // Parse braze notifications and
        // send the url in the data bundle so
        // it can be read in our notifciation callback
        // on ts side, we may want to pass other stuff for tracking
        String source = intent.getStringExtra("source");
        if (source != null && source.equalsIgnoreCase("appboy")) {
          if (intent.hasExtra("uri")) {
            Bundle bundle = new Bundle();
            Bundle uriBundle = new Bundle();
            String uri = intent.getStringExtra("uri");
            uriBundle.putString("url", uri);
            bundle.putBundle("data", uriBundle);
            return bundle;
          }
        }

        return null;
      }
    });
  }

  // Basic overriding this class required for braze integration:
  // https://www.braze.com/docs/developer_guide/platform_integration_guides/react_native/react_sdk_setup/#step-2-complete-native-setup
  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
  }
}
