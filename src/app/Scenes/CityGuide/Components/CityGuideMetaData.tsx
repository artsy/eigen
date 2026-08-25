import { Flex, Text } from "@artsy/palette-mobile"
import { CityGuideParallaxImage } from "app/Scenes/CityGuide/Components/CityGuideParallaxImage"

const data = {
  title: "London Art Week",
  date: "October 14-18, 2026",
}

export const CityGuideMetaData = () => {
  return (
    <Flex gap={2}>
      <CityGuideParallaxImage src="https://files.artsy.net/images/frame-1000003604.png" />

      <Flex px={2}>
        <Text variant="xs">CITY GUIDE</Text>
        <Text variant="lg-display">{data.title}</Text>
        <Text variant="xs" color="mono60">
          {data.date}
        </Text>
      </Flex>
    </Flex>
  )
}
