import "react-native"

import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

import SwitchBoard from "lib/NativeModules/SwitchBoard"
import DarkNavigationButton from "../DarkNavigationButton"

import { Theme } from "@artsy/palette"

it("renders without throwing an error", () => {
  renderWithWrappers(
    <Theme>
      <DarkNavigationButton title={"uI am a navigation button"} href="/some/path" />
    </Theme>
  )
})

describe("routing", () => {
  it("calls the switchboard with the route", () => {
    const button = new DarkNavigationButton({ title: "any", href: "/my/url" })
    button.openLink()
    expect(SwitchBoard.presentNavigationViewController).toBeCalledWith(button, "/my/url")
  })

  it("calls onPress in props, if passed instead", () => {
    const myOnPress = jest.fn() as any
    const button = new DarkNavigationButton({ title: "any", onPress: myOnPress })
    button.openLink()
    expect(myOnPress).toBeCalled()
  })
})
