import { Flex, Spacer, Text, useColor } from "@artsy/palette-mobile"
import { SectionTitle } from "app/Components/SectionTitle"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Image } from "react-native"

export const CityGuideCTA: React.FC = () => {
  const enableCityGuideList = useFeatureFlag("AREnableGlobalMapList")
  const cityGuideMapImage = require("images/city-guide-bg.webp")

  const color = useColor()
  return (
    <Flex>
      <SectionTitle title="Explore art on view" />
      <RouterLink to={enableCityGuideList ? "/city-guide" : "/local-discovery"}>
        <Flex
          style={{
            borderWidth: 1,
            borderColor: color("mono10"),
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Image source={cityGuideMapImage} style={{ width: "100%" }} />

          <Flex m="15px">
            <Text variant="sm" weight="medium">
              City Guide
            </Text>

            <Text variant="sm" style={{ color: color("mono60") }}>
              Browse fairs and shows in different cities
            </Text>

            <Spacer y={1} />
          </Flex>
        </Flex>
      </RouterLink>
    </Flex>
  )
}
