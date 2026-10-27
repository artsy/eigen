import { ActionType, ContextModule, OwnerType, ScreenOwnerType } from "@artsy/cohesion"
import { useItineraryShareMintTokenMutation } from "__generated__/useItineraryShareMintTokenMutation.graphql"
import { getShareURL } from "app/Components/ShareSheet/helpers"
import { mutate } from "app/Scenes/CityGuide/hooks/useCityItineraryStops"
import { Schema } from "app/utils/track"
import { useCallback, useState } from "react"
import RNShare from "react-native-share"
import { graphql, useRelayEnvironment } from "react-relay"
import { useTracking } from "react-tracking"

interface Props {
  internalID: string
  /** Only a published, curated guide has one — null for a personal itinerary. */
  slug?: string | null
  citySlug: string
  title: string
  isCurated: boolean
  /** Already minted, if any — reused rather than replaced, so a link shared earlier still works. */
  shareToken?: string | null
  contextModule: ContextModule
  contextScreenOwnerType: ScreenOwnerType
  contextScreenOwnerId?: string
  contextScreenOwnerSlug?: string
}

/**
 * Shares a link to an itinerary. A curated guide's `slug` is public, so the link needs
 * nothing else. A personal itinerary has no slug and is private by default — it needs a
 * `shareToken`, minted on first share and reused after (`updateItinerary` would otherwise
 * replace it every time, breaking any link already sent out).
 */
export const useItineraryShare = ({
  internalID,
  slug,
  citySlug,
  title,
  isCurated,
  shareToken,
  contextModule,
  contextScreenOwnerType,
  contextScreenOwnerId,
  contextScreenOwnerSlug,
}: Props) => {
  const environment = useRelayEnvironment()
  const { trackEvent } = useTracking<Schema.Entity>()
  const { trackEvent: trackCohesionEvent } = useTracking()
  const [isSharing, setIsSharing] = useState(false)

  const share = useCallback(async () => {
    setIsSharing(true)

    try {
      let token = shareToken

      if (!isCurated && !token) {
        const minted = await mutate<useItineraryShareMintTokenMutation>(
          environment,
          MintTokenMutation,
          { input: { id: internalID, generateShareToken: true } }
        )
        const response = minted.updateItinerary?.responseOrError

        token =
          response?.__typename === "ItineraryMutationSuccess"
            ? response.itinerary?.shareToken
            : undefined

        if (!token) {
          throw new Error(
            response?.__typename === "ItineraryMutationFailure"
              ? response.mutationError?.message ?? "Could not create a share link"
              : "Could not create a share link"
          )
        }
      }

      const path = `/city-guide/${citySlug}/itinerary/${slug ?? internalID}`
      // Only a personal itinerary needs the token in the link — a curated guide's slug is
      // already public. `shareToken` is base64 and can contain `+`, `/`, `=` — encode it so
      // it survives as a literal in the query string rather than as space-substituted `+`.
      const url = getShareURL(token ? `${path}?shareToken=${encodeURIComponent(token)}` : path)

      trackEvent({
        action_name: Schema.ActionNames.Share,
        action_type: Schema.ActionTypes.Tap,
        owner_type: Schema.OwnerEntityTypes.CityGuide,
        owner_id: internalID,
        owner_slug: slug ?? internalID,
      })
      trackCohesionEvent({
        action: ActionType.tappedShare,
        context_module: contextModule,
        context_screen_owner_type: contextScreenOwnerType,
        context_screen_owner_id: contextScreenOwnerId,
        context_screen_owner_slug: contextScreenOwnerSlug,
      })

      const result = await RNShare.open({
        title,
        message: `${title} on Artsy\n${url}`,
        failOnCancel: false,
      })

      if (result.success) {
        trackCohesionEvent({
          action: ActionType.share,
          context_module: contextModule,
          context_owner_type: isCurated ? OwnerType.cityGuideGuide : OwnerType.cityGuideItinerary,
          context_owner_id: internalID,
          context_owner_slug: slug ?? undefined,
          // The activity the user picked, e.g. `com.apple.UIKit.activity.CopyToPasteboard`.
          service: result.message,
        })
      }
    } finally {
      setIsSharing(false)
    }
  }, [
    environment,
    internalID,
    slug,
    citySlug,
    title,
    isCurated,
    shareToken,
    contextModule,
    contextScreenOwnerType,
    contextScreenOwnerId,
    contextScreenOwnerSlug,
    trackEvent,
    trackCohesionEvent,
  ])

  return { share, isSharing }
}

const MintTokenMutation = graphql`
  mutation useItineraryShareMintTokenMutation($input: updateItineraryInput!) {
    updateItinerary(input: $input) {
      responseOrError {
        __typename
        ... on ItineraryMutationSuccess {
          itinerary {
            internalID
            shareToken
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
