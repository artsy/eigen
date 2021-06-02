import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Button } from "palette"
import React from "react"
import { SavedSearchBanner } from "../SavedSearchBanner"

describe("SavedSearchBanner", () => {
  it("renders correctly disabled state", () => {
    const onPress = jest.fn()
    const tree = renderWithWrappers(<SavedSearchBanner enabled={false} onPress={onPress} />)
    const buttonComponent = tree.root.findByType(Button)

    expect(buttonComponent.props.children).toEqual("Enable")
    expect(buttonComponent.props.variant).toBe("primaryBlack")
  })

  it("renders correctly enabled state", () => {
    const onPress = jest.fn()
    const tree = renderWithWrappers(<SavedSearchBanner enabled={true} loading={true} onPress={onPress} />)
    const buttonComponent = tree.root.findByType(Button)

    expect(buttonComponent.props.children).toEqual("Disable")
    expect(buttonComponent.props.variant).toBe("secondaryOutline")
  })

  it("renders correctly loading state", () => {
    const onPress = jest.fn()
    const tree = renderWithWrappers(<SavedSearchBanner enabled={false} loading={true} onPress={onPress} />)
    const buttonComponent = tree.root.findByType(Button)

    expect(buttonComponent.props.loading).toBe(true)
  })

  it("calls onPress when button is pressed", () => {
    const onPress = jest.fn()
    const tree = renderWithWrappers(<SavedSearchBanner enabled={false} loading={false} onPress={onPress} />)
    const buttonComponent = tree.root.findByType(Button)

    buttonComponent.props.onPress()
    expect(onPress).toHaveBeenCalled()
  })
})
