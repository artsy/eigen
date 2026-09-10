import { Flex, Text } from "@artsy/palette-mobile"
import {
  ItineraryAddFullListButton,
  ItineraryAddFullListStatus,
} from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryAddFullListButton"
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
          testID="itinerary-hero-image"
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
          {/* The designs label your own itinerary above its name. A curated guide has its
              byline instead, below. */}
          {!itinerary.isCurated && (
            <Text variant="xs" color="mono0">
              Your Itinerary
            </Text>
          )}

          <Text variant="xl" color="mono0">
            {itinerary.title}
          </Text>
          <Text variant="sm" color="mono0">
            {itinerary.subtitle}
          </Text>
        </Flex>
      </Flex>

      <Flex px={2} pt={2}>
        <Flex
          flexDirection="row"
          alignItems="center"
          // Nothing on the left for your own itinerary, so the button keeps the right edge
          // rather than drifting to the middle of an otherwise empty row.
          justifyContent={itinerary.isCurated ? "space-between" : "flex-end"}
        >
          {/* No byline on your own itinerary: it is all by you. */}
          {!!itinerary.isCurated && (
            <Text variant="xs" color="mono60">
              By {itinerary.authorName}
            </Text>
          )}

          <ItineraryAddFullListButton citySlug={itinerary.citySlug} itineraryId={itinerary.id} />
        </Flex>

        <ItineraryAddFullListStatus />

        <Text variant="sm" mt={1}>
          {itinerary.description}
        </Text>
      </Flex>
    </Flex>
  )
}
