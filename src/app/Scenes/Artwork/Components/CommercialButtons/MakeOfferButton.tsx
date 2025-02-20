import { ActionType, OwnerType } from "@artsy/cohesion"
import { Button, ButtonProps } from "@artsy/palette-mobile"
import { MakeOfferButtonOrderMutation } from "__generated__/MakeOfferButtonOrderMutation.graphql"
import { MakeOfferButton_artwork$data } from "__generated__/MakeOfferButton_artwork.graphql"
import { navigate } from "app/system/navigation/navigate"

import React, { useState } from "react"
import { Alert } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import { useTracking } from "react-tracking"

interface PartnerOffer {
  internalID: string
  isActive: boolean | null | undefined
}
export interface MakeOfferButtonProps {
  artwork: MakeOfferButton_artwork$data
  relay: RelayProp
  // EditionSetID is passed down from the edition selected by the user
  editionSetID: string | null
  variant?: ButtonProps["variant"]
  buttonText?: string
  partnerOffer?: PartnerOffer
}

export const MakeOfferButton: React.FC<MakeOfferButtonProps> = (props) => {
  const [isCommittingCreateOfferOrderMutation, setIsCommittingCreateOfferOrderMutation] =
    useState(false)

  const tracking = useTracking()

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  const onMutationError = (error) => {
    Alert.alert(
      "Sorry, we couldn't process the request.",
      "Please try again or contact orders@artsy.net for help.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Retry",
          onPress: () => {
            handleCreateOfferOrder()
          },
        },
      ]
    )
    console.log("src/app/Scenes/Artwork/Components/MakeOfferButton.tsx", error)
  }

  const handleCreateOfferOrder = () => {
    tracking.trackEvent({
      action: ActionType.tappedMakeOffer,
      context_owner_type: OwnerType.artwork,
      context_owner_id: props.artwork.internalID,
    })

    const { relay, artwork, editionSetID, partnerOffer } = props
    const { internalID } = artwork

    if (isCommittingCreateOfferOrderMutation) {
      return
    }

    setIsCommittingCreateOfferOrderMutation(true)

    if (relay && relay.environment) {
      commitMutation<MakeOfferButtonOrderMutation>(relay.environment, {
        mutation: graphql`
          mutation MakeOfferButtonOrderMutation($input: CommerceCreateOfferOrderWithArtworkInput!) {
            commerceCreateOfferOrderWithArtwork(input: $input) {
              orderOrError {
                __typename
                ... on CommerceOrderWithMutationSuccess {
                  order {
                    internalID
                    mode
                  }
                }
                ... on CommerceOrderWithMutationFailure {
                  error {
                    type
                    code
                    data
                  }
                }
              }
            }
          }
        `,
        variables: {
          input: {
            artworkId: internalID,
            editionSetId: editionSetID,
            partnerOfferId: partnerOffer?.isActive ? partnerOffer.internalID : null,
          },
        },
        onCompleted: (data) => {
          setIsCommittingCreateOfferOrderMutation(false)

          const {
            // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            commerceCreateOfferOrderWithArtwork: { orderOrError },
          } = data
          if (orderOrError.__typename === "CommerceOrderWithMutationFailure") {
            onMutationError(orderOrError.error)
          } else if (orderOrError.__typename === "CommerceOrderWithMutationSuccess") {
            navigate(`/orders/${orderOrError.order.internalID}`, {
              passProps: { orderID: orderOrError.order.internalID, title: "Make Offer" },
            })
          }
        },
        onError: (error) => {
          setIsCommittingCreateOfferOrderMutation(false)
          onMutationError(error)
        },
      })
    }
  }

  return (
    <Button
      onPress={handleCreateOfferOrder}
      loading={isCommittingCreateOfferOrderMutation}
      size="large"
      block
      width={100}
      variant={props.variant}
      haptic
    >
      {props.buttonText || "Make an Offer"}
    </Button>
  )
}

export const MakeOfferButtonFragmentContainer = createFragmentContainer(MakeOfferButton, {
  artwork: graphql`
    fragment MakeOfferButton_artwork on Artwork {
      internalID
    }
  `,
})
