package net.artsy.app;

import com.dieam.reactnativepushnotification.modules.RNPushNotificationListenerService;
import com.google.firebase.messaging.RemoteMessage;
import com.appboy.AppboyFirebaseMessagingService;

public class BrazeMessagingService extends RNPushNotificationListenerService {
  @Override
  public void onMessageReceived(RemoteMessage remoteMessage) {
    if (AppboyFirebaseMessagingService.handleBrazeRemoteMessage(this, remoteMessage)) {
      // This Remote Message originated from Braze and a push notification was
      // displayed.
      // No further action is needed.

    } else {
      super.onMessageReceived(remoteMessage);
      // This Remote Message did not originate from Braze.
      // No action was taken and you can safely pass this Remote Message to other
      // handlers.
    }
  }
}