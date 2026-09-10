import { Flex } from "@artsy/palette-mobile"
import { CityGuideItinerariesRailQuery } from "__generated__/CityGuideItinerariesRailQuery.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { ItineraryListItem } from "app/Scenes/CityGuide/Components/ItineraryListItem"
import { itineraryStopsCount } from "app/Scenes/CityGuide/utils/itineraryStopsCount"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { Schema } from "app/utils/track"
import { FlatList } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"

/** Enough to fill the rail; the header leads to the full list. */
const RAIL_SIZE = 10
const RAIL_GAP = 10
/** The designs' cards size to their content. Capped so one long name cannot fill the screen. */
const MAX_CARD_WIDTH = 264

interface Props {
  citySlug: string
}

const ItinerariesRail: React.FC<Props> = ({ citySlug }) => {
  const { trackEvent } = useTracking<Schema.Entity>()
  const data = useLazyLoadQuery<CityGuideItinerariesRailQuery>(Query, {
    citySlug,
    first: RAIL_SIZE,
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
          `onPress` is what makes SectionTitle tappable at all: without it the component
          renders its children bare rather than wrapping them in a RouterLink
          (SectionTitle.tsx:95), so `href` alone would leave the header and its chevron dead.
          The handler tracks; RouterLink still does the navigating.
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
          <Flex maxWidth={MAX_CARD_WIDTH}>
            <ItineraryListItem
              variant="card"
              title={item.name}
              stopsCount={itineraryStopsCount(item)}
              imageUrl={item.heroImage?.resized?.url ?? item.heroImage?.url}
              // Addressed by slug when it has one, else its id — Query.itinerary takes either.
              href={`/city-guide/${citySlug}/itinerary/${item.slug ?? item.internalID}`}
            />
          </Flex>
        )}
      />
    </Flex>
  )
}

const Query = graphql`
  query CityGuideItinerariesRailQuery($citySlug: String!, $first: Int!) {
    me {
      itinerariesConnection(citySlug: $citySlug, first: $first) {
        edges {
          node {
            internalID
            slug
            name
            heroImage {
              resized(width: 180) {
                url
              }
              url
            }
            sections {
              stopsCount
            }
          }
        }
      }
    }
  }
`

export const CityGuideItinerariesRail = withSuspense({
  Component: ItinerariesRail,
  // Mid-scroll on the home screen, so it stays absent until it has rows rather than
  // reserving space and shifting everything below it.
  LoadingFallback: () => null,
  ErrorFallback: NoFallback,
})
