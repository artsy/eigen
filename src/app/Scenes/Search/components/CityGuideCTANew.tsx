import { navigate } from "app/navigation/navigate"
import { ClassTheme, Flex, Spacer, Text, Touchable } from "palette"
import React from "react"
import { Image } from "react-native"

export const CityGuideCTANew = () => {
  const mapImage = require("images/city-guide.webp")

  return (
    <ClassTheme>
      {({ color }) => (
        <Flex>
          <Text variant="lg">City Guide</Text>
          <Text color="black60">Discover Galleries, Fairs and Shows around you</Text>
          <Spacer m={1} />
          <Touchable onPress={() => navigate("/map")}>
            <Flex
              style={{
                borderWidth: 1,
                borderColor: color("black10"),
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <Image source={mapImage} style={{ width: "100%", height: 360 }} />
            </Flex>
          </Touchable>
        </Flex>
      )}
    </ClassTheme>
  )
}
