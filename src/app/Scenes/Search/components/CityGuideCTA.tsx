import { navigate } from "app/navigation/navigate"
import { BMWSponsorship } from "app/Scenes/City/CityBMWSponsorship"
import { ClassTheme, Flex, Spacer, Text } from "palette"
import React from "react"
import { Image, TouchableOpacity } from "react-native"

export class CityGuideCTA extends React.Component {
  render() {
    const cityGuideMapImage = require("../../../../../images/city-guide.webp")
    return (
      <ClassTheme>
        {({ color }) => (
          <Flex>
            <Text variant="md">City Guide</Text>
            <Text color="black60">Discover Galleries, Fairs and Shows around you</Text>
            <Spacer m={1} />
            <TouchableOpacity onPress={() => navigate("/local-discovery")}>
              <Flex
                style={{
                  borderWidth: 1,
                  borderColor: color("black10"),
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <Image source={cityGuideMapImage} style={{ width: "100%", height: 200 }} />
                <Spacer mb={1} />
                <Flex mx={15} mt={10}>
                  <BMWSponsorship pressable={false} />
                </Flex>
              </Flex>
            </TouchableOpacity>
          </Flex>
        )}
      </ClassTheme>
    )
  }
}
