import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Image, TouchableOpacity } from "react-native"
import { CityGuideCTA } from "../CityGuideCTA"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

describe("Search page empty state", () => {
  it(`renders correctly`, async () => {
    const tree = renderWithWrappers(<CityGuideCTA />)
    expect(extractText(tree.root)).toContain("Explore Art on View")
    expect(tree.root.findAllByType(Image)).toHaveLength(2)
  })

  it(`navigates to cityGuide link`, () => {
    const tree = renderWithWrappers(<CityGuideCTA />)
    tree.root.findByType(TouchableOpacity).props.onPress()
    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(expect.anything(), "/local-discovery")
  })
})
