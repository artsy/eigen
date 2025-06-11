import { Switch, Text } from "@artsy/palette-mobile"
import { fireEvent, screen } from "@testing-library/react-native"
import { MyProfilePushNotificationsTestQuery } from "__generated__/MyProfilePushNotificationsTestQuery.graphql"
import { SwitchMenu } from "app/Components/SwitchMenu"
import {
  MyProfilePushNotifications,
  UserPushNotificationSettings,
} from "app/Scenes/MyProfile/MyProfilePushNotifications"
import { PushAuthorizationStatus } from "app/utils/PushNotification"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockFetchNotificationPermissions } from "app/utils/tests/mockFetchNotificationPermissions"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { debounce } from "lodash"
import { Platform } from "react-native"
import relay, { graphql } from "react-relay"

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
    const { root } = renderWithWrappers(<SwitchMenu {...props} />)
    // default state
    const switchElement = await root.findByType(Switch)
    const switchTextElements = await root.findAllByType(Text)

    expect(switchElement.props.disabled).toBe(false)
    expect(switchTextElements[0].props.color).toEqual("mono100")
  })

  it("title is set to mono60 when disabled", async () => {
    const props = {
      onChange: jest.fn(),
      value: false,
      title: "SwitchMenu Test",
      description: "Switch Menu Description",
      disabled: true,
    }
    const { root } = renderWithWrappers(<SwitchMenu {...props} />)
    // default state
    const switchElement = await root.findByType(Switch)
    const switchTextElements = await root.findAllByType(Text)

    expect(switchElement.props.disabled).toBe(true)
    expect(switchTextElements[0].props.color).toEqual("mono60")
  })
})

describe("MyProfilePushNotificationsQueryRenderer", () => {
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
    beforeEach(() => (Platform.OS = "ios"))

    it("should show the allow notification banner if the user was never prompted to allow push notifications", async () => {
      mockFetchNotificationPermissions(false).mockImplementationOnce((cb) =>
        cb(null, PushAuthorizationStatus.NotDetermined)
      )

      renderWithRelay({ Me: () => mockNotificationsPreferences })

      expect(screen.getByText("Artsy would like to send you notifications")).toBeOnTheScreen()
      expect(
        screen.getByText(/We need your permission to send push notifications/i)
      ).toBeOnTheScreen()
    })

    it("should show the open settings banner on iOS if the user did not allow push notifications", async () => {
      mockFetchNotificationPermissions(false).mockImplementationOnce((cb) =>
        cb(null, PushAuthorizationStatus.Denied)
      )

      renderWithRelay({ Me: () => mockNotificationsPreferences })

      expect(screen.getByText("Artsy would like to send you notifications")).toBeOnTheScreen()

      expect(await screen.findByText(/enable them in your iOS Settings/i)).toBeOnTheScreen()
      expect(screen.getByText("Open settings")).toBeOnTheScreen()
    })
  })

  describe("on Android", () => {
    beforeEach(() => (Platform.OS = "android"))

    it("should NEVER show Allow Notification Banner on android", () => {
      mockFetchNotificationPermissions(true).mockImplementationOnce((cb) => cb({ alert: true }))

      renderWithRelay({ Me: () => mockNotificationsPreferences })

      expect(screen.queryByText("Artsy would like to send you notifications")).toBeFalsy()
    })

    // FIXME: Platform.select always defaults to iOS, which breaks this test
    it.skip("should show the open settings banner on Android if the user did not allow push notifications", async () => {
      mockFetchNotificationPermissions(true).mockImplementationOnce((cb) => cb({ alert: false }))

      renderWithRelay({ Me: () => mockNotificationsPreferences })

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
      ;(debounce as jest.Mock).mockImplementation((func) => func)
      mockFetchNotificationPermissions(false).mockImplementationOnce((cb) =>
        cb(null, PushAuthorizationStatus.Authorized)
      )
    })

    it("should set the notification preference to true and false", async () => {
      renderWithRelay({
        Me: () => mockNotificationsPreferences,
      })

      await flushPromiseQueue()

      const switchElement = await screen.findByTestId("newWorksSwitch")

      expect(switchElement.props.on).toBe(true)

      fireEvent(switchElement, "onValueChange", false)

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

      fireEvent(switchElement, "onValueChange", true)

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
