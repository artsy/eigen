import "react-native"

import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"

import { navigate } from "app/navigation/navigate"
import DarkNavigationButton from "./DarkNavigationButton"

it("renders without throwing an error", () => {
  renderWithWrappers(<DarkNavigationButton title="uI am a navigation button" href="/some/path" />)
})

describe("routing", () => {
  it("calls the switchboard with the route", () => {
    const button = new DarkNavigationButton({ title: "any", href: "/my/url" })
    button.openLink()
    expect(navigate).toBeCalledWith("/my/url")
  })

  it("calls onPress in props, if passed instead", () => {
    const myOnPress = jest.fn() as any
    const button = new DarkNavigationButton({ title: "any", onPress: myOnPress })
    button.openLink()
    expect(myOnPress).toBeCalled()
  })
})
