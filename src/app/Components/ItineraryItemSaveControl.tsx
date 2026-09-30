import { ScreenOwnerType } from "@artsy/cohesion"
import { ItineraryItemSaveControlQuery } from "__generated__/ItineraryItemSaveControlQuery.graphql"
import { AddToItineraryProvider } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItineraryProvider"
import { CityEventSaveControl } from "app/Scenes/CityGuide/Components/CityEventSaveControls"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { fetchQuery, graphql, useLazyLoadQuery, useRelayEnvironment } from "react-relay"

interface Props {
  /** A gallery is a `LOCATION`: `itemID` is the location's id, not the partner's. */
  itemType: "SHOW" | "FAIR" | "LOCATION"
  itemID: string
  itemSlug?: string
  name: string
  /** Where this control is rendered — the item's own page. */
  contextScreenOwnerType: ScreenOwnerType
  contextScreenOwnerId?: string
  contextScreenOwnerSlug?: string
}

/** Standalone detail-screen control. Lists must request the boolean on their batched query instead. */
const Control: React.FC<Props> = ({
  itemType,
  itemID,
  itemSlug,
  name,
  contextScreenOwnerType,
  contextScreenOwnerId,
  contextScreenOwnerSlug,
}) => {
  const environment = useRelayEnvironment()
  const variables = {
    itemID,
    isShow: itemType === "SHOW",
    isFair: itemType === "FAIR",
    isLocation: itemType === "LOCATION",
  }
  const data = useLazyLoadQuery<ItineraryItemSaveControlQuery>(Query, variables, {
    fetchPolicy: "network-only",
  })
  const item = data.show ?? data.fair ?? data.location

  const refresh = () => {
    fetchQuery<ItineraryItemSaveControlQuery>(environment, Query, variables, {
      fetchPolicy: "network-only",
    })
      .toPromise()
      .catch(() => {
        // Keep the current saved state if the membership refresh fails.
      })
  }

  if (!item) return null

  return (
    // The city is resolved here so the sheet's own query can list only that city's itineraries.
    <AddToItineraryProvider
      citySlug={item.cityGuideCity?.slug}
      cityName={item.cityGuideCity?.name ?? undefined}
      contextScreenOwnerType={contextScreenOwnerType}
      contextScreenOwnerId={contextScreenOwnerId}
      contextScreenOwnerSlug={contextScreenOwnerSlug}
      onSaved={refresh}
    >
      <CityEventSaveControl
        itemType={itemType}
        itemID={itemID}
        itemSlug={itemSlug}
        name={name}
        isOnMyItineraries={item.isOnMyItineraries}
        contextScreenOwnerType={contextScreenOwnerType}
        contextScreenOwnerId={contextScreenOwnerId}
        contextScreenOwnerSlug={contextScreenOwnerSlug}
      />
    </AddToItineraryProvider>
  )
}

const SuspendedControl = withSuspense({
  Component: Control,
  LoadingFallback: () => null,
  ErrorFallback: NoFallback,
})

export const ItineraryItemSaveControl: React.FC<Props> = (props) => {
  const enabled = useFeatureFlag("AREnableCityGuideItineraries")
  return enabled ? <SuspendedControl {...props} /> : null
}

const Query = graphql`
  query ItineraryItemSaveControlQuery(
    $itemID: String!
    $isShow: Boolean!
    $isFair: Boolean!
    $isLocation: Boolean!
  ) {
    show(id: $itemID) @include(if: $isShow) {
      isOnMyItineraries
      cityGuideCity {
        slug
        name
      }
    }
    fair(id: $itemID) @include(if: $isFair) {
      isOnMyItineraries
      cityGuideCity {
        slug
        name
      }
    }
    location(id: $itemID) @include(if: $isLocation) {
      isOnMyItineraries
      cityGuideCity {
        slug
        name
      }
    }
  }
`
