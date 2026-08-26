import { Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import { getMockItinerary } from "app/Scenes/CityGuide/Screens/Itinerary/utils/mockItineraries"
import { RouterLink } from "app/system/navigation/RouterLink"
// TODO: Replace with Image from @artsy/palette-mobile once we get the data from the API
import { Image as RNImage } from "react-native"

const IMAGE_SIZE = 80

const ListItem = ({ item, citySlug }: { item: (typeof data)[0]; citySlug: string }) => {
  return (
    // No `hasChildTouchable`: that mode makes RouterLink render nothing itself and clone
    // onPress onto its child (RouterLink.tsx:92-99). The child here is a styled View, which
    // ignores onPress, so the row would not be pressable at all. Without the prop,
    // RouterLink renders its own Touchable (RouterLink.tsx:103) and carries the testID.
    <RouterLink
      testID="curated-list-row"
      to={`/city-guide/${citySlug}/itinerary/${item.itineraryId}`}
    >
      <Flex flexDirection="row" gap={1}>
        <RNImage
          src={item.image}
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />

        <Flex flex={1}>
          <Text variant="lg-display">{item.title}</Text>
          <Text variant="xs" color="mono60">
            By {item.author}
          </Text>
        </Flex>
      </Flex>
    </RouterLink>
  )
}

export const CityGuideCuratedLists = ({ citySlug }: { citySlug: string }) => {
  // The mock rows are a static constant but itineraries are per-city, so an unfiltered
  // list gives every non-London city three rows that all dead-end into the unavailable
  // state. Filter to rows that actually resolve, and render nothing when none do.
  const rows = data.filter((item) => !!getMockItinerary(citySlug, item.itineraryId))

  if (!rows.length) {
    return null
  }

  return (
    <Flex px={2}>
      <Join separator={<Spacer y={2} />}>
        {rows.map((item) => (
          <ListItem key={item.id} item={item} citySlug={citySlug} />
        ))}
      </Join>
    </Flex>
  )
}

// itineraryId values must match MOCK_ITINERARIES entries; every row has to resolve.
const data = [
  {
    id: 1,
    itineraryId: "chill-vibes-only",
    image: "https://picsum.photos/200/300.jpg",
    title: "Chill Vibes Only",
    author: "Casey Lesser",
  },
  {
    id: 2,
    itineraryId: "36-hours-in-london",
    image: "https://picsum.photos/200/300.jpg",
    title: "36 Hours in London",
    author: "Casey Lesser",
  },
  {
    id: 3,
    itineraryId: "must-sees-and-hidden-gems",
    image: "https://picsum.photos/200/300.jpg",
    title: "Must Sees & Hidden Gems",
    author: "Casey Lesser",
  },
]
