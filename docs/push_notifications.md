# Push Notifications Architecture

## Overview

The app uses a cross-platform push notification system with platform-specific implementations for Android (FCM + Notifee) and iOS (APNS + Native modules).

## Architecture Components

### Core Hook: [usePushNotifications](../src/app/system/notifications/usePushNotifications.ts)

Main entry point that orchestrates all platform-specific hooks:

- Manages notification state
- Delegates to platform-specific listeners
- Triggers notification handling logic

## Architecture Diagrams

### Combined Flow (High-Level)

```mermaid
graph TB
    Start[App Launch] --> usePushNotifications

    usePushNotifications --> Platform{Platform?}

    Platform -->|Android| CreateChannels[Create Notification Channels]

    Platform --> RegisterToken[Register for Remote Messages]
    CreateChannels --> RegisterToken

    RegisterToken --> GetToken{Get Token}
    GetToken -->|Android| FCMToken[FCM Token]
    GetToken -->|iOS| APNSToken[APNS Token via Native Module]

    FCMToken --> SaveToken[Save Token to Gravity]
    APNSToken --> SaveToken

    SaveToken --> Listen{Setup Listeners}

    Listen -->|Android| AndroidListen[Listen to FCM + Notifee Events]
    Listen -->|iOS| iOSListen[Listen to Native Events]

    AndroidListen --> HandleNotification[Handle Notification]
    iOSListen --> HandleNotification[Handle Notification]

```

### Android Flow (Detailed)

```mermaid
sequenceDiagram
    participant App
    participant FCM as Firebase Messaging
    participant Notifee
    participant Handler as useHandlePushNotifications
    participant Gravity

    App->>Notifee: Create notification channels
    App->>FCM: Register device for remote messages
    FCM-->>App: Return FCM token
    App->>Gravity: Save token to Gravity API

    Note over App,Notifee: Listening for notifications...

    alt Foreground notification
        FCM->>App: onMessage event
        App->>Notifee: Check authorization status
        Notifee-->>App: Authorization granted
        App->>Notifee: Display notification
        Notifee->>Notifee: Show notification in tray
        User->>Notifee: Tap notification
        Notifee->>App: onForegroundEvent (PRESS)
        App->>Handler: Set push notification state
    end

    alt Background notification
        FCM->>App: onNotificationOpenedApp
        App->>Handler: Set push notification state
    end

    alt App opened from killed state
        App->>FCM: getInitialNotification
        FCM-->>App: Return notification
        App->>Handler: Set push notification state
    end

    Handler->>Handler: Check login + navigation ready
    Handler->>App: Navigate to URL
    Handler->>Handler: Track analytics event
    Handler->>Handler: Reset notification state
```

### iOS Flow (Detailed)

```mermaid
sequenceDiagram
    participant App
    participant Native as iOS Native Module
    participant APNS
    participant Handler as useHandlePushNotifications
    participant Gravity

    App->>Native: Request push notification permissions
    App->>Native: Register device for remote messages
    Native->>APNS: Register with APNS
    APNS-->>Native: Return APNS token
    Native-->>App: Return token via getPushToken()
    App->>Gravity: Save token to Gravity API

    Note over App,Native: Listening for notifications...

    alt User taps notification
        APNS->>Native: Deliver notification
        User->>Native: Tap notification
        Native->>App: listenToNativeEvents emits event
        App->>App: Check event.type === "NOTIFICATION_RECEIVED"
        App->>App: Check NotificationAction === "Tapped"
        App->>Handler: Set push notification state with payload
    end

    Handler->>Handler: Check login + navigation ready
    Handler->>App: Navigate to URL
    Handler->>Handler: Track analytics event
    Handler->>Handler: Reset notification state
```

## Key Files

- [usePushNotifications.ts](../src/app/system/notifications/usePushNotifications.ts) - Main orchestrator
- [useAndroidListenToPushNotifications.ts](../src/app/system/notifications/useAndroidListenToPushNotifications.ts) - Android listener
- [useIOSListenToPushNotifications.ts](../src/app/system/notifications/useIOSListenToPushNotifications.ts) - iOS listener
- [useHandlePushNotifications.ts](../src/app/system/notifications/useHandlePushNotifications.ts) - Navigation handler
- [useRegisterForRemoteMessages.ts](../src/app/system/notifications/useRegisterForRemoteMessages.ts) - Token registration
- [PushNotification.ts](../src/app/utils/PushNotification.ts) - Gravity token persistence

---

# Sending push notifications to dev or store builds

See our [Push Testing Docs](./push_notifications_testing.md).

<!--
TODO: Add further docs on sending a push notification to your beta/development build
-->
