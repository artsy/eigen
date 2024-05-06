import {
  ActionType,
  ContextModule,
  OwnerType,
  ScreenOwnerType,
  TappedBuyNow,
} from "@artsy/cohesion"
import { ButtonProps, Button } from "@artsy/palette-mobile"
import { BuyNowButton_artwork$key } from "__generated__/BuyNowButton_artwork.graphql"
import { Toast } from "app/Components/Toast/Toast"
import { useCreateOrder } from "app/Scenes/Artwork/hooks/useCreateOrder"
import { usePartnerOfferMutation } from "app/Scenes/PartnerOffer/mutations/usePartnerOfferCheckoutMutation"
import { navigate } from "app/system/navigation/navigate"
import { getTimer } from "app/utils/getTimer"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { promptForReview } from "app/utils/promptForReview"
import { useSetWebViewCallback } from "app/utils/useWebViewEvent"
import { useEffect, useRef, useState } from "react"
import { Alert } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface PartnerOffer {
  internalID: string
  endAt?: string | null
}

const PARTNER_OFFER_TIMER_INTERVAL = 1000

export interface BuyNowButtonProps {
  artwork: BuyNowButton_artwork$key
  partnerOffer?: PartnerOffer | null
  variant?: ButtonProps["variant"]
  // EditionSetID is passed down from the edition selected by the user
  editionSetID: string | null
  renderSaleMessage?: boolean
  buttonText?: string
  // Source is used to track where the button was tapped from, by default it's in the artwork screen
  source?: "notification" | (string & {})
}

export const BuyNowButton = ({
  artwork,
  partnerOffer,
  variant,
  editionSetID,
  renderSaleMessage,
  buttonText,
  source,
}: BuyNowButtonProps) => {
  const [isCommittingCreateOrderMutation, setIsCommittingCreateOrderMutation] = useState(false)
  const AREnablePartnerOfferOnArtworkScreen = useFeatureFlag("AREnablePartnerOfferOnArtworkScreen")

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

  const [partnerOfferTimer, setPartnerOfferTimer] = useState(
    partnerOffer?.endAt ? getTimer(partnerOffer.endAt) : null
  )
  const intervalId = useRef<number | null>(null)

  useEffect(() => {
    if (partnerOffer && partnerOffer.endAt) {
      intervalId.current = setInterval(() => {
        setPartnerOfferTimer(partnerOffer?.endAt ? getTimer(partnerOffer.endAt) : null)
      }, PARTNER_OFFER_TIMER_INTERVAL)

      return () => {
        if (intervalId.current) clearInterval(intervalId.current)
      }
    }
  }, [])

  const partnerOfferMutation = usePartnerOfferMutation()

  const createOrderMutation = useCreateOrder()

  const createOrderFromPartnerOffer = async (partnerOffer: { internalID: string }) => {
    setIsCommittingCreateOrderMutation(true)
    try {
      const response = await partnerOfferMutation.commitMutation({
        partnerOfferId: partnerOffer.internalID,
      })
      const orderOrError = response.commerceCreatePartnerOfferOrder?.orderOrError
      if (orderOrError?.error) {
        const { code: errorCode, data: artwork } = orderOrError.error
        const artworkId = JSON.parse(artwork?.toString() ?? "{}")?.artwork_id

        if (errorCode === "expired_partner_offer") {
          navigate(`/artwork/${artworkId}`, {
            passProps: { artworkOfferExpired: true },
          })

          return
        }

        if (errorCode === "not_acquireable") {
          navigate(`/artwork/${artworkId}`, {
            passProps: { artworkOfferUnavailable: true },
          })

          return
        } else {
          Toast.show("An error occurred.", "bottom")
        }
      } else if (orderOrError?.order) {
        navigate(`/orders/${orderOrError.order?.internalID}`, {
          passProps: { title: "Purchase" },
        })

        return
      }
    } finally {
      setIsCommittingCreateOrderMutation(false)
    }
  }

  const createOrder = async () => {
    setIsCommittingCreateOrderMutation(true)
    try {
      const response = await createOrderMutation.commitMutation({
        artworkId: internalID,
        editionSetId: editionSetID,
      })
      const orderOrError = response.commerceCreateOrderWithArtwork?.orderOrError
      if (!orderOrError) {
        onMutationError(new Error("handleCreateOrder: no orderOrError"))
        return
      }
      if (orderOrError.__typename === "CommerceOrderWithMutationFailure") {
        onMutationError(orderOrError.error as any)
      } else if (orderOrError.__typename === "CommerceOrderWithMutationSuccess") {
        navigate(`/orders/${orderOrError.order.internalID}`, {
          passProps: { title: "Purchase" },
        })
      }
    } catch (e) {
      onMutationError(e as Error)
    } finally {
      setIsCommittingCreateOrderMutation(false)
    }
  }

  const handleCreateOrder = async () => {
    if (isCommittingCreateOrderMutation) {
      return
    }

    setIsCommittingCreateOrderMutation(true)

    try {
      if (AREnablePartnerOfferOnArtworkScreen && partnerOffer && !partnerOfferTimer?.hasEnded) {
        trackEvent(
          tracks.tappedBuyNow(
            slug,
            internalID,
            source === "notification" ? OwnerType.notification : OwnerType.artwork,
            "Partner offer"
          )
        )

        await createOrderFromPartnerOffer(partnerOffer)
      } else {
        trackEvent(tracks.tappedBuyNow(slug, internalID, OwnerType.artwork, "Buy now"))

        await createOrder()
      }
    } catch (e) {
      onMutationError(e as Error)
    } finally {
      setIsCommittingCreateOrderMutation(false)
    }
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

  let saleMessageText = "Purchase"
  if (buttonText) saleMessageText = buttonText
  else if (renderSaleMessage && saleMessage) saleMessageText = `Purchase ${saleMessage}`

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
      {saleMessageText}
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
  tappedBuyNow: (
    slug: string,
    internalID: string,
    context_owner_type: ScreenOwnerType,
    flow: string
  ): TappedBuyNow => ({
    action: ActionType.tappedBuyNow,
    context_owner_type: context_owner_type,
    context_owner_id: internalID,
    context_owner_slug: slug,
    flow: flow as "Buy now" | "Partner offer" | undefined,
  }),
}
