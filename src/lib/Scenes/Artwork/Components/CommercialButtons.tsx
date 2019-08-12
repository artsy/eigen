import { Button, Spacer } from "@artsy/palette"
import { CommercialButtons_artwork } from "__generated__/CommercialButtons_artwork.graphql"
import { CommercialButtonsOfferOrderMutation } from "__generated__/CommercialButtonsOfferOrderMutation.graphql"
import { CommercialButtonsOrderMutation } from "__generated__/CommercialButtonsOrderMutation.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { Alert } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"

export interface CommercialButtonProps {
  artwork: CommercialButtons_artwork
  relay: RelayProp
  editionSetID?: string
}

export interface State {
  isCommittingCreateOrderMutation: boolean
  isCommittingCreateOfferOrderMutation: boolean
}

export class CommercialButtons extends React.Component<CommercialButtonProps, State> {
  state = {
    isCommittingCreateOfferOrderMutation: false,
    isCommittingCreateOrderMutation: false,
  }

  onMutationError(orderType: "offer" | "order", error) {
    Alert.alert("Sorry, we couldn't process the request.", "Please try again or contact orders@artsy.net for help.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Retry",
        onPress: () => {
          if (orderType === "order") {
            this.handleCreateOrder()
          } else if (orderType === "offer") {
            this.handleCreateOfferOrder()
          }
        },
      },
    ])
    console.log("src/lib/Scenes/Artwork/Components/CommercialButtons.tsx", error)
  }

  handleCreateOrder() {
    const { relay, artwork, editionSetID } = this.props
    const { isCommittingCreateOrderMutation, isCommittingCreateOfferOrderMutation } = this.state
    const { internalID } = artwork
    if (isCommittingCreateOrderMutation || isCommittingCreateOfferOrderMutation) {
      return
    }
    this.setState({ isCommittingCreateOrderMutation: true }, () => {
      if (relay && relay.environment) {
        commitMutation<CommercialButtonsOrderMutation>(relay.environment, {
          mutation: graphql`
            mutation CommercialButtonsOrderMutation($input: CommerceCreateOrderWithArtworkInput!) {
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
          onCompleted: data => {
            this.setState({ isCommittingCreateOrderMutation: false }, () => {
              const {
                commerceCreateOrderWithArtwork: { orderOrError },
              } = data
              if (orderOrError.error) {
                this.onMutationError("order", orderOrError.error)
              } else {
                SwitchBoard.presentModalViewController(this, `/orders/${orderOrError.order.internalID}`)
              }
            })
          },
          onError: error =>
            this.setState({ isCommittingCreateOrderMutation: false }, () => this.onMutationError("order", error)),
        })
      }
    })
  }

  handleCreateOfferOrder() {
    const { relay, artwork, editionSetID } = this.props
    const { isCommittingCreateOfferOrderMutation, isCommittingCreateOrderMutation } = this.state
    const { internalID } = artwork
    if (isCommittingCreateOfferOrderMutation || isCommittingCreateOrderMutation) {
      return
    }
    this.setState({ isCommittingCreateOfferOrderMutation: true }, () => {
      if (relay && relay.environment) {
        commitMutation<CommercialButtonsOfferOrderMutation>(relay.environment, {
          mutation: graphql`
            mutation CommercialButtonsOfferOrderMutation($input: CommerceCreateOfferOrderWithArtworkInput!) {
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
            },
          },
          onCompleted: data => {
            this.setState({ isCommittingCreateOfferOrderMutation: false }, () => {
              const {
                commerceCreateOfferOrderWithArtwork: { orderOrError },
              } = data
              if (orderOrError.error) {
                this.onMutationError("offer", orderOrError.error)
              } else {
                SwitchBoard.presentModalViewController(this, `/orders/${orderOrError.order.internalID}`)
              }
            })
          },
          onError: error =>
            this.setState({ isCommittingCreateOfferOrderMutation: false }, () => this.onMutationError("order", error)),
        })
      }
    })
  }

  handleInquiry = () => {
    SwitchBoard.presentModalViewController(this, `/inquiry/${this.props.artwork.slug}`)
  }

  renderButtons = () => {
    const { isAcquireable, isOfferable, isInquireable } = this.props.artwork
    const { isCommittingCreateOrderMutation, isCommittingCreateOfferOrderMutation } = this.state
    if (isOfferable && isAcquireable) {
      return (
        <>
          <Button
            onPress={() => this.handleCreateOrder()}
            loading={isCommittingCreateOrderMutation}
            size="large"
            block
            width={100}
          >
            Buy now
          </Button>
          <Spacer mb={1} />
          <Button
            onPress={() => this.handleCreateOfferOrder()}
            loading={isCommittingCreateOfferOrderMutation}
            variant="secondaryOutline"
            size="large"
            block
            width={100}
          >
            Make offer
          </Button>
        </>
      )
    } else if (isAcquireable) {
      return (
        <Button
          onPress={() => this.handleCreateOrder()}
          loading={isCommittingCreateOrderMutation}
          size="large"
          block
          width={100}
        >
          Buy now
        </Button>
      )
    } else if (isOfferable) {
      return (
        <Button
          onPress={() => this.handleCreateOfferOrder()}
          loading={isCommittingCreateOfferOrderMutation}
          size="large"
          block
          width={100}
        >
          Make offer
        </Button>
      )
    } else if (isInquireable) {
      return (
        <Button onPress={() => this.handleInquiry()} size="large" block width={100}>
          Contact gallery
        </Button>
      )
    } else {
      return <></>
    }
  }

  render() {
    return <>{this.renderButtons()}</>
  }
}

export const CommercialButtonsFragmentContainer = createFragmentContainer(CommercialButtons, {
  artwork: graphql`
    fragment CommercialButtons_artwork on Artwork {
      slug
      internalID
      isAcquireable
      isOfferable
      isInquireable
    }
  `,
})
