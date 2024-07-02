import { Spacer, Flex, useColor, Text } from "@artsy/palette-mobile"
import { SectionTitle } from "app/Components/SectionTitle"
import { useConditionalNavigate } from "app/system/newNavigation/useConditionalNavigate"
import { Image, TouchableOpacity } from "react-native"

export const CityGuideCTA: React.FC = () => {
  const cityGuideMapImage = require("images/city-guide-bg.webp")
  const color = useColor()
  const navigate = useConditionalNavigate()

  return (
    <Flex>
      <SectionTitle title="Explore art on view" />
      <TouchableOpacity onPress={() => navigate("/local-discovery")}>
        <Flex
          style={{
            borderWidth: 1,
            borderColor: color("black10"),
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Image source={cityGuideMapImage} style={{ width: "100%" }} />
          <Flex m="15px">
            <Text variant="sm" weight="medium">
              City Guide
            </Text>
            <Text variant="sm" style={{ color: color("black60") }}>
              Browse fairs and shows in different cities
            </Text>
            <Spacer y={1} />
          </Flex>
        </Flex>
      </TouchableOpacity>
    </Flex>
  )
}
