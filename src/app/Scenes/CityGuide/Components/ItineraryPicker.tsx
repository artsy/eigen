import { ChevronDownIcon } from "@artsy/icons/native"
import { Flex, Pill, Text } from "@artsy/palette-mobile"
import { ItineraryPickerQuery } from "__generated__/ItineraryPickerQuery.graphql"
import { AutoHeightBottomSheet } from "app/Components/BottomSheet/AutoHeightBottomSheet"
import { itineraryStopsCount } from "app/Scenes/CityGuide/utils/itineraryStopsCount"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { pluralize } from "app/utils/pluralize"
import { useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

interface Props {
  citySlug: string
  /** The itinerary being viewed, so the pill can name it and the list can mark it. */
  currentItineraryId: string
  currentItineraryName: string
}

const Picker: React.FC<Props> = ({ citySlug, currentItineraryId, currentItineraryName }) => {
  const [isOpen, setIsOpen] = useState(false)
  const data = useLazyLoadQuery<ItineraryPickerQuery>(Query, { citySlug, first: 20 })

  const itineraries = extractNodes(data.me?.itinerariesConnection)

  // Always tappable once anything has loaded — gating on "more than one itinerary" read as a
  // dead button for the common case of having exactly one, while nothing can create more yet.
  const canSwitch = itineraries.length > 0

  return (
    <>
      <Pill
        testID="itinerary-picker"
        variant="default"
        Icon={ChevronDownIcon}
        disabled={!canSwitch}
        onPress={() => setIsOpen(true)}
      >
        {currentItineraryName}
      </Pill>

      <AutoHeightBottomSheet visible={isOpen} onDismiss={() => setIsOpen(false)}>
        <Flex py={2}>
          <Flex px={2} pb={1}>
            <Text variant="md">Your Itineraries</Text>
          </Flex>

          {itineraries.map((itinerary) => {
            const stopsCount = itineraryStopsCount(itinerary)
            const isCurrent =
              itinerary.internalID === currentItineraryId || itinerary.slug === currentItineraryId

            return (
              <RouterLink
                key={itinerary.internalID}
                testID="itinerary-picker-option"
                to={`/city-guide/${citySlug}/itinerary/${itinerary.slug ?? itinerary.internalID}`}
                disablePrefetch
                onPress={() => setIsOpen(false)}
              >
                <Flex px={2} py={1}>
                  <Text variant="sm" weight={isCurrent ? "medium" : "regular"}>
                    {itinerary.title}
                  </Text>
                  {stopsCount !== undefined && (
                    <Text variant="xs" color="mono60">
                      {`${stopsCount} ${pluralize("stop", stopsCount)}`}
                    </Text>
                  )}
                </Flex>
              </RouterLink>
            )
          })}
        </Flex>
      </AutoHeightBottomSheet>
    </>
  )
}

const Query = graphql`
  query ItineraryPickerQuery($citySlug: String!, $first: Int!) {
    me {
      itinerariesConnection(citySlug: $citySlug, first: $first) {
        edges {
          node {
            internalID
            slug
            title
            stopsCount
            sections {
              stopsCount
            }
          }
        }
      }
    }
  }
`

/**
 * The pill in the itinerary map's header that names and switches between your itineraries.
 * Rendered only while viewing your own — a curated guide has no peers to switch between.
 */
export const ItineraryPicker = withSuspense({
  Component: Picker,
  // The header must not jump while this loads, and the name is already on the pill once it
  // arrives; a spinner in a 30pt pill would be worse than nothing.
  LoadingFallback: () => null,
  ErrorFallback: NoFallback,
})
