import notifee, { AndroidImportance } from "@notifee/react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"
import { PendingPushNotification } from "app/store/PendingPushNotificationModel"
import { navigate } from "app/system/navigation/navigate"
import * as Push from "app/utils/PushNotification"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { Platform } from "react-native"

Object.defineProperty(Platform, "OS", { get: jest.fn(() => "android") }) // We only use this for android only for now
const mockFetch = jest.fn()

;(global as any).fetch = mockFetch

function mockFetchJsonOnce(json: object, status = 200) {
  mockFetch.mockResolvedValueOnce({
    status,
    json: () => Promise.resolve(json),
  })
}

describe("Push Notification Tests", () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await AsyncStorage.clear()
  })

  afterAll(async () => {
    jest.clearAllMocks()
    await AsyncStorage.clear()
  })

  it("Initialises", async () => {
    const cleanup = await Push.configure()
    expect(typeof cleanup).toBe("function")
    cleanup()
  })

  describe("saveToken", () => {
    it("sends token to gravity if user is logged in", async () => {
      const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

      mockFetchJsonOnce({
        xapp_token: "xapp-token",
        expires_in: oneWeekFromNow,
      })
      await GlobalStore.actions.auth.getXAppToken()
      mockFetch.mockClear()
      // log user in
      mockFetchJsonOnce(
        {
          access_token: "auth-access-token",
          expires_in: "1000years",
        },
        201
      )
      mockFetchJsonOnce({
        id: "userid",
      })
      await GlobalStore.actions.auth.signIn({
        oauthProvider: "email",
        oauthMode: "email",
        email: "user@example.com",
        password: "mypassword",
      })

      mockFetch.mockClear()
      mockFetchJsonOnce({}, 201)

      await Push.saveToken("pushnotificationtoken")
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it("does not try to save token to gravity when user is Not logged in", async () => {
      expect(Push.saveToken("sometoken")).rejects.toMatch("Push Notification: No access token")

      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe("Handling Notifications", () => {
    const notification = {
      channelId: "fcm_fallback_notification_channel",
      color: null,
      data: {
        url: "https://www.artsy.net/artwork/fabrice-monteiro-signares-number-3-goree",
        id: "0",
      },
      finish: () => {
        //
      },
      badge: 0,
      alert: {},
      foreground: true,
      id: "411091002",
      message: "New Works by Artists you love!",
      priority: "high",
      smallIcon: "ic_notification",
      sound: "default",
      tag: null,
      title: "New Works by Artists you love!",
      userInteraction: true, // notification was tapped
    }

    it("Handles tapped notification instantly if user is logged in and nav is ready", async () => {
      const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

      mockFetchJsonOnce({
        xapp_token: "xapp-token",
        expires_in: oneWeekFromNow,
      })
      await GlobalStore.actions.auth.getXAppToken()
      mockFetch.mockClear()
      // log user in
      mockFetchJsonOnce(
        {
          access_token: "auth-access-token",
          expires_in: "1000years",
        },
        201
      )
      mockFetchJsonOnce({
        id: "userid",
      })
      await GlobalStore.actions.auth.signIn({
        oauthProvider: "email",
        oauthMode: "email",
        email: "user@example.com",
        password: "mypassword",
      })
      __globalStoreTestUtils__?.injectState({ sessionState: { isNavigationReady: true } })

      mockFetch.mockClear()
      mockFetchJsonOnce({}, 201)

      await flushPromiseQueue()

      Push.handleReceivedNotification(notification)
      expect(navigate).toHaveBeenNthCalledWith(1, notification.data.url, {
        passProps: notification.data,
        ignoreDebounce: true,
      })
    })

    it("Saves tapped notification When a user is not logged in", () => {
      Push.handleReceivedNotification(notification)
      expect(
        __globalStoreTestUtils__?.getCurrentState().pendingPushNotification.notification
      ).toHaveProperty("tappedAt")
      expect(
        __globalStoreTestUtils__?.getCurrentState().pendingPushNotification.notification?.data
      ).toEqual(notification.data)
      // notification is not handled
      expect(navigate).not.toHaveBeenCalled()
    })

    it("Pending Notification: navigates to appropriate screen when called", () => {
      Push.handleReceivedNotification(notification)
      const pendingNotification =
        __globalStoreTestUtils__?.getCurrentState().pendingPushNotification.notification
      Push.handlePendingNotification(pendingNotification as PendingPushNotification)
      expect(navigate).toHaveBeenNthCalledWith(1, notification.data.url, {
        passProps: notification.data,
      })
    })
  })

  describe("Channels and Local Notifications", () => {
    it("creates Channel", async () => {
      const testChannel = {
        id: "test_channel_id",
        name: "test_channel_name",
        importance: AndroidImportance.HIGH,
      }
      await Push.createChannel(testChannel)
      expect(notifee.createChannel).toHaveBeenCalled()
    })
    it("creates LocalNotification", async () => {
      const notification = {
        data: { channelId: Push.CHANNELS[0].id },
        title: "A test push notification",
        body: "A test push",
      }

      // Mock existing channel
      ;(notifee.getChannels as jest.Mock).mockResolvedValueOnce([
        { id: Push.CHANNELS[0].id, name: "Test Channel" },
      ])

      await Push.createLocalNotification(notification)
      expect(notifee.displayNotification).toHaveBeenCalled()

      // Mock non-existing channel
      notification.data = { channelId: "unknown_channel_id" }
      ;(notifee.getChannels as jest.Mock).mockResolvedValueOnce([])

      await Push.createLocalNotification(notification)
      expect(notifee.createChannel).toHaveBeenCalled()
      expect(notifee.displayNotification).toHaveBeenCalled()
    })
  })

  describe("Notification permission status", () => {
    it("should return Authorized status when there are permissions on Android", async () => {
      ;(notifee.getNotificationSettings as jest.Mock).mockResolvedValueOnce({
        authorizationStatus: 1, // AUTHORIZED
      })
      const status = await Push.getNotificationPermissionsStatus()

      expect(status).toBe(Push.PushAuthorizationStatus.Authorized)
    })

    it("should return Denied status when there is no permission on Android", async () => {
      ;(notifee.getNotificationSettings as jest.Mock).mockResolvedValueOnce({
        authorizationStatus: 2, // DENIED
      })
      const status = await Push.getNotificationPermissionsStatus()

      expect(status).toBe(Push.PushAuthorizationStatus.Denied)
    })
  })
})
