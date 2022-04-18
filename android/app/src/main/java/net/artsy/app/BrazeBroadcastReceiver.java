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

    Log.d(TAG, String.format("BRAZE Received intent with action %s", action));

    //Bundle bundle = intent.getBundleExtra("notification");

    //Log.d(TAG, String.format("BRAZE Received intent with bundle %s", bundle.toString()));

    if (pushReceivedAction.equals(action)) {
      Log.d(TAG, "BRAZE Received push notification.");
    } else if (notificationOpenedAction.equals(action)) {
      Log.d(TAG, "BRAZE Received push notification opened action.");
      String deepLink = intent.getStringExtra(Constants.APPBOY_PUSH_DEEP_LINK_KEY);

      if (!StringUtils.isNullOrBlank(deepLink)) {
        Log.d(TAG, "BRAZE Deeplink found we need to route ourselves.");
        Bundle bundle = buildBundle(context, intent);

        ReactApplicationContext appContext = giveMeTheDamnContext(context);
        Application applicationContext = (Application) appContext.getApplicationContext();
        //handleRemotePushNotification(appContext, bundle);
        RNPushNotificationHelper pushNotificationHelper = new RNPushNotificationHelper(applicationContext);
        pushNotificationHelper.invokeApp(bundle);
        //handlePushOnceAppIsReady(context, bundle);

        //super.onReceive(context, intent);

        //sendEventOnceContextIsReady(context);
      } else {
        Log.d(TAG, "BRAZE No deeplink found using appboy default routing.");
        AppboyNotificationUtils.routeUserWithNotificationOpenedIntent(context, intent);
      }
    } else if (notificationDeletedAction.equals(action)) {
      Log.d(TAG, "BRAZE Received push notification deleted intent.");
    } else {
      Log.d(TAG, String.format("BRAZE Ignoring intent with unsupported action %s", action));
    }
  }

  private Bundle buildBundle(Context context, Intent intent) {
    Bundle bundle = new Bundle();
    bundle.putString("title", "some title");
    bundle.putString("message", "some message");
    Bundle dataBundle = new Bundle();

    // TODO: do standard deeplink url format not work at all?
    // dataBundle.putString("url", "artsy://artist/kaws");

    dataBundle.putString("url", "https://staging.artsy.net/auctions");

    // Map<String, String> notificationData = message.getData();

    // for(Map.Entry<String, String> entry : notificationData.entrySet()) {
    //     dataBundle.putString(entry.getKey(), entry.getValue());
    // }

    bundle.putParcelable("data", dataBundle);
    return bundle;
  }

  private void handleRemotePushNotification(ReactApplicationContext context, Bundle bundle) {

    // If notification ID is not provided by the user for push notification, generate one at random
    if (bundle.getString("id") == null) {
        SecureRandom randomNumberGenerator = new SecureRandom();
        bundle.putString("id", String.valueOf(randomNumberGenerator.nextInt()));
    }

    Application applicationContext = (Application) context.getApplicationContext();

    RNPushNotificationConfig config = new RNPushNotificationConfig(applicationContext);
    RNPushNotificationHelper pushNotificationHelper = new RNPushNotificationHelper(applicationContext);

    boolean isForeground = pushNotificationHelper.isApplicationInForeground();

    RNPushNotificationJsDelivery jsDelivery = new RNPushNotificationJsDelivery(context);
    bundle.putBoolean("foreground", false);
    bundle.putBoolean("userInteraction", true);
    //pushNotificationHelper.invokeApp(bundle);
    jsDelivery.notifyNotification(bundle);

    // If contentAvailable is set to true, then send out a remote fetch event
    // if (bundle.getString("contentAvailable", "false").equalsIgnoreCase("true")) {
    //     jsDelivery.notifyRemoteFetch(bundle);
    // }

    // if (config.getNotificationForeground() || !isForeground) {
    //     Log.v(TAG, "sendNotification: " + bundle);

    //     pushNotificationHelper.sendToNotificationCentre(bundle);
    // }
  }

  private ReactApplicationContext giveMeTheDamnContext(Context context) {
    ReactApplication reactApplication = ((ReactApplication) context.getApplicationContext());
    ReactInstanceManager reactInstanceManager = reactApplication.getReactNativeHost().getReactInstanceManager();
    ReactApplicationContext reactContext = ((ReactApplicationContext) reactInstanceManager.getCurrentReactContext());
    return reactContext;
  }


  private void handlePushOnceAppIsReady(Context context, Bundle bundle) {
    // We need to run this on the main thread, as the React code assumes that is true.
    // Namely, DevServerHelper constructs a Handler() without a Looper, which triggers:
    // "Can't create handler inside thread that has not called Looper.prepare()"
    Handler handler = new Handler(Looper.getMainLooper());
    handler.post(new Runnable() {
        public void run() {
          ReactApplication reactApplication = ((ReactApplication) context.getApplicationContext());
          ReactInstanceManager reactInstanceManager = reactApplication.getReactNativeHost().getReactInstanceManager();
          ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
          ReactApplicationContext appContext = giveMeTheDamnContext(context);
          if (reactContext == null) {
            reactInstanceManager.addReactInstanceEventListener(
                new ReactInstanceManager.ReactInstanceEventListener() {
                  @Override
                  public void onReactContextInitialized(ReactContext reactContext) {
                    Log.d(TAG, "BRAZE Context initialized sending event");
                    reactInstanceManager.removeReactInstanceEventListener(this);
                    handleRemotePushNotification(appContext, bundle);
                  }
            });
          } else {
            Log.d(TAG, "BRAZE Context was already valid sending event");
            handleRemotePushNotification(appContext, bundle);
          }
        }
    });
  }

  private void handlePushOnceContextIsReady(Context context, Bundle bundle) {
    Log.d(TAG, "BRAZE Called sendEventOnceContextIsReady");
    ReactApplication reactApplication = ((ReactApplication) context.getApplicationContext());
    ReactInstanceManager reactInstanceManager = reactApplication.getReactNativeHost().getReactInstanceManager();
    ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
    ReactApplicationContext appContext = giveMeTheDamnContext(context);
    if (reactContext == null) {
      reactInstanceManager.addReactInstanceEventListener(
          new ReactInstanceManager.ReactInstanceEventListener() {
            @Override
            public void onReactContextInitialized(ReactContext reactContext) {
              Log.d(TAG, "BRAZE Context initialized sending event");
              reactInstanceManager.removeReactInstanceEventListener(this);
              handleRemotePushNotification(appContext, bundle);
            }
      });
    } else {
      Log.d(TAG, "BRAZE Context was already valid sending event");
      handleRemotePushNotification(appContext, bundle);
    }
  }

  private void sendEventOnceContextIsReady(Context context) {
    Log.d(TAG, "BRAZE Called sendEventOnceContextIsReady");
    ReactApplication reactApplication = ((ReactApplication) context.getApplicationContext());
    ReactInstanceManager reactInstanceManager = reactApplication.getReactNativeHost().getReactInstanceManager();
    ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
    if (reactContext == null) {
      reactInstanceManager.addReactInstanceEventListener(
          new ReactInstanceManager.ReactInstanceEventListener() {
            @Override
            public void onReactContextInitialized(ReactContext reactContext) {
              Log.d(TAG, "BRAZE Context initialized sending event");
              reactInstanceManager.removeReactInstanceEventListener(this);
              sendEvent(reactContext, "url", null);
            }
      });
    } else {
      Log.d(TAG, "BRAZE Context was already valid sending event");
      sendEvent(reactContext, "url", null);
    }
  }

  private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
    reactContext.getJSModule(RCTDeviceEventEmitter.class).emit(eventName, params);
  }
}