import React from "react"

import { SwitchMenu } from "lib/Components/SwitchMenu"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Sans } from "palette"
import { NativeModules, Switch } from "react-native"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import {
  AllowPushNotificationsBanner,
  MyProfilePushNotifications,
  MyProfilePushNotificationsQueryRenderer,
  PushAuthorizationStatus,
} from "../MyProfilePushNotifications"

jest.mock("lib/relay/createEnvironment", () => ({
  defaultEnvironment: require("relay-test-utils").createMockEnvironment(),
}))

const mockFetchNotificationPermissions = NativeModules.ARTemporaryAPIModule
  .fetchNotificationPermissions as jest.Mock<any>

jest.unmock("react-relay")

const env = (defaultEnvironment as any) as ReturnType<typeof createMockEnvironment>

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

    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("MyProfilePushNotificationsQuery")

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
          },
        },
      })
    })

    expect(tree.root.findAllByType(MyProfilePushNotifications)).toHaveLength(1)
    expect(tree.root.findByType(MyProfilePushNotifications).props.isLoading).toEqual(undefined)
  })

  it("should show the allow notification banner if the user was never prompted to allow push notifications", () => {
    mockFetchNotificationPermissions.mockImplementationOnce((cb) => cb(null, PushAuthorizationStatus.NotDetermined))

    const tree = renderWithWrappers(<MyProfilePushNotificationsQueryRenderer />)

    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("MyProfilePushNotificationsQuery")

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
          },
        },
      })
    })
    expect(tree.root.findAllByType(AllowPushNotificationsBanner)).toHaveLength(1)
  })

  // it("should show the open settings banner if the user did not allow push notifications", () => {
  //   mockFetchNotificationPermissions.mockImplementationOnce(cb => cb(null, PushAuthorizationStatus.Denied))

  //   const tree = create(
  //     <Theme>
  //       <MyProfilePushNotificationsQueryRenderer />
  //     </Theme>
  //   )

  //   expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("MyProfilePushNotificationsQuery")

  //   act(() => {
  //     env.mock.resolveMostRecentOperation({
  //       errors: [],
  //       data: {
  //         me: {
  //           receiveLotOpeningSoonNotification: true,
  //           receiveNewSalesNotification: true,
  //           receiveNewWorksNotification: true,
  //           receiveOutbidNotification: true,
  //           receivePromotionNotification: true,
  //           receivePurchaseNotification: true,
  //           receiveSaleOpeningClosingNotification: true,
  //         },
  //       },
  //     })
  //   })

  //   console.log(tree.root.findAllByType(ScrollView)[0])

  //   expect(tree.root.findAllByType(OpenSettingsBanner)).toHaveLength(1)
  // })
})
