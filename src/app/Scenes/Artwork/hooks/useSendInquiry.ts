import { useSendInquiry_artwork$key } from "__generated__/useSendInquiry_artwork.graphql"
import { useSendInquiry_collectorProfile$key } from "__generated__/useSendInquiry_collectorProfile.graphql"
import { useSendInquiry_me$key } from "__generated__/useSendInquiry_me.graphql"
import { InquiryQuestionInput } from "__generated__/useSubmitInquiryRequestMutation.graphql"
import { useInquirySuccessPopover } from "app/Scenes/Artwork/Components/CommercialButtons/useInquirySuccessPopover"
import { useArtworkInquiryContext } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import {
  userShouldBePromptedToAddArtistsToCollection,
  userShouldBePromptedToCompleteProfile,
} from "app/utils/collectorPromptHelpers"
import { useSubmitInquiryRequest } from "app/utils/mutations/useSubmitInquiryRequest"
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

  const showSuccessPopover = useInquirySuccessPopover()

  const artwork = useFragment(FRAGMENT_ARTWORK, _artwork)
  const me = useFragment(FRAGMENT_ME, _me)
  const collectorProfile = useFragment<useSendInquiry_collectorProfile$key>(
    FRAGMENT_COLLECTOR_PROFILE,
    me?.collectorProfile
  )

  const tracking = useTracking()

  const sendInquiry = (message: string) => {
    if (isLoading || !artwork || !me || !collectorProfile) {
      return
    }

    setIsLoading(true)

    tracking.trackEvent(tracks.attemptedToSendTheInquiry(artwork?.internalID, artwork?.slug))

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
        const locationDisplay = me.location?.display
        const profession = me.profession
        const artworksCount = me.myCollectionInfo.artworksCount

        if (
          userShouldBePromptedToAddArtistsToCollection({
            lastUpdatePromptAt,
            artworksCount,
            artistsCount: me.userInterestsConnection?.totalCount,
          })
        ) {
          dispatch({ type: "setCollectionPromptVisible", payload: true })
          return
        }

        if (
          userShouldBePromptedToCompleteProfile({ locationDisplay, profession, lastUpdatePromptAt })
        ) {
          dispatch({ type: "setProfilePromptVisible", payload: true })
          return
        }

        showSuccessPopover()
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
      display
    }
    profession
    collectorProfile @required(action: NONE) {
      ...useSendInquiry_collectorProfile
    }
    myCollectionInfo @required(action: NONE) {
      artworksCount
    }
    userInterestsConnection(first: 1, interestType: ARTIST) {
      totalCount
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
