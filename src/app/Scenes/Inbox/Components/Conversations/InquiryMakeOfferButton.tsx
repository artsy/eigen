import { ButtonProps, Button } from "@artsy/palette-mobile"
import { InquiryMakeOfferButtonOrderMutation } from "__generated__/InquiryMakeOfferButtonOrderMutation.graphql"
import { InquiryMakeOfferButton_artwork$data } from "__generated__/InquiryMakeOfferButton_artwork.graphql"
import { navigate } from "app/system/navigation/navigate"
import React from "react"
import { Alert } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"

export interface InquiryMakeOfferButtonProps extends ButtonProps {
  artwork: InquiryMakeOfferButton_artwork$data
  relay: RelayProp
  // EditionSetID is passed down from the edition selected by the user
  editionSetID: string | null
  conversationID: string
  replaceModalView?: boolean
}

export interface State {
  isCommittingCreateOfferOrderMutation: boolean
  showCheckoutFlowModal: boolean
  orderUrl: string | null
}

export class InquiryMakeOfferButton extends React.Component<InquiryMakeOfferButtonProps, State> {
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
            this.handleCreateInquiryOfferOrder()
          },
        },
      ]
    )
  }

  handleCreateInquiryOfferOrder() {
    const { relay, artwork, editionSetID, conversationID, replaceModalView = true } = this.props
    const { isCommittingCreateOfferOrderMutation } = this.state
    const { internalID } = artwork

    if (isCommittingCreateOfferOrderMutation) {
      return
    }

    this.setState({ isCommittingCreateOfferOrderMutation: true }, () => {
      if (relay && relay.environment) {
        commitMutation<InquiryMakeOfferButtonOrderMutation>(relay.environment, {
          mutation: graphql`
            mutation InquiryMakeOfferButtonOrderMutation(
              $input: CommerceCreateInquiryOfferOrderWithArtworkInput!
            ) {
              createInquiryOfferOrder(input: $input) {
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
              impulseConversationId: conversationID,
            },
          },
          onCompleted: (data) => {
            this.setState({ isCommittingCreateOfferOrderMutation: false }, () => {
              const {
                // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                createInquiryOfferOrder: { orderOrError },
              } = data
              if (orderOrError.__typename === "CommerceOrderWithMutationFailure") {
                this.onMutationError(orderOrError.error)
              } else if (orderOrError.__typename === "CommerceOrderWithMutationSuccess") {
                navigate(`/orders/${orderOrError.order.internalID}`, {
                  modal: true,
                  replaceActiveModal: !!replaceModalView,
                  passProps: {
                    orderID: orderOrError.order.internalID,
                    title: "Make Offer",
                  },
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
    const { onPress, disabled, variant, children } = this.props

    return (
      <Button
        onPress={(event) => {
          onPress?.(event)
          this.handleCreateInquiryOfferOrder()
        }}
        loading={isCommittingCreateOfferOrderMutation}
        size="large"
        disabled={disabled}
        block
        width={100}
        variant={variant}
        haptic
      >
        {children}
      </Button>
    )
  }
}

export const InquiryMakeOfferButtonFragmentContainer = createFragmentContainer(
  InquiryMakeOfferButton,
  {
    artwork: graphql`
      fragment InquiryMakeOfferButton_artwork on Artwork {
        internalID
      }
    `,
  }
)
