package net.artsy.app;

import com.dieam.reactnativepushnotification.modules.RNPushNotificationListenerService;
import com.google.firebase.messaging.RemoteMessage;
import com.appboy.AppboyFirebaseMessagingService;

import android.util.Log;

public class BrazeMessagingService extends RNPushNotificationListenerService {
  private static final String TAG = MainApplication.class.getName();

  @Override
  public void onMessageReceived(RemoteMessage remoteMessage) {
    if (AppboyFirebaseMessagingService.handleBrazeRemoteMessage(this, remoteMessage)) {
      // This Remote Message originated from Braze and a push notification was
      // displayed.
      // No further action is needed.
      Log.i(TAG, "BRAZE onMessageReceived handled by braze");
    } else {
      // This Remote Message did not originate from Braze.
      // No action was taken and you can safely pass this Remote Message to other
      // handlers.
      Log.i(TAG, "BRAZE onMessageReceived passing to other class");
      super.onMessageReceived(remoteMessage);
    }
  }
}