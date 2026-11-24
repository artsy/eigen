import { fireEvent, screen } from "@testing-library/react-native"
import { MyProfilePushNotificationsTestQuery } from "__generated__/MyProfilePushNotificationsTestQuery.graphql"
import { SwitchMenu } from "app/Components/SwitchMenu"
import {
  MyProfilePushNotifications,
  UserPushNotificationSettings,
} from "app/Scenes/MyProfile/MyProfilePushNotifications"
import { PushAuthorizationStatus } from "app/system/notifications/getNotificationsPermissions"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockFetchNotificationPermissions } from "app/utils/tests/mockFetchNotificationPermissions"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { debounce } from "lodash"
import { Platform } from "react-native"
import relay, { graphql } from "react-relay"

jest.mock("app/system/notifications/getNotificationsPermissions", () => ({
  getNotificationPermissionsStatus: jest.fn(),
  PushAuthorizationStatus: {
    NotDetermined: "notDetermined",
    Authorized: "authorized",
    Denied: "denied",
  },
}))

jest.mock("lodash/debounce", () => jest.fn())
jest.mock("app/utils/hooks/useFeatureFlag", () => ({
  useFeatureFlag: () => false,
}))

describe(SwitchMenu, () => {
  it("title is set to mono100 when enabled", async () => {
    const props = {
      onChange: jest.fn(),
      value: false,
      title: "SwitchMenu Test",
      description: "Switch Menu Description",
      disabled: false,
    }
    await renderWithWrappers(<SwitchMenu {...props} />)

    expect(screen.getByRole("switch")).toHaveProp("disabled", false)
    // mono100
    expect(screen.getByText("SwitchMenu Test")).toHaveStyle({ color: "#000000" })
  })

  it("title is set to mono60 when disabled", async () => {
    const props = {
      onChange: jest.fn(),
      value: false,
      title: "SwitchMenu Test",
      description: "Switch Menu Description",
      disabled: true,
    }
    await renderWithWrappers(<SwitchMenu {...props} />)

    expect(screen.getByRole("switch")).toHaveProp("disabled", true)
    // mono60
    expect(screen.getByText("SwitchMenu Test")).toHaveStyle({ color: "#707070" })
  })
})

describe("MyProfilePushNotificationsQueryRenderer", () => {
  // const mockFetchNotificationPermissions = getNotificationPermissionsStatus as jest.Mock

  const { renderWithRelay } = setupTestWrapper<MyProfilePushNotificationsTestQuery>({
    Component: (props) => {
      if (props?.me) {
        return <MyProfilePushNotifications me={props.me} />
      }
      return null
    },
    query: graphql`
      query MyProfilePushNotificationsTestQuery @relay_test_operation {
        me {
          ...MyProfilePushNotifications_me
        }
      }
    `,
  })

  describe("on iOS", () => {
    beforeEach(() => {
      Platform.OS = "ios"
      jest.clearAllMocks()
    })

    it("should show the allow notification banner if the user was never prompted to allow push notifications", async () => {
      mockFetchNotificationPermissions().mockImplementationOnce(() =>
        Promise.resolve(PushAuthorizationStatus.NotDetermined)
      )

      await renderWithRelay({ Me: () => mockNotificationsPreferences })

      expect(screen.getByText("Artsy would like to send you notifications")).toBeOnTheScreen()
      expect(
        screen.getByText(/We need your permission to send push notifications/i)
      ).toBeOnTheScreen()
    })

    it("should show the open settings banner on iOS if the user did not allow push notifications", async () => {
      mockFetchNotificationPermissions().mockImplementationOnce(() =>
        Promise.resolve(PushAuthorizationStatus.Denied)
      )

      await renderWithRelay({ Me: () => mockNotificationsPreferences })

      await flushPromiseQueue()

      expect(screen.getByText("Artsy would like to send you notifications")).toBeOnTheScreen()

      expect(await screen.findByText(/enable them in your iOS Settings/i)).toBeOnTheScreen()
      expect(screen.getByText("Open settings")).toBeOnTheScreen()
    })
  })

  describe("on Android", () => {
    beforeEach(() => {
      Platform.OS = "android"
      Platform.select = jest.fn().mockImplementation((obj) => obj.android)
      ;(debounce as jest.Mock).mockImplementation((func) => func)
    })

    it("should NEVER show Allow Notification Banner on android", async () => {
      mockFetchNotificationPermissions().mockImplementationOnce(() =>
        Promise.resolve(PushAuthorizationStatus.Authorized)
      )

      await renderWithRelay({ Me: () => mockNotificationsPreferences })

      expect(screen.queryByText("Artsy would like to send you notifications")).toBeFalsy()
    })

    it("should show the open settings banner on Android if the user did not allow push notifications", async () => {
      mockFetchNotificationPermissions().mockImplementationOnce(() =>
        Promise.resolve(PushAuthorizationStatus.Denied)
      )

      await renderWithRelay({ Me: () => mockNotificationsPreferences })

      expect(screen.getByText("Artsy would like to send you notifications")).toBeOnTheScreen()

      expect(
        await screen.findByText(/you will need to enable them in your device settings/i)
      ).toBeOnTheScreen()
      expect(screen.getByText("Open settings")).toBeOnTheScreen()
    })
  })

  describe("update notification preferences", () => {
    relay.commitMutation = jest.fn()

    beforeEach(() => {
      jest.clearAllMocks()
      Platform.OS = "android"
      Platform.select = jest.fn().mockImplementation((obj) => obj.android)
      ;(debounce as jest.Mock).mockImplementation((func) => func)
    })

    it("should set the notification preference to true and false", async () => {
      mockFetchNotificationPermissions().mockImplementationOnce(() =>
        Promise.resolve(PushAuthorizationStatus.Authorized)
      )

      await renderWithRelay({
        Me: () => mockNotificationsPreferences,
      })

      await flushPromiseQueue()

      const switchElement = await screen.findByTestId("newWorksSwitch")

      expect(switchElement.props.on).toBe(true)

      await fireEvent(switchElement, "onValueChange", false)

      expect(switchElement.props.on).toBe(false)

      expect(relay.commitMutation).toHaveBeenCalledTimes(1)
      expect(relay.commitMutation).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          variables: {
            input: {
              receiveNewWorksNotification: false,
            },
          },
        })
      )

      await flushPromiseQueue()

      await fireEvent(switchElement, "onValueChange", true)

      expect(switchElement.props.on).toBe(true)

      expect(relay.commitMutation).toHaveBeenCalledTimes(2)
      expect(relay.commitMutation).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          variables: {
            input: {
              receiveNewWorksNotification: true,
            },
          },
        })
      )
    })
  })
})

const mockNotificationsPreferences: Record<UserPushNotificationSettings, boolean> = {
  receiveLotOpeningSoonNotification: true,
  receiveNewSalesNotification: true,
  receiveNewWorksNotification: true,
  receiveOutbidNotification: true,
  receivePromotionNotification: true,
  receivePurchaseNotification: true,
  receiveSaleOpeningClosingNotification: true,
  receiveOrderNotification: true,
  receivePartnerOfferNotification: true,
}
