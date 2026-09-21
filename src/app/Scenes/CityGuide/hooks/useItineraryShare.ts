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
}: Props) => {
  const environment = useRelayEnvironment()
  const { trackEvent } = useTracking<Schema.Entity>()
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
      // already public.
      const url = getShareURL(token ? `${path}?shareToken=${token}` : path)

      trackEvent({
        action_name: Schema.ActionNames.Share,
        action_type: Schema.ActionTypes.Tap,
        owner_type: Schema.OwnerEntityTypes.CityGuide,
        owner_id: internalID,
        owner_slug: slug ?? internalID,
      })

      await RNShare.open({
        title,
        message: `${title} on Artsy\n${url}`,
        failOnCancel: false,
      })
    } finally {
      setIsSharing(false)
    }
  }, [environment, internalID, slug, citySlug, title, isCurated, shareToken, trackEvent])

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
