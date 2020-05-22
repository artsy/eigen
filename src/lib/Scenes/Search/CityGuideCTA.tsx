import { color, Flex, Sans } from "@artsy/palette"
import { SectionTitle } from "lib/Components/SectionTitle"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { Image, TouchableOpacity } from "react-native"

export class CityGuideCTA extends React.Component {
  render() {
    const cityGuideMapImage = require("../../../../images/city-guide-bg.png")
    return (
      <Flex>
        <SectionTitle title="Explore Art on View by City" />
        <TouchableOpacity onPress={() => SwitchBoard.presentNavigationViewController(this, "/local-discovery")}>
          <Flex style={{ borderWidth: 1, borderColor: color("black10"), borderRadius: 4, overflow: "hidden" }}>
            <Image source={cityGuideMapImage} style={{ width: "100%" }} />
            <Flex m={15}>
              <Sans size="3t">City Guide</Sans>
              <Sans size="3t" style={{ color: color("black60") }}>
                Fairs and shows in New York, Los Angeles, London, Berlin, Paris, and Hong Kong
              </Sans>
            </Flex>
          </Flex>
        </TouchableOpacity>
      </Flex>
    )
  }
}
