import { ActionType } from "@artsy/cohesion"
import { ButtonProps, Text, TextProps, Button } from "@artsy/palette-mobile"
import { BidButton_artwork$data } from "__generated__/BidButton_artwork.graphql"
import { BidButton_me$data } from "__generated__/BidButton_me.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { ThemeAwareClassTheme } from "app/Components/DarkModeClassTheme"
import { navigate } from "app/system/navigation/navigate"
import { bidderNeedsIdentityVerification } from "app/utils/auction/bidderNeedsIdentityVerification"
import { Schema } from "app/utils/track"
import React from "react"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"
import { useTracking } from "react-tracking"

export const PREDICTION_URL = "https://live.artsy.net"

export interface BidButtonProps {
  artwork: BidButton_artwork$data
  me: BidButton_me$data
  auctionState: AuctionTimerState
  relay: RelayProp
  variant?: ButtonProps["variant"]
}

// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
const watchOnly = (sale) =>
  sale.isRegistrationClosed && !sale?.registrationStatus?.qualifiedForBidding
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
const getMyLotStanding = (artwork) =>
  artwork.myLotStanding && artwork.myLotStanding.length && artwork.myLotStanding[0]
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
const getHasBid = (myLotStanding) => !!(myLotStanding && myLotStanding.mostRecentBid)

const IdentityVerificationRequiredMessage: React.FC<TextProps> = ({
  onPress,
  ...remainderProps
}) => {
  return (
    <Text variant="xs" mt={1} color="mono60" pb="1" textAlign="center" {...remainderProps}>
      Identity verification required to bid.{" "}
      <Text style={{ textDecorationLine: "underline" }} onPress={onPress}>
        FAQ
      </Text>
    </Text>
  )
}

export const BidButton: React.FC<BidButtonProps> = (props) => {
  const { artwork, me, auctionState, variant } = props
  const { trackEvent } = useTracking()

  const redirectToIdentityVerificationFAQ = () => {
    trackEvent({
      action_name: Schema.ActionNames.IdentityVerificationFAQ,
      action_type: Schema.ActionTypes.Tap,
    })

    navigate(`/identity-verification-faq`)
  }

  const redirectToRegister = () => {
    trackEvent({
      action_name: Schema.ActionNames.RegisterToBid,
      action_type: Schema.ActionTypes.Tap,
    })

    const { sale } = artwork

    if (sale?.slug) {
      navigate(`/auction-registration/${sale.slug}`)
    }
  }

  const redirectToLiveBidding = () => {
    const isWatchOnly = watchOnly(artwork.sale)
    const trackingData = {
      action_name: isWatchOnly
        ? Schema.ActionNames.EnterLiveBidding
        : Schema.ActionNames.WatchLiveBidding,
      action_type: Schema.ActionTypes.Tap,
    }

    trackEvent(trackingData)

    const { sale } = artwork

    if (sale?.slug) {
      const liveUrl = `${PREDICTION_URL}/${sale.slug}`

      navigate(liveUrl)
    }
  }

  const redirectToBid = (firstIncrement: number) => {
    const myLotStanding = getMyLotStanding(artwork)
    const hasBid = getHasBid(myLotStanding)

    const trackingData = hasBid
      ? {
          signal_lot_watcher_count: artwork.collectorSignals?.auction?.lotWatcherCount,
          signal_bid_count: artwork.collectorSignals?.auction?.bidCount,
          action_name: Schema.ActionNames.IncreaseMaxBid,
          action_type: Schema.ActionTypes.Tap,
        }
      : {
          signal_lot_watcher_count: artwork.collectorSignals?.auction?.lotWatcherCount,
          signal_bid_count: artwork.collectorSignals?.auction?.bidCount,
          action: ActionType.tappedBid,
        }

    trackEvent(trackingData)

    const { slug, sale } = artwork
    const bid = firstIncrement

    if (sale?.slug) {
      navigate(`/auction/${sale.slug}/bid/${slug}?bid=${bid}`)
    }
  }

  const renderIsPreview = (
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    registrationStatus: BidButton_artwork$data["sale"]["registrationStatus"],
    needsIdentityVerification: boolean
  ) => {
    return (
      <>
        {!registrationStatus && (
          <>
            <Button
              width={100}
              block
              size="large"
              mt={1}
              variant={variant}
              onPress={redirectToRegister}
              haptic
            >
              Register to bid
            </Button>
            {!!needsIdentityVerification && (
              <IdentityVerificationRequiredMessage onPress={redirectToIdentityVerificationFAQ} />
            )}
          </>
        )}

        {!!registrationStatus && !registrationStatus.qualifiedForBidding && (
          <>
            <Button width={100} block size="large" mt={1} variant={variant} disabled>
              Registration Pending
            </Button>
          </>
        )}

        {!!registrationStatus?.qualifiedForBidding && (
          <Button width={100} block size="large" mt={1} variant={variant} disabled>
            Registration complete
          </Button>
        )}
      </>
    )
  }

  const renderIsLiveOpen = () => {
    const { sale } = artwork
    const isWatchOnly = watchOnly(sale)

    return (
      <>
        {!!isWatchOnly && (
          <ThemeAwareClassTheme>
            {({ color }) => (
              <Text variant="sm-display" color={color("mono60")} pb={1} textAlign="center">
                Registration closed
              </Text>
            )}
          </ThemeAwareClassTheme>
        )}

        <Button width={100} block size="large" variant={variant} onPress={redirectToLiveBidding}>
          {isWatchOnly ? "Watch live bidding" : "Enter live bidding"}
        </Button>
      </>
    )
  }

  const { sale, saleArtwork } = artwork
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  const { registrationStatus } = sale

  // TODO: Do we need a nil check against +sale+?
  if (sale?.isClosed) {
    return null
  }

  const qualifiedForBidding = registrationStatus?.qualifiedForBidding
  const needsIdentityVerification = bidderNeedsIdentityVerification({
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    sale,
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    user: me,
    bidder: registrationStatus,
  })

  /**
   * NOTE: This is making an incorrect assumption that there could only ever
   *       be 1 live sale with this work. When we run into that case, there is
   *       likely design work to be done too, so we can adjust this then.
   */
  const myLotStanding = getMyLotStanding(artwork)
  const hasBid = getHasBid(myLotStanding)

  if (auctionState === AuctionTimerState.PREVIEW) {
    return renderIsPreview(registrationStatus, needsIdentityVerification)
  } else if (auctionState === AuctionTimerState.LIVE_INTEGRATION_ONGOING) {
    return renderIsLiveOpen()
  } else if (registrationStatus && !qualifiedForBidding) {
    return (
      <>
        <Button width={100} block size="large" variant={variant} disabled>
          Registration Pending
        </Button>
      </>
    )
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  } else if (sale.isRegistrationClosed && !qualifiedForBidding) {
    return (
      <Button width={100} block size="large" variant={variant} disabled>
        Registration closed
      </Button>
    )
  } else if (needsIdentityVerification) {
    return (
      <>
        <Button
          width={100}
          block
          size="large"
          variant={variant}
          mt={1}
          onPress={redirectToRegister}
        >
          Register to bid
        </Button>
        <IdentityVerificationRequiredMessage onPress={redirectToIdentityVerificationFAQ} />
      </>
    )
  } else {
    const myLastMaxBid = hasBid && myLotStanding.mostRecentBid.maxBid.cents
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const increments = saleArtwork.increments.filter(
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      (increment) => increment.cents > (myLastMaxBid || 0)
    )
    const firstIncrement = increments && increments.length && increments[0]
    const incrementCents = firstIncrement && firstIncrement.cents

    return (
      <Button
        width={100}
        size="large"
        variant={variant}
        block
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        onPress={() => redirectToBid(incrementCents)}
        haptic
      >
        {hasBid ? "Increase max bid" : "Bid"}
      </Button>
    )
  }
}

export const BidButtonFragmentContainer = createFragmentContainer(BidButton, {
  artwork: graphql`
    fragment BidButton_artwork on Artwork {
      slug
      sale {
        slug
        registrationStatus {
          qualifiedForBidding
        }
        isPreview
        isLiveOpen
        isClosed
        isRegistrationClosed
        requireIdentityVerification
      }
      myLotStanding(live: true) {
        mostRecentBid {
          maxBid {
            cents
          }
        }
      }
      saleArtwork {
        increments {
          cents
        }
      }
      collectorSignals {
        auction {
          bidCount
          lotWatcherCount
        }
      }
    }
  `,
  me: graphql`
    fragment BidButton_me on Me {
      isIdentityVerified
    }
  `,
})
