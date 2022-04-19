package net.artsy.app;

import android.util.Log;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import androidx.annotation.Nullable;

import com.appboy.push.AppboyNotificationUtils;
import com.appboy.Constants;
import com.appboy.support.StringUtils;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;

import java.util.Map;

import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;
import com.facebook.react.bridge.WritableMap;

import com.dieam.reactnativepushnotification.modules.RNPushNotificationActions;
import com.dieam.reactnativepushnotification.modules.RNReceivedMessageHandler;

import com.dieam.reactnativepushnotification.modules.RNPushNotificationJsDelivery;
import com.dieam.reactnativepushnotification.modules.RNPushNotificationConfig;
import com.dieam.reactnativepushnotification.modules.RNPushNotificationHelper;

import android.app.Application;
import java.security.SecureRandom;

public class BrazeBroadcastReceiver extends RNPushNotificationActions {
  private static final String TAG = BrazeBroadcastReceiver.class.getName();

  @Override
  public void onReceive(Context context, Intent intent) {
    String packageName = context.getPackageName();
    String pushReceivedAction = packageName + AppboyNotificationUtils.APPBOY_NOTIFICATION_RECEIVED_SUFFIX;
    String notificationOpenedAction = packageName + AppboyNotificationUtils.APPBOY_NOTIFICATION_OPENED_SUFFIX;
    String notificationDeletedAction = packageName + AppboyNotificationUtils.APPBOY_NOTIFICATION_DELETED_SUFFIX;

    String action = intent.getAction();

    if (notificationOpenedAction.equals(action)) {
      String deepLink = intent.getStringExtra(Constants.APPBOY_PUSH_DEEP_LINK_KEY);

      if (!StringUtils.isNullOrBlank(deepLink)) {
        // Deeplink found we need to route ourselves
        // Brazes default routing does not seem to work with our setup
        Bundle bundle = buildBundle(context, intent);
        notifyWhenReady(context, bundle);
      } else {
        AppboyNotificationUtils.routeUserWithNotificationOpenedIntent(context, intent);
      }
    } else {
      Log.d(TAG, String.format("BRAZE Ignoring intent with unsupported action %s", action));
    }
  }

  private Bundle buildBundle(Context context, Intent intent) {
    // Braze has already handled display at this point so we only
    // really care about the uri to deeplink correctly

    String title = intent.getStringExtra("a");
    String uri = intent.getStringExtra("uri");

    Bundle bundle = new Bundle();
    if (title != null) {
      bundle.putString("title", title);
    }

    Bundle dataBundle = new Bundle();

    if (uri != null) {
      uri = uri.replace("artsy://", "https://artsy.net/");
      dataBundle.putString("url", uri);
    }

    bundle.putParcelable("data", dataBundle);
    return bundle;
  }

  private ReactApplicationContext reactAppContext(Context context) {
    ReactApplication reactApplication = ((ReactApplication) context.getApplicationContext());
    ReactInstanceManager reactInstanceManager = reactApplication.getReactNativeHost().getReactInstanceManager();
    ReactApplicationContext reactContext = ((ReactApplicationContext) reactInstanceManager.getCurrentReactContext());
    return reactContext;
  }

  // This code borrowed from react-native-push-notification code
  private void notifyWhenReady(Context context, Bundle bundle) {
    // We need to run this on the main thread, as the React code assumes that is
    // true.
    // Namely, DevServerHelper constructs a Handler() without a Looper, which
    // triggers:
    // "Can't create handler inside thread that has not called Looper.prepare()"
    Handler handler = new Handler(Looper.getMainLooper());
    handler.post(new Runnable() {
      public void run() {
        // Construct and load our normal React JS code bundle
        final ReactInstanceManager mReactInstanceManager = ((ReactApplication) context.getApplicationContext())
            .getReactNativeHost().getReactInstanceManager();
        ReactContext context = mReactInstanceManager.getCurrentReactContext();
        // If it's constructed, send a notification
        if (context != null) {
          ReactApplicationContext appContext = reactAppContext(context);
          Application applicationContext = (Application) appContext.getApplicationContext();
          RNPushNotificationHelper pushNotificationHelper = new RNPushNotificationHelper(applicationContext);
          pushNotificationHelper.invokeApp(bundle);
        } else {
          // Otherwise wait for construction, then send the notification
          mReactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
            public void onReactContextInitialized(ReactContext context) {
              ReactApplicationContext appContext = reactAppContext(context);
              Application applicationContext = (Application) appContext.getApplicationContext();
              RNPushNotificationHelper pushNotificationHelper = new RNPushNotificationHelper(applicationContext);
              pushNotificationHelper.invokeApp(bundle);
              mReactInstanceManager.removeReactInstanceEventListener(this);
            }
          });
          if (!mReactInstanceManager.hasStartedCreatingInitialContext()) {
            // Construct it in the background
            mReactInstanceManager.createReactContextInBackground();
          }
        }
      }
    });
  }
}