package net.artsy.app;

import android.util.Log;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.appboy.push.AppboyNotificationUtils;
import com.appboy.Constants;
import com.appboy.support.StringUtils;

public class BrazeBroadcastReceiver extends BroadcastReceiver {
  private static final String TAG = BrazeBroadcastReceiver.class.getName();

  @Override
  public void onReceive(Context context, Intent intent) {
    String packageName = context.getPackageName();
    String pushReceivedAction = packageName + AppboyNotificationUtils.APPBOY_NOTIFICATION_RECEIVED_SUFFIX;
    String notificationOpenedAction = packageName + AppboyNotificationUtils.APPBOY_NOTIFICATION_OPENED_SUFFIX;
    String notificationDeletedAction = packageName + AppboyNotificationUtils.APPBOY_NOTIFICATION_DELETED_SUFFIX;

    String action = intent.getAction();
    Log.d(TAG, String.format("Received intent with action %s", action));

    if (pushReceivedAction.equals(action)) {
      Log.d(TAG, "Received push notification.");
    } else if (notificationOpenedAction.equals(action)) {
      Log.d(TAG, "Received push notification opened action.");
      String deepLink = intent.getStringExtra(Constants.APPBOY_PUSH_DEEP_LINK_KEY);
      if (!StringUtils.isNullOrBlank(deepLink)) {
        Log.d(TAG, "Deeplinkg found we need to route ourselves.");
      } else {
        Log.d(TAG, "No deeplink found using appboy default routing.");
        AppboyNotificationUtils.routeUserWithNotificationOpenedIntent(context, intent);
      }
    } else if (notificationDeletedAction.equals(action)) {
      Log.d(TAG, "Received push notification deleted intent.");
    } else {
      Log.d(TAG, String.format("Ignoring intent with unsupported action %s", action));
    }
  }
}