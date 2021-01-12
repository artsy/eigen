import { BuyNowButton_artwork } from "__generated__/BuyNowButton_artwork.graphql"
import { BuyNowButtonOrderMutation } from "__generated__/BuyNowButtonOrderMutation.graphql"
import { navigate } from "lib/navigation/navigate"
import { Schema, Track, track as _track } from "lib/utils/track"
import { Button, ButtonVariant } from "palette"
import React from "react"
import { Alert } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"

export interface BuyNowButtonProps {
  artwork: BuyNowButton_artwork
  relay: RelayProp
  variant?: ButtonVariant
  // EditionSetID is passed down from the edition selected by the user
  editionSetID: string | null
}

export interface State {
  isCommittingCreateOrderMutation: boolean
}

// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
const track: Track<BuyNowButtonProps, State> = _track

@track()
export class BuyNowButton extends React.Component<BuyNowButtonProps, State> {
  state = {
    isCommittingCreateOrderMutation: false,
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  onMutationError(error) {
    Alert.alert("Sorry, we couldn't process the request.", "Please try again or contact orders@artsy.net for help.", [
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
    ])
    console.log("src/lib/Scenes/Artwork/Components/BuyNowButton.tsx", error)
  }

  @track({
    action_name: Schema.ActionNames.BuyNow,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.CommercialButtons,
  })
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
                navigate(`/orders/${orderOrError.order.internalID}`, { modal: true })
              }
            })
          },
          onError: (error) =>
            this.setState({ isCommittingCreateOrderMutation: false }, () => this.onMutationError(error)),
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
        {variant && variant === "secondaryOutline" && artwork.saleMessage
          ? `Buy now ${artwork.saleMessage}`
          : "Buy now"}
      </Button>
    )
  }
}

export const BuyNowButtonFragmentContainer = createFragmentContainer(BuyNowButton, {
  artwork: graphql`
    fragment BuyNowButton_artwork on Artwork {
      internalID
      saleMessage
    }
  `,
})
