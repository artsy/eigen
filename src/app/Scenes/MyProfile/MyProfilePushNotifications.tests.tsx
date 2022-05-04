import { SwitchMenu } from "app/Components/SwitchMenu"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { mockFetchNotificationPermissions } from "app/tests/mockFetchNotificationPermissions"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { PushAuthorizationStatus } from "app/utils/PushNotification"
import { Sans } from "palette"
import React from "react"
import { Platform, Switch } from "react-native"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import {
  AllowPushNotificationsBanner,
  MyProfilePushNotifications,
  MyProfilePushNotificationsQueryRenderer,
  OpenSettingsBanner,
} from "./MyProfilePushNotifications"

jest.unmock("react-relay")

const env = defaultEnvironment as ReturnType<typeof createMockEnvironment>

describe(SwitchMenu, () => {
  it("title is set to black100 when enabled", () => {
    const props = {
      onChange: jest.fn(),
      value: false,
      title: "SwitchMenu Test",
      description: "Switch Menu Description",
      disabled: false,
    }
    const switchMenuInstance = renderWithWrappers(<SwitchMenu {...props} />)
    // default state
    expect(switchMenuInstance.root.findByType(Switch).props.disabled).toBe(false)
    expect(switchMenuInstance.root.findAllByType(Sans)[0].props.color).toEqual("black100")
  })

  it("title is set to black60 when disabled", () => {
    const props = {
      onChange: jest.fn(),
      value: false,
      title: "SwitchMenu Test",
      description: "Switch Menu Description",
      disabled: true,
    }
    const switchMenuInstance = renderWithWrappers(<SwitchMenu {...props} />)
    // default state
    expect(switchMenuInstance.root.findByType(Switch).props.disabled).toBe(true)
    expect(switchMenuInstance.root.findAllByType(Sans)[0].props.color).toEqual("black60")
  })
})

describe(MyProfilePushNotificationsQueryRenderer, () => {
  it("Loads until the operation resolves", () => {
    const tree = renderWithWrappers(<MyProfilePushNotificationsQueryRenderer />)
    expect(tree.root.findAllByType(MyProfilePushNotifications)).toHaveLength(1)
    expect(tree.root.findByType(MyProfilePushNotifications).props.isLoading).toEqual(true)
  })

  it("renders without throwing an error", () => {
    const tree = renderWithWrappers(<MyProfilePushNotificationsQueryRenderer />)

    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "MyProfilePushNotificationsQuery"
    )

    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          me: {
            receiveLotOpeningSoonNotification: true,
            receiveNewSalesNotification: true,
            receiveNewWorksNotification: true,
            receiveOutbidNotification: true,
            receivePromotionNotification: true,
            receivePurchaseNotification: true,
            receiveSaleOpeningClosingNotification: true,
            receiveOrderNotification: true,
          },
        },
      })
    })

    expect(tree.root.findAllByType(MyProfilePushNotifications)).toHaveLength(1)
    expect(tree.root.findByType(MyProfilePushNotifications).props.isLoading).toEqual(undefined)
  })

  it("should show the allow notification banner if the user was never prompted to allow push notifications", () => {
    mockFetchNotificationPermissions(false).mockImplementationOnce((cb) =>
      cb(null, PushAuthorizationStatus.NotDetermined)
    )
    Platform.OS = "ios"
    const tree = renderWithWrappers(<MyProfilePushNotificationsQueryRenderer />)

    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "MyProfilePushNotificationsQuery"
    )

    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          me: {
            receiveLotOpeningSoonNotification: true,
            receiveNewSalesNotification: true,
            receiveNewWorksNotification: true,
            receiveOutbidNotification: true,
            receivePromotionNotification: true,
            receivePurchaseNotification: true,
            receiveSaleOpeningClosingNotification: true,
            receiveOrderNotification: true,
          },
        },
      })
    })
    expect(tree.root.findAllByType(AllowPushNotificationsBanner)).toHaveLength(1)
  })

  it("should NEVER show Allow Notification Banner on android", () => {
    mockFetchNotificationPermissions(true).mockImplementationOnce((cb) => cb({ alert: true }))
    Platform.OS = "android"

    const tree = renderWithWrappers(<MyProfilePushNotificationsQueryRenderer />)

    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "MyProfilePushNotificationsQuery"
    )

    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          me: {
            receiveLotOpeningSoonNotification: true,
            receiveNewSalesNotification: true,
            receiveNewWorksNotification: true,
            receiveOutbidNotification: true,
            receivePromotionNotification: true,
            receivePurchaseNotification: true,
            receiveSaleOpeningClosingNotification: true,
            receiveOrderNotification: true,
          },
        },
      })
    })
    expect(tree.root.findAllByType(AllowPushNotificationsBanner)).toHaveLength(0)
  })

  it("should show the open settings banner on iOS if the user did not allow push notifications", async () => {
    mockFetchNotificationPermissions(false).mockImplementationOnce((cb) =>
      cb(null, PushAuthorizationStatus.Denied)
    )
    Platform.OS = "ios"
    const tree = renderWithWrappers(<MyProfilePushNotificationsQueryRenderer />)

    await flushPromiseQueue()
    tree.update(<MyProfilePushNotificationsQueryRenderer />)
    expect(tree.root.findAllByType(OpenSettingsBanner)).toHaveLength(1)
  })
})

it("should show the open settings banner on Android if the user did not allow push notifications", async () => {
  mockFetchNotificationPermissions(true).mockImplementationOnce((cb) => cb({ alert: false }))
  Platform.OS = "android"
  const tree = renderWithWrappers(<MyProfilePushNotificationsQueryRenderer />)
  await flushPromiseQueue()
  tree.update(<MyProfilePushNotificationsQueryRenderer />)
  expect(tree.root.findAllByType(OpenSettingsBanner)).toHaveLength(1)
})
