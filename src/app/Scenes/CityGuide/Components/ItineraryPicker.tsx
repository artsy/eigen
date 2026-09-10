import { ChevronDownIcon } from "@artsy/icons/native"
import { Flex, Text } from "@artsy/palette-mobile"
import { ItineraryPickerQuery } from "__generated__/ItineraryPickerQuery.graphql"
import { AutoHeightBottomSheet } from "app/Components/BottomSheet/AutoHeightBottomSheet"
import { itineraryStopsCount } from "app/Scenes/CityGuide/utils/itineraryStopsCount"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { pluralize } from "app/utils/pluralize"
import { useState } from "react"
import { TouchableOpacity } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"

const CHEVRON_SIZE = 18
/** The designs' pill: 1px border, fully rounded, 30 tall. */
const PILL_HEIGHT = 30
const PILL_RADIUS = 50
const PILL_PADDING = 15

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

  // Always tappable once anything has loaded. It was gated on having more than one
  // itinerary, which read as a dead button whenever a user had exactly one — the common case
  // while nothing can create them yet.
  const canSwitch = itineraries.length > 0

  return (
    <>
      <TouchableOpacity
        testID="itinerary-picker"
        accessibilityRole="button"
        accessibilityLabel={
          canSwitch ? `Switch itinerary, currently ${currentItineraryName}` : currentItineraryName
        }
        disabled={!canSwitch}
        onPress={() => setIsOpen(true)}
      >
        <Flex
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          gap={0.5}
          height={PILL_HEIGHT}
          // The designs' 15, which is not a palette spacing unit.
          style={{ paddingHorizontal: PILL_PADDING }}
          border="1px solid"
          borderColor="mono100"
          borderRadius={PILL_RADIUS}
          backgroundColor="mono0"
        >
          <Text variant="xs" numberOfLines={1}>
            {currentItineraryName}
          </Text>

          <ChevronDownIcon width={CHEVRON_SIZE} height={CHEVRON_SIZE} />
        </Flex>
      </TouchableOpacity>

      <AutoHeightBottomSheet visible={isOpen} onDismiss={() => setIsOpen(false)}>
        <Flex py={2}>
          <Flex px={2} pb={1}>
            <Text variant="md">Your Itineraries</Text>
          </Flex>

          {itineraries.map((itinerary) => {
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
                    {itinerary.name}
                  </Text>
                  <Text variant="xs" color="mono60">
                    {`${itineraryStopsCount(itinerary)} ${pluralize(
                      "stop",
                      itineraryStopsCount(itinerary)
                    )}`}
                  </Text>
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
            name
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
 * The pill in the itinerary map's header that names the itinerary you are looking at and
 * switches between your others for the city.
 */
export const ItineraryPicker = withSuspense({
  Component: Picker,
  // The header must not jump while this loads, and the name is already on the pill once it
  // arrives; a spinner in a 30pt pill would be worse than nothing.
  LoadingFallback: () => null,
  ErrorFallback: NoFallback,
})
