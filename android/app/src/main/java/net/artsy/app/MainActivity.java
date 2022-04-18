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

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import com.zoontek.rnbootsplash.RNBootSplash;

import android.util.Log;

import com.dieam.reactnativepushnotification.modules.RNPushNotification;
import androidx.annotation.Nullable;

public class MainActivity extends ReactActivity {
  private static final String TAG = MainActivity.class.getName();

  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Artsy";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
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
        Log.d(TAG, "BRAZE onNewIntent custom intent handler called");
      }

      @Nullable
      @Override
      public Bundle getBundleFromIntent(Intent intent) {
        // This should return the bundle data that will be serialized to the
        // `notification.data`
        // property sent to the `onNotification()` handler. Return `null` if there is no
        // data
        // or this is not an intent from your provider.

        Log.d(TAG, "BRAZE getBundleFromIntent custom intent handler called");

        // Example:
        if (intent.hasExtra("MY_NOTIFICATION_PROVIDER_DATA_KEY")) {
          return intent.getBundleExtra("MY_NOTIFICATION_PROVIDER_DATA_KEY");
        }
        return null;
      }
    });
  }

  // required for braze integration:
  // https://www.braze.com/docs/developer_guide/platform_integration_guides/react_native/react_sdk_setup/#step-2-complete-native-setup
  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
  }
}
