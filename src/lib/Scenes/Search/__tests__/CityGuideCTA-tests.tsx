import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { extractText } from "lib/tests/extractText"
import React from "react"
import { Image, TouchableOpacity } from "react-native"
import { create } from "react-test-renderer"
import { CityGuideCTA } from "../CityGuideCTA"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

describe("Search page empty state", () => {
  it(`renders correctly`, async () => {
    const tree = create(<CityGuideCTA />)
    expect(extractText(tree.root)).toContain("Explore Art on View by City")
    expect(tree.root.findAllByType(Image)).toHaveLength(2)
  })

  it(`navigates to cityGuide link`, () => {
    const tree = create(<CityGuideCTA />)
    tree.root.findByType(TouchableOpacity).props.onPress()
    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(expect.anything(), "/local-discovery")
  })
})
