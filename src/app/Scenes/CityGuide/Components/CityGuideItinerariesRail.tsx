import { Flex } from "@artsy/palette-mobile"
import { CityGuideItinerariesRailQuery } from "__generated__/CityGuideItinerariesRailQuery.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { ItineraryListItem } from "app/Scenes/CityGuide/Components/ItineraryListItem"
import {
  CITY_GUIDE_ITINERARIES_RAIL_SIZE,
  cityGuideItinerariesRailQuery,
} from "app/Scenes/CityGuide/utils/CityGuideItinerariesRailQuery"
import { itineraryStopsCount } from "app/Scenes/CityGuide/utils/itineraryStopsCount"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { Schema } from "app/utils/track"
import { FlatList } from "react-native"
import { useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"

const RAIL_GAP = 10

interface Props {
  citySlug: string
}

const ItinerariesRail: React.FC<Props> = ({ citySlug }) => {
  const { trackEvent } = useTracking<Schema.Entity>()
  const data = useLazyLoadQuery<CityGuideItinerariesRailQuery>(cityGuideItinerariesRailQuery, {
    citySlug,
    first: CITY_GUIDE_ITINERARIES_RAIL_SIZE,
  })

  const itineraries = extractNodes(data.me?.itinerariesConnection)

  // Nothing of the user's own for this city renders no band at all, the same way the summary
  // row it replaces hid itself at a count of zero.
  if (!itineraries.length) {
    return null
  }

  return (
    <Flex backgroundColor="mono5" pt={1} pb={2}>
      <Flex px={2}>
        {/*
          `onPress` is what makes SectionTitle tappable — without it, it renders children bare
          instead of wrapping them in a RouterLink, so `href` alone leaves the header dead.
        */}
        <SectionTitle
          variant="large"
          title="Your Itineraries"
          href={`/city-guide/${citySlug}/itineraries`}
          onPress={() => {
            trackEvent({
              action_name: Schema.ActionNames.ViewAll,
              action_type: Schema.ActionTypes.Tap,
              owner_type: Schema.OwnerEntityTypes.CityGuide,
              owner_slug: citySlug,
              context_module: "itineraries",
            })
          }}
        />
      </Flex>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={itineraries}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        ItemSeparatorComponent={() => <Flex width={RAIL_GAP} />}
        keyExtractor={(itinerary) => itinerary.internalID}
        renderItem={({ item }) => (
          <ItineraryListItem
            variant="card"
            title={item.title}
            stopsCount={itineraryStopsCount(item)}
            imageUrl={item.heroImage?.url}
            // Addressed by slug when it has one, else its id — Query.itinerary takes either.
            href={`/city-guide/${citySlug}/itinerary/${item.slug ?? item.internalID}`}
          />
        )}
      />
    </Flex>
  )
}

export const CityGuideItinerariesRail = withSuspense({
  Component: ItinerariesRail,
  // Mid-scroll on the home screen, so it stays absent until it has rows rather than
  // reserving space and shifting everything below it.
  LoadingFallback: () => null,
  ErrorFallback: NoFallback,
})
