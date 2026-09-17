import { Flex } from "@artsy/palette-mobile"
import { CityGuideItinerariesRail_me$key } from "__generated__/CityGuideItinerariesRail_me.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { ItineraryListItem } from "app/Scenes/CityGuide/Components/ItineraryListItem"
import { itineraryStopsCount } from "app/Scenes/CityGuide/utils/itineraryStopsCount"
import { extractNodes } from "app/utils/extractNodes"
import { Schema } from "app/utils/track"
import { FlatList } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

const RAIL_GAP = 10

interface Props {
  citySlug: string
  me: CityGuideItinerariesRail_me$key | null | undefined
}

export const CityGuideItinerariesRail: React.FC<Props> = ({ citySlug, me: meRef }) => {
  const { trackEvent } = useTracking<Schema.Entity>()
  const me = useFragment(fragment, meRef)

  const itineraries = extractNodes(me?.itinerariesConnection).filter(
    (itinerary) => !itinerary.isCurated
  )

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

/**
 * Shared with `refetchCityGuideItinerariesRail` (`CityGuideItinerariesRailQuery.ts`), so every
 * caller that changes an itinerary's stops reads it back through the exact shape the rail
 * itself renders from.
 */
const fragment = graphql`
  fragment CityGuideItinerariesRail_me on Me
  @argumentDefinitions(citySlug: { type: "String!" }, first: { type: "Int!" }) {
    itinerariesConnection(citySlug: $citySlug, first: $first) {
      edges {
        node {
          internalID
          slug
          title
          isCurated
          heroImage {
            url(version: "small")
          }
          stopsCount
        }
      }
    }
  }
`
