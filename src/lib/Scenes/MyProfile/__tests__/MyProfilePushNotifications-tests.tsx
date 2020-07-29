import React from "react"
import * as renderer from "react-test-renderer"

import { Theme } from "@artsy/palette"
import { Switch } from "react-native"
import { MyProfilePushNotifications, SwitchMenu } from "../MyProfilePushNotifications"

describe(SwitchMenu, () => {
  it("renders without throwing an error", () => {
    const props = {
      onChange: jest.fn(),
      value: false,
      title: "SwitchMenu Test",
      description: "Switch Menu Description",
    }
    const switchMenuInstance = renderer.create(
      <Theme>
        <SwitchMenu {...props} />
      </Theme>
    )
    // default state
    expect(switchMenuInstance.root.findByType(Switch).props.value).toBe(false)
  })
})

describe(MyProfilePushNotifications, () => {
  it("renders without throwing an error", () => {
    renderer.create(<MyProfilePushNotifications />)
  })
})
