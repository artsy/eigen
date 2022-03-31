import { navigate } from "app/navigation/navigate"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { Image, TouchableOpacity } from "react-native"
import { CityGuideCTA } from "./CityGuideCTA"

describe("Search page empty state", () => {
  it(`renders correctly`, async () => {
    const tree = renderWithWrappers(<CityGuideCTA />)
    expect(extractText(tree.root)).toContain("City Guide")
    expect(tree.root.findAllByType(Image)).toHaveLength(2)
  })

  it(`navigates to cityGuide link`, () => {
    const tree = renderWithWrappers(<CityGuideCTA />)
    tree.root.findByType(TouchableOpacity).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/local-discovery")
  })
})
