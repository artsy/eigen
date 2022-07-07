import { ActionType, OwnerType, TappedBuyNow } from "@artsy/cohesion"
import { BuyNowButton_artwork$data } from "__generated__/BuyNowButton_artwork.graphql"
import { BuyNowButtonOrderMutation } from "__generated__/BuyNowButtonOrderMutation.graphql"
import { navigate } from "app/navigation/navigate"
import { Track, track as _track } from "app/utils/track"
import { Button, ButtonProps } from "palette"
import React from "react"
import { Alert } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"

export interface BuyNowButtonProps {
  artwork: BuyNowButton_artwork$data
  relay: RelayProp
  variant?: ButtonProps["variant"]
  // EditionSetID is passed down from the edition selected by the user
  editionSetID: string | null
}

export interface State {
  isCommittingCreateOrderMutation: boolean
}

// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
const track: Track<BuyNowButtonProps, State, TappedBuyNow> = _track

@track()
export class BuyNowButton extends React.Component<BuyNowButtonProps, State> {
  state = {
    isCommittingCreateOrderMutation: false,
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
            this.handleCreateOrder()
          },
        },
      ]
    )
    console.log("src/app/Scenes/Artwork/Components/BuyNowButton.tsx", error)
  }

  @track(
    (props): TappedBuyNow => ({
      action: ActionType.tappedBuyNow,
      context_owner_type: OwnerType.artwork,
      context_owner_id: props.artwork.internalID,
      context_owner_slug: props.artwork.slug,
    })
  )
  handleCreateOrder() {
    const { relay, artwork, editionSetID } = this.props
    const { isCommittingCreateOrderMutation } = this.state
    const { internalID } = artwork
    if (isCommittingCreateOrderMutation) {
      return
    }
    this.setState({ isCommittingCreateOrderMutation: true }, () => {
      if (relay && relay.environment) {
        commitMutation<BuyNowButtonOrderMutation>(relay.environment, {
          mutation: graphql`
            mutation BuyNowButtonOrderMutation($input: CommerceCreateOrderWithArtworkInput!) {
              commerceCreateOrderWithArtwork(input: $input) {
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
            },
          },
          onCompleted: (data) => {
            this.setState({ isCommittingCreateOrderMutation: false }, () => {
              const {
                // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                commerceCreateOrderWithArtwork: { orderOrError },
              } = data
              if (orderOrError.__typename === "CommerceOrderWithMutationFailure") {
                this.onMutationError(orderOrError.error)
              } else if (orderOrError.__typename === "CommerceOrderWithMutationSuccess") {
                navigate(`/orders/${orderOrError.order.internalID}`, {
                  modal: true,
                  passProps: { title: "Buy Now" },
                })
              }
            })
          },
          onError: (error) =>
            this.setState({ isCommittingCreateOrderMutation: false }, () =>
              this.onMutationError(error)
            ),
        })
      }
    })
  }

  render() {
    const { variant, artwork } = this.props
    const { isCommittingCreateOrderMutation } = this.state

    return (
      <Button
        onPress={() => this.handleCreateOrder()}
        loading={isCommittingCreateOrderMutation}
        size="large"
        variant={variant}
        block
        width={100}
        haptic
      >
        {variant && variant === "outline" && artwork.saleMessage
          ? `Purchase ${artwork.saleMessage}`
          : "Purchase"}
      </Button>
    )
  }
}

export const BuyNowButtonFragmentContainer = createFragmentContainer(BuyNowButton, {
  artwork: graphql`
    fragment BuyNowButton_artwork on Artwork {
      internalID
      slug
      saleMessage
    }
  `,
})
