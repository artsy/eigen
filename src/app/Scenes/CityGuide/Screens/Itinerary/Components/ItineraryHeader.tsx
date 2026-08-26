import { Flex, Text } from "@artsy/palette-mobile"
import { Itinerary } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { Image as RNImage } from "react-native"
import LinearGradient from "react-native-linear-gradient"
// TODO: Replace with Image from @artsy/palette-mobile once we get the data from the API

const HERO_HEIGHT = 300

export const ItineraryHeader: React.FC<{ itinerary: Itinerary }> = ({ itinerary }) => {
  return (
    <Flex>
      <Flex height={HERO_HEIGHT} justifyContent="flex-end">
        <RNImage
          src={itinerary.heroImageUrl}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
          style={{ position: "absolute", width: "100%", height: HERO_HEIGHT }}
        />

        <LinearGradient
          testID="itinerary-hero-scrim"
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={{ position: "absolute", bottom: 0, width: "100%", height: HERO_HEIGHT / 2 }}
        />

        <Flex p={2}>
          <Text variant="xl" color="mono0">
            {itinerary.title}
          </Text>
          <Text variant="sm" color="mono0">
            {itinerary.subtitle}
          </Text>
        </Flex>
      </Flex>

      <Flex px={2} pt={2}>
        <Text variant="xs" color="mono60">
          By {itinerary.authorName}
        </Text>
        <Text variant="sm" mt={1}>
          {itinerary.description}
        </Text>
      </Flex>
    </Flex>
  )
}
