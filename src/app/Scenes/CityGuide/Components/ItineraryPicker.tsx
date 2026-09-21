import { ChevronDownIcon } from "@artsy/icons/native"
import { Flex, Pill, Text, Touchable } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { ItineraryPickerQuery } from "__generated__/ItineraryPickerQuery.graphql"
import { ItineraryScreenQuery } from "__generated__/ItineraryScreenQuery.graphql"
import { AutoHeightBottomSheet } from "app/Components/BottomSheet/AutoHeightBottomSheet"
import { itineraryQuery } from "app/Scenes/CityGuide/Screens/Itinerary/ItineraryScreen"
import { itineraryStopsCount } from "app/Scenes/CityGuide/utils/itineraryStopsCount"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { pluralize } from "app/utils/pluralize"
import { useState } from "react"
import { fetchQuery, graphql, useLazyLoadQuery, useRelayEnvironment } from "react-relay"

interface Props {
  citySlug: string
  /** The itinerary being viewed, so the pill can name it and the list can mark it. */
  currentItineraryId: string
  currentItineraryName: string
}

const Picker: React.FC<Props> = ({ citySlug, currentItineraryId, currentItineraryName }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)
  // AuthenticatedRoutesParams types every route's params as `undefined` since they're passed
  // dynamically at runtime — this screen's own `itineraryId` route param included — so
  // `setParams` needs a param list that actually reflects what this screen can be given.
  const navigation = useNavigation<NavigationProp<Record<string, { itineraryId: string }>>>()
  const environment = useRelayEnvironment()
  const data = useLazyLoadQuery<ItineraryPickerQuery>(Query, { citySlug, first: 20 })

  const itineraries = extractNodes(data.me?.itinerariesConnection)

  // Always tappable once anything has loaded — gating on "more than one itinerary" read as a
  // dead button for the common case of having exactly one, while nothing can create more yet.
  const canSwitch = itineraries.length > 0

  const switchTo = (itinerary: (typeof itineraries)[number]) => {
    setIsOpen(false)

    const isCurrent =
      itinerary.internalID === currentItineraryId || itinerary.slug === currentItineraryId

    // Already showing it — no need to refetch or touch the route params.
    if (isCurrent) {
      return
    }

    const itineraryId = itinerary.slug ?? itinerary.internalID

    setIsSwitching(true)

    // Fetched first so the store already has it: swapping params before this resolves would
    // suspend the screen and blank the guide, the same reasoning as this screen's own `refresh`.
    fetchQuery<ItineraryScreenQuery>(environment, itineraryQuery, {
      id: itineraryId,
      citySlug,
    }).subscribe({
      complete: () => {
        setIsSwitching(false)
        navigation.setParams({ itineraryId })
      },
      error: () => setIsSwitching(false),
    })
  }

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
              <Touchable
                key={itinerary.internalID}
                testID="itinerary-picker-option"
                accessibilityRole="button"
                disabled={isSwitching}
                onPress={() => switchTo(itinerary)}
              >
                <Flex px={2} py={1}>
                  <Text variant="sm" weight={isCurrent ? "medium" : "regular"} color="black">
                    {itinerary.title}
                  </Text>
                  {stopsCount !== undefined && (
                    <Text variant="xs" color="mono60">
                      {`${stopsCount} ${pluralize("stop", stopsCount)}`}
                    </Text>
                  )}
                </Flex>
              </Touchable>
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
