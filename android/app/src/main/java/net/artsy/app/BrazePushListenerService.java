package net.artsy.app;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.braze.push.BrazeFirebaseMessagingService;

public class BrazePushListenerService extends FirebaseMessagingService {
  @Override
  public void onMessageReceived(RemoteMessage remoteMessage) {
    if (BrazeFirebaseMessagingService.handleBrazeRemoteMessage(this, remoteMessage)) {
      // This Remote Message originated from Braze and a push notification was
      // displayed.
      // No further action is needed.
    } else {
      // This Remote Message did not originate from Braze.
      // React Native Firebase will handle this automatically through its own service
      // No additional handling needed here as React Native Firebase registers its own service
    }
  }

  @Override
  public void onNewToken(String token) {
    super.onNewToken(token);
    // React Native Firebase will handle token updates automatically
    // through its own messaging service registration
  }
}