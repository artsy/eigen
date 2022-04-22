package net.artsy.app;

import com.dieam.reactnativepushnotification.modules.RNPushNotificationListenerService;
import com.google.firebase.messaging.RemoteMessage;
import com.braze.push.BrazeFirebaseMessagingService;

public class BrazePushListenerService extends RNPushNotificationListenerService {
  @Override
  public void onMessageReceived(RemoteMessage remoteMessage) {
    super.onMessageReceived(remoteMessage);
    if (BrazeFirebaseMessagingService.handleBrazeRemoteMessage(this, remoteMessage)) {
      // This Remote Message originated from Braze and a push notification was
      // displayed.
      // No further action is needed.
    } else {
      // This Remote Message did not originate from Braze.
      // No action was taken and you can safely pass this Remote Message to other
      // handlers.
    }
  }
}