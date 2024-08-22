import { useSendInquiry_artwork$key } from "__generated__/useSendInquiry_artwork.graphql"
import { useSendInquiry_collectorProfile$key } from "__generated__/useSendInquiry_collectorProfile.graphql"
import { useSendInquiry_me$key } from "__generated__/useSendInquiry_me.graphql"
import { InquiryQuestionInput } from "__generated__/useSubmitInquiryRequestMutation.graphql"
import { useSubmitInquiryRequest } from "app/Scenes/Artwork/Components/CommercialButtons/useSubmitInquiryRequest"
import { useArtworkInquiryContext } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import {
  userShouldBePromptedToAddArtistsToCollection,
  userShouldBePromptedToCompleteProfile,
} from "app/utils/collectorPromptHelpers"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Schema } from "app/utils/track"
import { useState } from "react"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface useSendInquiryProps {
  onCompleted?: () => void
  artwork: useSendInquiry_artwork$key | null
  me: useSendInquiry_me$key
}

export const useSendInquiry = ({
  onCompleted,
  artwork: _artwork,
  me: _me,
}: useSendInquiryProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  const { state, dispatch } = useArtworkInquiryContext()
  const [commit] = useSubmitInquiryRequest()

  const artwork = useFragment(FRAGMENT_ARTWORK, _artwork)
  const me = useFragment(FRAGMENT_ME, _me)
  const collectorProfile = useFragment<useSendInquiry_collectorProfile$key>(
    FRAGMENT_COLLECTOR_PROFILE,
    me?.collectorProfile
  )

  const tracking = useTracking()
  const profilePromptIsEnabled = useFeatureFlag("AREnableCollectorProfilePrompts")

  const sendInquiry = (message: string) => {
    if (isLoading || !artwork || !me || !collectorProfile) {
      return
    }

    setIsLoading(true)

    tracking.trackEvent(
      tracks.attemptedToSendTheInquiry(artwork?.internalID, me.location?.city ?? undefined)
    )

    commit({
      variables: {
        input: {
          inquireableID: artwork.internalID,
          inquireableType: "Artwork",
          questions: state.inquiryQuestions.map((q: InquiryQuestionInput) => {
            /**
             * If the user selected the shipping question and has a location, add the location
             * details that are stored in the state.
             */
            if (q.questionID === "shipping_quote" && state.shippingLocation) {
              const details = JSON.stringify({
                city: state.shippingLocation.city,
                coordinates: state.shippingLocation.coordinates,
                country: state.shippingLocation.country,
                postal_code: state.shippingLocation.postalCode,
                state: state.shippingLocation.state,
                state_code: state.shippingLocation.stateCode,
              })
              return { ...q, details }
            } else {
              return q
            }
          }),
          message: message?.trim(),
        },
      },
      onError: () => {
        tracking.trackEvent(tracks.failedToSendTheInquiry(artwork.internalID, artwork.slug))

        setError(true)
        setIsLoading(false)
      },
      onCompleted: () => {
        setIsLoading(false)
        onCompleted?.()
        tracking.trackEvent(tracks.successfullySentTheInquiry(artwork.internalID, artwork.slug))

        const lastUpdatePromptAt = collectorProfile.lastUpdatePromptAt
        const city = me.location?.city
        const profession = me.profession

        if (!profilePromptIsEnabled) {
          setTimeout(() => {
            dispatch({ type: "setSuccessNotificationVisible", payload: true })
          }, 500)
          return
        }

        if (userShouldBePromptedToCompleteProfile({ city, profession, lastUpdatePromptAt })) {
          dispatch({ type: "setProfilePromptVisible", payload: true })
          return
        }

        if (
          userShouldBePromptedToAddArtistsToCollection({
            lastUpdatePromptAt,
            ...me.myCollectionInfo,
          })
        ) {
          dispatch({ type: "setCollectionPromptVisible", payload: true })
          return
        }

        setTimeout(() => {
          dispatch({ type: "setSuccessNotificationVisible", payload: true })
        }, 500)
      },
    })
  }

  return { sendInquiry, error }
}

const FRAGMENT_ARTWORK = graphql`
  fragment useSendInquiry_artwork on Artwork {
    internalID @required(action: NONE)
    slug @required(action: NONE)
  }
`

const FRAGMENT_COLLECTOR_PROFILE = graphql`
  fragment useSendInquiry_collectorProfile on CollectorProfileType {
    lastUpdatePromptAt
  }
`

const FRAGMENT_ME = graphql`
  fragment useSendInquiry_me on Me {
    location {
      city
    }
    profession
    collectorProfile @required(action: NONE) {
      ...useSendInquiry_collectorProfile
    }
    myCollectionInfo @required(action: NONE) {
      artistsCount
      artworksCount
    }
  }
`

const tracks = {
  attemptedToSendTheInquiry: (artworkId?: string, artworkSlug?: string) => ({
    action_type: Schema.ActionTypes.Tap,
    action_name: Schema.ActionNames.InquirySend,
    owner_type: Schema.OwnerEntityTypes.Artwork,
    owner_id: artworkId,
    owner_slug: artworkSlug,
  }),
  successfullySentTheInquiry: (artworkId: string, artworkSlug: string) => ({
    action_type: Schema.ActionTypes.Success,
    action_name: Schema.ActionNames.InquirySend,
    owner_type: Schema.OwnerEntityTypes.Artwork,
    owner_id: artworkId,
    owner_slug: artworkSlug,
  }),
  failedToSendTheInquiry: (artworkId: string, artworkSlug: string) => ({
    action_type: Schema.ActionTypes.Fail,
    action_name: Schema.ActionNames.InquirySend,
    owner_type: Schema.OwnerEntityTypes.Artwork,
    owner_id: artworkId,
    owner_slug: artworkSlug,
  }),
}
