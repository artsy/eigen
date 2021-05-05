package net.artsy.app;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowManager;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import com.zoontek.rnbootsplash.RNBootSplash;


public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
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
      & Configuration.SCREENLAYOUT_SIZE_MASK)
      >= Configuration.SCREENLAYOUT_SIZE_LARGE;
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    if (!isTablet()) {
      // prevent screen rotation on phones
      setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
    }
    RNBootSplash.init(R.drawable.bootsplash, MainActivity.this);
  }
}
