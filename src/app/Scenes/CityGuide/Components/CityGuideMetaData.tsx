import { Flex, Text } from "@artsy/palette-mobile"
import { CityGuideParallaxImage } from "app/Scenes/CityGuide/Components/CityGuideParallaxImage"

export const CityGuideMetaData = ({
  cityName,
  citySlug,
}: {
  cityName: string
  citySlug: string
}) => {
  return (
    <Flex backgroundColor="mono100" pb={2}>
      {citySlug.includes("london") ? (
        <CityGuideParallaxImage src="https://files.artsy.net/images/frame-1000003604.png" />
      ) : null}

      <Flex px={2} pt={2}>
        <Text variant="xs" color="mono0">
          CITY GUIDE
        </Text>
        <Text variant="lg-display" color="mono0">
          {cityName}
        </Text>
      </Flex>
    </Flex>
  )
}
