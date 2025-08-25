import notifee, {
  AndroidChannel,
  AndroidImportance,
  EventType,
  Notification,
} from "@notifee/react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import messaging from "@react-native-firebase/messaging"
import { captureMessage } from "@sentry/react-native"
import {
  getCurrentEmissionState,
  GlobalStore,
  unsafe__getEnvironment,
  unsafe_getIsNavigationReady,
  unsafe_getUserAccessToken,
} from "app/store/GlobalStore"
import { PendingPushNotification } from "app/store/PendingPushNotificationModel"
// eslint-disable-next-line no-restricted-imports
import { navigate, navigationEvents } from "app/system/navigation/navigate"
import { Platform } from "react-native"
import DeviceInfo from "react-native-device-info"
import { logAction, logNotification } from "./loggers"
import { SegmentTrackingProvider } from "./track/SegmentTrackingProvider"
import { AnalyticsConstants } from "./track/constants"

export const PUSH_NOTIFICATION_TOKEN = "PUSH_NOTIFICATION_TOKEN"
export const HAS_PENDING_NOTIFICATION = "HAS_PENDING_NOTIFICATION"

const MAX_ELAPSED_TAPPED_NOTIFICATION_TIME = 90 // seconds

export const CHANNELS: AndroidChannel[] = [
  {
    name: "Artsy's default notifications channel",
    id: "Default",
    description: "Artsy's default notifications channel",
    importance: AndroidImportance.HIGH,
  },
]

// TypedNotification extends Notifee's Notification type
type TypedNotification = Notification & { data: any; title?: string }

export enum PushAuthorizationStatus {
  NotDetermined = "notDetermined",
  Authorized = "authorized",
  Denied = "denied",
}

export const savePendingToken = async () => {
  const hasPendingToken = await AsyncStorage.getItem(HAS_PENDING_NOTIFICATION)
  const token = await AsyncStorage.getItem(PUSH_NOTIFICATION_TOKEN)
  if (token && hasPendingToken === "true") {
    const saved = await saveToken(token, true)
    if (saved) {
      await AsyncStorage.removeItem(HAS_PENDING_NOTIFICATION)
    }
  }
}

export const saveToken = (token: string, ignoreSameTokenCheck = true) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<boolean>(async (resolve, reject) => {
    const previousToken = await AsyncStorage.getItem(PUSH_NOTIFICATION_TOKEN)
    if (token !== previousToken || ignoreSameTokenCheck) {
      const { authenticationToken, userAgent } = getCurrentEmissionState()
      if (!authenticationToken) {
        // user is not logged in. The first time a user opens the app, expect token to be gotten before the global store is initialised
        // save the token and send to gravity when they log in
        await AsyncStorage.multiSet([
          [HAS_PENDING_NOTIFICATION, "true"],
          [PUSH_NOTIFICATION_TOKEN, token],
        ])
        reject("Push Notification: No access token")
      } else {
        const environment = unsafe__getEnvironment()
        const url = environment.gravityURL + "/api/v1/device"
        const name = __TEST__ ? "my-device-name" : DeviceInfo.getDeviceId()
        const production = environment.env === "production"
        const body = JSON.stringify({
          name,
          token,
          app_id: "net.artsy.artsy",
          platform: Platform.OS,
          production,
        })
        const headers = {
          "Content-Type": "application/json",
          "X-ACCESS-TOKEN": authenticationToken,
          "User-Agent": userAgent,
        }
        const request = new Request(url, { method: "POST", body, headers })
        let response
        try {
          const res = await fetch(request)
          response = await res.json()
        } catch (error) {
          if (__DEV__) {
            console.warn(`error`, error)
          } else {
            captureMessage(`Error saving push notification token: ${error}`, "error")
          }
        }

        if (response?.status < 200 || response?.status > 299 || response?.error) {
          if (__DEV__) {
            console.warn(`New Push Token ${token} was NOT saved`, response?.error)
          }
          reject("Push Notification: Failed to save new push notification token")
          return
        }
        if (__DEV__) {
          console.log(`New Push Token ${token} saved!`)
        }
        await AsyncStorage.setItem(PUSH_NOTIFICATION_TOKEN, token)
        resolve(true)
      }
    }
  })
}

// Creates Android notification channel (iOS doesn't use channels)
export const createChannel = async (channel: AndroidChannel) => {
  try {
    await notifee.createChannel(channel)
    if (__DEV__) {
      console.log(`NEW CHANNEL ${channel.id} CREATED`)
    }
  } catch (error) {
    if (__DEV__) {
      console.warn(`Failed to create channel ${channel.id}:`, error)
    }
  }
}

export const createAllChannels = async () => {
  await Promise.all(CHANNELS.map((channel) => createChannel(channel)))
}

export const createLocalNotification = async (notification: TypedNotification) => {
  const channelId = notification.data?.channelId ?? CHANNELS[0].id
  const channelName = notification.data?.channelName ?? channelId

  const create = async () => {
    const notificationBody: Notification = {
      title: notification.title ?? "Artsy",
      body: notification.body,
      data: notification.data,
      android: {
        channelId,
        smallIcon: "ic_launcher",
        pressAction: {
          id: "default",
        },
      },
      ios: {
        foregroundPresentationOptions: {
          alert: true,
          badge: true,
          sound: true,
        },
      },
    }

    await notifee.displayNotification(notificationBody)
  }

  try {
    const channels = await notifee.getChannels()
    const channelExists = channels.some((channel) => channel.id === channelId)

    if (channelExists) {
      await create()
    } else {
      await createChannel({
        id: channelId,
        name: channelName,
        importance: AndroidImportance.DEFAULT,
      })
      await create()
    }
  } catch (error) {
    if (__DEV__) {
      console.warn("Failed to create local notification:", error)
    }
  }
}

export const handlePendingNotification = (notification: PendingPushNotification | null) => {
  if (!notification) {
    return
  }
  const elapsedTimeInSecs = Math.floor((Date.now() - notification.tappedAt) / 1000)
  if (elapsedTimeInSecs <= MAX_ELAPSED_TAPPED_NOTIFICATION_TIME && !!notification.data.url) {
    navigate(notification.data.url, { passProps: notification.data })
  }
  GlobalStore.actions.pendingPushNotification.setPendingPushNotification(null)
}

let lastEventTimestamp = 0
const DEBOUNCE_THRESHOLD = 500 // 500ms threshold

export const handleReceivedNotification = (notification: any) => {
  if (__DEV__ && !__TEST__) {
    console.log("RECEIVED NOTIFICATION", notification)
  }

  const isLoggedIn = !!unsafe_getUserAccessToken()
  const isNavigationReady = !!unsafe_getIsNavigationReady()
  if (notification.userInteraction) {
    const now = Date.now()
    // track notification tapped event only in android
    // and also navigate only once to the deeplink url
    // ios handles it in the native side
    // debounce events to avoid double tracking and double navigating

    if (Platform.OS === "android" && now - lastEventTimestamp > DEBOUNCE_THRESHOLD) {
      lastEventTimestamp = now

      SegmentTrackingProvider.postEvent({
        event_name: AnalyticsConstants.NotificationTapped.key,
        label: notification.data.label,
        url: notification.data.url,
        UIApplicationState: notification.foreground ? "active" : "background",
        message: notification?.message?.toString(),
      })

      const hasUrl = !!notification.data.url
      if (isLoggedIn && hasUrl) {
        navigationEvents.emit("requestModalDismiss")
        navigate(notification.data.url as string, {
          passProps: notification.data,
          ignoreDebounce: true,
        })
        // clear any pending notification
        GlobalStore.actions.pendingPushNotification.setPendingPushNotification(null)
        return
      }
    }

    if (!isLoggedIn || !isNavigationReady) {
      // removing finish because we do not use it on android and we don't want to serialise functions at this time
      const newNotification: PendingPushNotification = {
        id: notification.id || Date.now().toString(),
        foreground: notification.foreground || false,
        userInteraction: notification.userInteraction || false,
        message: notification.message || null,
        data: notification.data || {},
        tappedAt: Date.now(),
        finish: undefined,
      }
      GlobalStore.actions.pendingPushNotification.setPendingPushNotification(newNotification)
      return
    }

    return
  }
  if (notification.foreground) {
    // flash notification and put it in Tray
    // In order to have a consistent behaviour in Android & iOS with the most flexibility,
    // it is best to handle it manually by prompting a local notification when onNotification
    // is triggered by a remote push notification on foreground
    const typedNotification: TypedNotification = {
      ...notification,
      data: notification.data || {},
    }
    createLocalNotification(typedNotification).catch((error) => {
      if (__DEV__) {
        console.warn("Failed to create local notification:", error)
      }
    })
  }
}

export const handleNotificationAction = (notification: any) => {
  if (__DEV__) {
    if (logAction) {
      console.log("ACTION:", notification.action)
    }
    if (logNotification) {
      console.log("NOTIFICATION:", notification)
    }
  }
}

// Set up Firebase background message handler (must be called outside of component)
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  if (__DEV__) {
    console.log("Message handled in the background!", remoteMessage)
  }

  // Convert FCM message to our notification format
  if (remoteMessage.notification || remoteMessage.data) {
    const notification = {
      id: remoteMessage.messageId,
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      data: remoteMessage.data || {},
    }

    // Display the notification using Notifee
    await createLocalNotification(notification as TypedNotification)
  }
})

export async function configure() {
  // Get FCM token for push notification registration
  try {
    const fcmToken = await messaging().getToken()
    if (fcmToken) {
      await saveToken(fcmToken)
    }
  } catch (error) {
    if (__DEV__) {
      console.warn("Failed to get FCM token:", error)
    }
    captureMessage(`Error getting FCM token: ${error}`, "error")
  }

  // Listen for token refresh events
  const unsubscribeTokenRefresh = messaging().onTokenRefresh(async (token) => {
    try {
      await saveToken(token)
    } catch (error) {
      if (__DEV__) {
        console.warn("Failed to save refreshed token:", error)
      }
      captureMessage(`Error saving refreshed FCM token: ${error}`, "error")
    }
  })

  // Handle FCM messages when app is in foreground
  const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
    if (__DEV__) {
      console.log("FCM message received in foreground:", remoteMessage)
    }

    // Convert FCM message to our notification format and display
    if (remoteMessage.notification || remoteMessage.data) {
      const notification: TypedNotification = {
        id: remoteMessage.messageId,
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        data: remoteMessage.data || {},
      }

      // Display as local notification
      await createLocalNotification(notification)
    }
  })

  // Set up event handlers for notification interactions
  const unsubscribeForegroundEvents = notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      const notification = {
        data: detail.notification?.data || {},
        userInteraction: true,
        foreground: false,
        message: detail.notification?.title || detail.notification?.body,
      }
      handleReceivedNotification(notification)
    } else if (type === EventType.ACTION_PRESS && detail.pressAction?.id) {
      const notification = {
        action: detail.pressAction.id,
        data: detail.notification?.data || {},
      }
      handleNotificationAction(notification)
    }
  })

  // Handle background events (when app is in background/killed)
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
      const notification = {
        data: detail.notification?.data || {},
        userInteraction: true,
        foreground: false,
        message: detail.notification?.title || detail.notification?.body,
      }
      handleReceivedNotification(notification)
    }
  })

  // Get initial notification if app was opened from a notification
  const initialNotification = await notifee.getInitialNotification()
  if (initialNotification) {
    const notification = {
      data: initialNotification.notification?.data || {},
      userInteraction: true,
      foreground: false,
      message: initialNotification.notification?.title || initialNotification.notification?.body,
    }
    handleReceivedNotification(notification)
  }

  // Create default channels
  await createAllChannels()

  // Return cleanup function
  return () => {
    unsubscribeForegroundEvents()
    unsubscribeTokenRefresh()
    unsubscribeOnMessage()
  }
}

export const getNotificationPermissionsStatus = async (): Promise<PushAuthorizationStatus> => {
  try {
    const settings = await notifee.getNotificationSettings()

    if (Platform.OS === "ios") {
      switch (settings.authorizationStatus) {
        case 1: // AUTHORIZED
          return PushAuthorizationStatus.Authorized
        case 2: // DENIED
          return PushAuthorizationStatus.Denied
        default:
          return PushAuthorizationStatus.NotDetermined
      }
    } else {
      // Android
      return settings.authorizationStatus === 1
        ? PushAuthorizationStatus.Authorized
        : PushAuthorizationStatus.Denied
    }
  } catch (error) {
    if (__DEV__) {
      console.warn("Error getting notification permission status:", error)
    }
    return PushAuthorizationStatus.NotDetermined
  }
}

module.exports = {
  configure,
  saveToken,
  savePendingToken,
  handlePendingNotification,
  handleReceivedNotification,
  createChannel,
  createAllChannels,
  createLocalNotification,
  getNotificationPermissionsStatus,
  CHANNELS,
  PushAuthorizationStatus,
}
