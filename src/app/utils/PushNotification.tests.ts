import AsyncStorage from "@react-native-async-storage/async-storage"
import { waitFor } from "@testing-library/react-native"
import { navigate } from "app/navigation/navigate"
import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"
import { PendingPushNotification } from "app/store/PendingPushNotificationModel"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { mockFetchNotificationPermissions } from "app/tests/mockFetchNotificationPermissions"
import { Platform } from "react-native"
import PushNotification from "react-native-push-notification"
import { act } from "react-test-renderer"
import * as Push from "./PushNotification"
import * as pushNotificationUtils from "./pushNotificationUtils"

const mockFetch = jest.fn()

;(global as any).fetch = mockFetch

function mockFetchJsonOnce(json: object, status: number = 200) {
  mockFetch.mockResolvedValueOnce({
    status,
    json: () => Promise.resolve(json),
  })
}

beforeEach(() => {
  mockFetch.mockClear()
})

describe("Push Notification Tests", () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    Platform.OS = "android"
    await AsyncStorage.clear()
  })

  afterAll(async () => {
    jest.clearAllMocks()
    await AsyncStorage.clear()
  })

  it("Initialises", async () => {
    await Push.configure()
    expect(PushNotification.configure).toHaveBeenCalled()
  })

  describe("saveToken", () => {
    it("sends token to gravity if user is logged in", async () => {
      mockFetchJsonOnce({
        xapp_token: "xapp-token",
        expires_in: "never",
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
        email: "user@example.com",
        password: "mypassword",
      })

      mockFetch.mockClear()
      mockFetchJsonOnce({}, 201)

      await Push.saveToken("pushnotificationtoken")
      await flushPromiseQueue()
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

    it("Handles tapped notification instantly if user is logged in", async () => {
      mockFetchJsonOnce({
        xapp_token: "xapp-token",
        expires_in: "never",
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
        email: "user@example.com",
        password: "mypassword",
      })

      mockFetch.mockClear()
      mockFetchJsonOnce({}, 201)

      await flushPromiseQueue()

      Push.handleReceivedNotification(notification)
      expect(navigate).toHaveBeenNthCalledWith(1, notification.data.url, {
        passProps: notification.data,
        ignoreDebounce: true,
      })
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
      const testChannel = { id: "test_channel_id", name: "test_channel_name" }
      Push.createChannel(testChannel.id, testChannel.name)
      expect(PushNotification.createChannel).toHaveBeenCalled()
    })
    it("creates LocalNotification", () => {
      const notification = {
        data: { channelId: Push.CHANNELS[0].id },
        title: "A test push notification",
        foreground: true,
        userInteraction: false,
        badge: 0,
        message: "A test push",
        alert: {},
        id: "22",
        sound: "default",
        // tslint:disable-next-line:no-empty
        finish: () => {},
      }

      PushNotification.channelExists = jest.fn().mockImplementationOnce((_, cb) => {
        cb(true)
      })

      Push.createLocalNotification(notification)
      expect(PushNotification.createChannel).not.toHaveBeenCalled()
      expect(PushNotification.localNotification).toHaveBeenCalled()

      notification.data = { channelId: "unknown_channel_id" }
      PushNotification.channelExists = jest.fn().mockImplementationOnce((_, cb) => {
        cb(false)
      })
      Push.createLocalNotification(notification)
      expect(PushNotification.createChannel).toHaveBeenCalled()
      expect(PushNotification.localNotification).toHaveBeenCalled()
    })
  })

  describe("Notification permission status", () => {
    it("should return Authorized status when there are permissions to alert on Android", async () => {
      mockFetchNotificationPermissions(true).mockImplementationOnce((cb) => cb({ alert: true }))
      const status = await Push.getNotificationPermissionsStatus()

      expect(status).toBe(Push.PushAuthorizationStatus.Authorized)
    })

    it("should return Denied status when there is no permission to alert on Android", async () => {
      mockFetchNotificationPermissions(true).mockImplementationOnce((cb) => cb({ alert: false }))
      const status = await Push.getNotificationPermissionsStatus()
      expect(status).toBe(Push.PushAuthorizationStatus.Denied)
    })
  })

  describe("requesting permission", () => {
    jest.useFakeTimers()

    beforeEach(() => {
      jest.clearAllMocks()
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("shows a settings prompt if the push is denied and we haven't show the settings prompt before", async () => {
      // push disabled
      mockFetchNotificationPermissions(true).mockImplementationOnce((cb) => cb({ alert: false }))

      const mockSettingsPrompt = jest.spyOn(
        pushNotificationUtils,
        "showSettingsEnableNotificationsAlert"
      )
      mockSettingsPrompt.mockReturnValue()

      // has NOT seen settings prompt before
      const mockHasSeenSettings = jest.spyOn(pushNotificationUtils, "hasSeenSettingsPrompt")
      mockHasSeenSettings.mockReturnValue(Promise.resolve(false))

      act(() => {
        Push.requestPushNotificationsPermission()
        jest.runAllTimers()
      })

      await waitFor(() => {
        expect(mockSettingsPrompt).toHaveBeenCalled()
      })
    })

    it("does NOT show a settings prompt if we have shown it before", async () => {
      // push disabled
      mockFetchNotificationPermissions(true).mockImplementationOnce((cb) => cb({ alert: false }))

      const mockSettingsPrompt = jest.spyOn(
        pushNotificationUtils,
        "showSettingsEnableNotificationsAlert"
      )
      mockSettingsPrompt.mockReturnValue()

      // has seen settings prompt before
      const mockHasSeenSettings = jest.spyOn(pushNotificationUtils, "hasSeenSettingsPrompt")
      mockHasSeenSettings.mockReturnValue(Promise.resolve(true))

      act(() => {
        Push.requestPushNotificationsPermission()
        jest.runAllTimers()
      })

      await waitFor(() => {
        expect(mockSettingsPrompt).not.toHaveBeenCalled()
      })
    })

    it("shows a soft ask prompt if user HAS NOT seen the system dialog or the local prompt", async () => {
      // push permission is not determined
      mockFetchNotificationPermissions(false).mockImplementationOnce((cb) =>
        cb(null, Push.PushAuthorizationStatus.NotDetermined)
      )
      Platform.OS = "ios"

      // has NOT seen local prompt before
      const shouldShowLocalPromptAgain = jest.spyOn(
        pushNotificationUtils,
        "shouldShowLocalPromptAgain"
      )
      shouldShowLocalPromptAgain.mockReturnValue(Promise.resolve(true))

      // has NOT seen system prompt before
      const mockHasSeenSystem = jest.spyOn(pushNotificationUtils, "hasSeenSystemPrompt")
      mockHasSeenSystem.mockReturnValue(Promise.resolve(false))

      const mockShowSoftAskPrompt = jest.spyOn(
        pushNotificationUtils,
        "requestPushPermissionWithSoftAsk"
      )
      mockShowSoftAskPrompt.mockReturnValue(Promise.resolve())

      act(() => {
        Push.requestPushNotificationsPermission()
        jest.runAllTimers()
      })

      await waitFor(() => {
        expect(mockShowSoftAskPrompt).toHaveBeenCalled()
      })
    })

    it("requests system permissions otherwise", async () => {
      // push permission is not determined
      mockFetchNotificationPermissions(false).mockImplementationOnce((cb) =>
        cb(null, Push.PushAuthorizationStatus.NotDetermined)
      )
      Platform.OS = "ios"

      // has seen local prompt before
      const shouldShowLocalPromptAgain = jest.spyOn(
        pushNotificationUtils,
        "shouldShowLocalPromptAgain"
      )
      shouldShowLocalPromptAgain.mockReturnValue(Promise.resolve(false))

      // has NOT seen system prompt before
      const mockHasSeenSystem = jest.spyOn(pushNotificationUtils, "hasSeenSystemPrompt")
      mockHasSeenSystem.mockReturnValue(Promise.resolve(false))

      const mockRequestDirectPermissions = jest.spyOn(
        pushNotificationUtils,
        "requestDirectNotificationPermissions"
      )
      mockRequestDirectPermissions.mockReturnValue()

      act(() => {
        Push.requestPushNotificationsPermission()
        jest.runAllTimers()
      })

      await waitFor(() => {
        expect(mockRequestDirectPermissions).toHaveBeenCalled()
      })
    })
  })
})
