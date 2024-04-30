import { ActionType, OwnerType, TappedMakeOffer } from "@artsy/cohesion"
import { ButtonProps, Button } from "@artsy/palette-mobile"
import { MakeOfferButtonOrderMutation } from "__generated__/MakeOfferButtonOrderMutation.graphql"
import { MakeOfferButton_artwork$data } from "__generated__/MakeOfferButton_artwork.graphql"
import { navigate } from "app/system/navigation/navigate"
import { Track, track as _track } from "app/utils/track"

import React from "react"
import { Alert } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"

interface PartnerOffer {
  internalID: string
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

export interface State {
  isCommittingCreateOfferOrderMutation: boolean
  showCheckoutFlowModal: boolean
  orderUrl: string | null
}

// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
const track: Track<MakeOfferButtonProps, State, TappedMakeOffer> = _track

@track()
export class MakeOfferButton extends React.Component<MakeOfferButtonProps, State> {
  state = {
    isCommittingCreateOfferOrderMutation: false,
    showCheckoutFlowModal: false,
    orderUrl: null,
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  onMutationError(error) {
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
            this.handleCreateOfferOrder()
          },
        },
      ]
    )
    console.log("src/app/Scenes/Artwork/Components/MakeOfferButton.tsx", error)
  }

  @track(
    (props): TappedMakeOffer => ({
      action: ActionType.tappedMakeOffer,
      context_owner_type: OwnerType.artwork,
      context_owner_id: props.artwork.internalID,
    })
  )
  handleCreateOfferOrder() {
    const { relay, artwork, editionSetID, partnerOffer } = this.props
    const { isCommittingCreateOfferOrderMutation } = this.state
    const { internalID } = artwork

    if (isCommittingCreateOfferOrderMutation) {
      return
    }

    this.setState({ isCommittingCreateOfferOrderMutation: true }, () => {
      if (relay && relay.environment) {
        commitMutation<MakeOfferButtonOrderMutation>(relay.environment, {
          mutation: graphql`
            mutation MakeOfferButtonOrderMutation(
              $input: CommerceCreateOfferOrderWithArtworkInput!
            ) {
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
              partnerOfferId: partnerOffer?.internalID,
            },
          },
          onCompleted: (data) => {
            this.setState({ isCommittingCreateOfferOrderMutation: false }, () => {
              const {
                // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                commerceCreateOfferOrderWithArtwork: { orderOrError },
              } = data
              if (orderOrError.__typename === "CommerceOrderWithMutationFailure") {
                this.onMutationError(orderOrError.error)
              } else if (orderOrError.__typename === "CommerceOrderWithMutationSuccess") {
                navigate(`/orders/${orderOrError.order.internalID}`, {
                  passProps: { orderID: orderOrError.order.internalID, title: "Make Offer" },
                })
              }
            })
          },
          onError: (error) =>
            this.setState({ isCommittingCreateOfferOrderMutation: false }, () =>
              this.onMutationError(error)
            ),
        })
      }
    })
  }

  render() {
    const { isCommittingCreateOfferOrderMutation } = this.state

    return (
      <Button
        onPress={() => this.handleCreateOfferOrder()}
        loading={isCommittingCreateOfferOrderMutation}
        size="large"
        block
        width={100}
        variant={this.props.variant}
        haptic
      >
        {this.props.buttonText ? this.props.buttonText : "Make an Offer"}
      </Button>
    )
  }
}

export const MakeOfferButtonFragmentContainer = createFragmentContainer(MakeOfferButton, {
  artwork: graphql`
    fragment MakeOfferButton_artwork on Artwork {
      internalID
    }
  `,
})
