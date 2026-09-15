import { AddIcon } from "@artsy/icons/native"
import { Button, Flex, Text } from "@artsy/palette-mobile"
import { AddToItinerarySheetCreateMutation } from "__generated__/AddToItinerarySheetCreateMutation.graphql"
import { AddToItinerarySheetQuery } from "__generated__/AddToItinerarySheetQuery.graphql"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { useToast } from "app/Components/Toast/toastHook"
import { AddToItineraryRow } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/components/AddToItineraryRow"
import { CreateItineraryForm } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/components/CreateItineraryForm"
import { useApplyItinerarySelection } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/useApplyItinerarySelection"
import {
  PayloadItinerary,
  StopTarget,
  itinerariesHoldingTarget,
} from "app/Scenes/CityGuide/Components/AddToItinerarySheet/utils/itineraryStopTargets"
import {
  defaultItineraryTitle,
  mutate,
  useCityItineraryStops,
} from "app/Scenes/CityGuide/hooks/useCityItineraryStops"
import { itineraryStopsCount } from "app/Scenes/CityGuide/utils/itineraryStopsCount"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { useState } from "react"
import { ScrollView } from "react-native"
import { graphql, useLazyLoadQuery, useRelayEnvironment } from "react-relay"

/** Well above the number of itineraries a user has for one city. */
const PAGE_SIZE = 20
const ADD_ICON_SIZE = 16
const SNAP_POINTS = ["50%", "95%"]

export interface AddToItineraryTarget extends StopTarget {
  /** Absent where no city is known — the sheet then lists every itinerary. */
  citySlug?: string
  cityName?: string
}

interface Props extends AddToItineraryTarget {
  onClose: () => void
}

const Sheet: React.FC<Props> = ({ itemType, itemID, citySlug, cityName, onClose }) => {
  const toast = useToast()
  const environment = useRelayEnvironment()
  const applySelection = useApplyItinerarySelection()
  // Only for the empty case: with no itineraries at all, Done creates one and adds the stop.
  const { addStop } = useCityItineraryStops({ citySlug: citySlug ?? "", cityName })

  const data = useLazyLoadQuery<AddToItinerarySheetQuery>(Query, {
    citySlug: citySlug ?? null,
    first: PAGE_SIZE,
  })

  const fetchedItineraries = extractNodes(data.me?.itinerariesConnection)
  const target = { itemType, itemID }
  // `createItineraryInput.citySlug` is required, so an itinerary cannot be made without a
  // city. Reached from outside City Guide you can only add to one you already have.
  const canCreate = !!citySlug

  const [initial] = useState(() => itinerariesHoldingTarget(fetchedItineraries, target))
  const [selected, setSelected] = useState<string[]>(initial)
  const [isCreating, setIsCreating] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [isNaming, setIsNaming] = useState(false)
  // `create` mutates straight through the store, not through this screen's own
  // `useLazyLoadQuery`, so the itinerary it makes has to be added here by hand — otherwise it
  // neither shows in the list nor is findable by `applySelection` when Done is pressed.
  const [createdItineraries, setCreatedItineraries] = useState<PayloadItinerary[]>([])
  const itineraries: PayloadItinerary[] = [...fetchedItineraries, ...createdItineraries]

  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((each) => each !== id) : [...current, id]
    )

  const create = async (title: string) => {
    setIsCreating(true)

    try {
      const created = await mutate<AddToItinerarySheetCreateMutation>(
        environment,
        CreateMutation,
        // Guarded by `canCreate`, which is what gates this whole view.
        { input: { citySlug: citySlug as string, title } }
      )
      const response = created.createItinerary?.responseOrError
      const internalID =
        response?.__typename === "ItineraryMutationSuccess"
          ? response.itinerary?.internalID
          : undefined

      if (!internalID) throw new Error("Could not create the itinerary")

      // A brand new itinerary has no stops and no section yet — `applySelection` creates the
      // section itself when it finds none, same as it does for any other itinerary.
      setCreatedItineraries((current) => [
        ...current,
        { internalID, title, stopsCount: 0, heroImage: null, sections: [] },
      ])
      // Ticked straight away, so Done adds the stop to what you just made.
      setSelected((current) => [...current, internalID])
      setIsNaming(false)
    } catch {
      toast.show("Could not create that itinerary. Please try again.", "bottom")
    } finally {
      setIsCreating(false)
    }
  }

  const done = async () => {
    setIsApplying(true)

    try {
      // A user with no itineraries has nothing to tick, so Done means "make me one" — which is
      // what `addStop` already does, including naming it and its section.
      if (!itineraries.length && canCreate) {
        await addStop(target)
      } else {
        await applySelection({ itineraries, target, initial, selected })
      }

      toast.show("Added to your itinerary", "bottom")
      onClose()
    } catch {
      // Left open on failure: dismissing would claim the change stuck.
      toast.show("Something went wrong. Please try again.", "bottom")
    } finally {
      setIsApplying(false)
    }
  }

  if (isNaming) {
    return (
      <CreateItineraryForm
        initialName={defaultItineraryTitle(cityName)}
        isCreating={isCreating}
        onCreate={create}
        onCancel={() => setIsNaming(false)}
      />
    )
  }

  return (
    <Flex flex={1}>
      <Flex px={2} pb={2}>
        <Text variant="md">Add to Itinerary</Text>
      </Flex>

      <Flex px={2} flexDirection="row" alignItems="center" justifyContent="space-between">
        {canCreate ? (
          <Flex flexDirection="row" alignItems="center" gap={0.5}>
            <AddIcon width={ADD_ICON_SIZE} height={ADD_ICON_SIZE} />

            <Text
              testID="add-to-itinerary-create"
              variant="xs"
              onPress={() => setIsNaming(true)}
              accessibilityRole="button"
            >
              Create New Itinerary
            </Text>
          </Flex>
        ) : (
          <Flex />
        )}

        <Text variant="xs" color="mono60">
          {`${selected.length} selected`}
        </Text>
      </Flex>

      {/*
        `flex: 1`, not left to size itself: without it the ScrollView takes up all the space
        left in the sheet regardless of how little content it holds, pushing Done below the
        visible area — a sibling, not part of the scrollable content, so there is no way to
        reach it by scrolling.
      */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20 }}
      >
        {!itineraries.length && !canCreate && (
          <Text variant="xs" color="mono60">
            You have no itineraries yet. Start one from a city guide.
          </Text>
        )}

        {itineraries.map((itinerary) => (
          <AddToItineraryRow
            key={itinerary.internalID}
            title={itinerary.title}
            stopsCount={itineraryStopsCount(itinerary)}
            imageUrl={itinerary.heroImage?.url}
            selected={selected.includes(itinerary.internalID)}
            onPress={() => toggle(itinerary.internalID)}
          />
        ))}
      </ScrollView>

      <Flex p={2}>
        <Button testID="add-to-itinerary-done" block loading={isApplying} onPress={done}>
          Done
        </Button>
      </Flex>
    </Flex>
  )
}

const SheetWithSuspense = withSuspense({
  Component: Sheet,
  // The sheet is already open by the time this loads; a spinner inside it would be more
  // movement than the list appearing.
  LoadingFallback: () => null,
  ErrorFallback: NoFallback,
})

/**
 * The sheet the plus opens: your itineraries, ticked where they already hold this entity.
 *
 * Selection is local until Done, as the artwork-lists sheet does it, so a user can tick and
 * untick without firing a mutation per tap.
 */
export const AddToItinerarySheet: React.FC<{
  target: AddToItineraryTarget | null
  onClose: () => void
}> = ({ target, onClose }) => (
  <AutomountedBottomSheetModal
    visible={!!target}
    name="AddToItinerary"
    snapPoints={SNAP_POINTS}
    enableDynamicSizing={false}
    onDismiss={onClose}
  >
    {!!target && <SheetWithSuspense {...target} onClose={onClose} />}
  </AutomountedBottomSheetModal>
)

const Query = graphql`
  query AddToItinerarySheetQuery($citySlug: String, $first: Int!) {
    me {
      itinerariesConnection(citySlug: $citySlug, first: $first) {
        edges {
          node {
            internalID
            title
            stopsCount

            heroImage {
              url(version: "small")
            }

            sections {
              internalID
              title
              stopsCount

              stops {
                internalID
                item {
                  __typename
                  ... on Show {
                    internalID
                  }
                  ... on Fair {
                    internalID
                  }
                  ... on Location {
                    internalID
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

const CreateMutation = graphql`
  mutation AddToItinerarySheetCreateMutation($input: createItineraryInput!) {
    createItinerary(input: $input) {
      responseOrError {
        __typename
        ... on ItineraryMutationSuccess {
          itinerary {
            internalID
          }
        }
        ... on ItineraryMutationFailure {
          mutationError {
            message
          }
        }
      }
    }
  }
`
