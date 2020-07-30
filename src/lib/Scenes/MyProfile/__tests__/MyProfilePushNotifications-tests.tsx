import React from "react"

import { Sans, Theme } from "@artsy/palette"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { Switch } from "react-native"
import { act, create } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import {
  MyProfilePushNotifications,
  MyProfilePushNotificationsQueryRenderer,
  SwitchMenu,
} from "../MyProfilePushNotifications"

jest.mock("lib/relay/createEnvironment", () => ({
  defaultEnvironment: require("relay-test-utils").createMockEnvironment(),
}))

jest.unmock("react-relay")
const env = (defaultEnvironment as any) as ReturnType<typeof createMockEnvironment>

describe(SwitchMenu, () => {
  it("renders without throwing an error", () => {
    const props = {
      onChange: jest.fn(),
      value: false,
      title: "SwitchMenu Test",
      description: "Switch Menu Description",
    }
    const switchMenuInstance = create(
      <Theme>
        <SwitchMenu {...props} />
      </Theme>
    )
    // default state
    expect(switchMenuInstance.root.findByType(Switch).props.value).toBe(false)
  })
})

describe(MyProfilePushNotificationsQueryRenderer, () => {
  it("Loads until the operation resolves", () => {
    const tree = create(
      <Theme>
        <MyProfilePushNotificationsQueryRenderer />
      </Theme>
    )
    expect(tree.root.findAllByType(Sans)).toHaveLength(1)
  })

  it("renders without throwing an error", () => {
    const tree = create(<MyProfilePushNotificationsQueryRenderer />)

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
  })
})
