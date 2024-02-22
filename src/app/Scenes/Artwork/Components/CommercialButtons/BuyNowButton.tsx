import { ActionType, ContextModule, OwnerType, TappedBuyNow } from "@artsy/cohesion"
import { ButtonProps, Button } from "@artsy/palette-mobile"
import { BuyNowButtonOrderMutation } from "__generated__/BuyNowButtonOrderMutation.graphql"
import { BuyNowButton_artwork$key } from "__generated__/BuyNowButton_artwork.graphql"
import { navigate } from "app/system/navigation/navigate"
import { promptForReview } from "app/utils/promptForReview"
import { useSetWebViewCallback } from "app/utils/useWebViewEvent"
import { useState } from "react"
import { Alert } from "react-native"
import { commitMutation, graphql, useFragment, useRelayEnvironment } from "react-relay"
import { useTracking } from "react-tracking"

export interface BuyNowButtonProps {
  artwork: BuyNowButton_artwork$key
  variant?: ButtonProps["variant"]
  // EditionSetID is passed down from the edition selected by the user
  editionSetID: string | null
  renderSaleMessage?: boolean
  buttonText?: string
}

export const BuyNowButton = ({
  artwork,
  variant,
  editionSetID,
  renderSaleMessage,
  buttonText,
}: BuyNowButtonProps) => {
  const env = useRelayEnvironment()
  const [isCommittingCreateOrderMutation, setIsCommittingCreateOrderMutation] = useState(false)

  const { saleMessage, internalID, slug } = useFragment(artworkFragment, artwork)
  const { trackEvent } = useTracking()

  useSetWebViewCallback<{ orderCode: string; message: string }>("orderSuccessful", () => {
    setTimeout(() => {
      promptForReview({
        contextModule: ContextModule.ordersSubmitted,
        contextOwnerType: OwnerType.artwork,
        contextOwnerSlug: slug,
        contextOwnerId: internalID,
      })
    }, 3000)
  })

  const handleCreateOrder = () => {
    trackEvent(tracks.tappedBuyNow(slug, internalID))

    if (isCommittingCreateOrderMutation) {
      return
    }

    setIsCommittingCreateOrderMutation(true)
    commitMutation<BuyNowButtonOrderMutation>(env, {
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
        console.warn({ data })
        setIsCommittingCreateOrderMutation(false)
        const {
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          commerceCreateOrderWithArtwork: { orderOrError },
        } = data
        if (orderOrError.__typename === "CommerceOrderWithMutationFailure") {
          onMutationError(orderOrError.error)
        } else if (orderOrError.__typename === "CommerceOrderWithMutationSuccess") {
          navigate(`/orders/${orderOrError.order.internalID}`, {
            passProps: { title: "Purchase" },
          })
        }
      },
      onError: (error) => {
        setIsCommittingCreateOrderMutation(false)
        onMutationError(error)
      },
    })
  }

  const onMutationError = (error: Error) => {
    Alert.alert(
      "Sorry, we couldn't process the request.",
      "Please try again or contact orders@artsy.net for help.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Retry",
          onPress: () => {
            handleCreateOrder()
          },
        },
      ]
    )
    console.log("BuyNowButton.tsx", error)
  }

  return (
    <Button
      onPress={() => handleCreateOrder()}
      loading={isCommittingCreateOrderMutation}
      size="large"
      variant={variant}
      block
      width={100}
      haptic
    >
      {!!buttonText
        ? buttonText
        : renderSaleMessage && saleMessage
          ? `Purchase ${saleMessage}`
          : "Purchase"}
    </Button>
  )
}

const artworkFragment = graphql`
  fragment BuyNowButton_artwork on Artwork {
    internalID
    slug
    saleMessage
  }
`

const tracks = {
  tappedBuyNow: (slug: string, internalID: string): TappedBuyNow => ({
    action: ActionType.tappedBuyNow,
    context_owner_type: OwnerType.artwork,
    context_owner_id: internalID,
    context_owner_slug: slug,
  }),
}
