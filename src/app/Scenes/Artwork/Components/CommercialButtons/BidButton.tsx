import { ActionType } from "@artsy/cohesion"
import { BidButton_artwork$data } from "__generated__/BidButton_artwork.graphql"
import { BidButton_me$data } from "__generated__/BidButton_me.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { navigate } from "app/navigation/navigate"
import { bidderNeedsIdentityVerification } from "app/utils/auction"
import { Schema } from "app/utils/track"
import { Button, ClassTheme, Sans } from "palette"
import React from "react"
import { Text } from "react-native"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"
import track from "react-tracking"

export const PREDICTION_URL = "https://live.artsy.net"

export interface BidButtonProps {
  artwork: BidButton_artwork$data
  me: BidButton_me$data
  auctionState: AuctionTimerState
  relay: RelayProp
}

// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
const watchOnly = (sale) =>
  sale.isRegistrationClosed && !sale?.registrationStatus?.qualifiedForBidding
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
const getMyLotStanding = (artwork) =>
  artwork.myLotStanding && artwork.myLotStanding.length && artwork.myLotStanding[0]
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
const getHasBid = (myLotStanding) => !!(myLotStanding && myLotStanding.mostRecentBid)

// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
const IdentityVerificationRequiredMessage = ({ onPress, ...remainderProps }) => (
  <Sans mt="1" size="3" color="black60" pb="1" textAlign="center" {...remainderProps}>
    Identity verification required to bid.{" "}
    <Text style={{ textDecorationLine: "underline" }} onPress={onPress}>
      FAQ
    </Text>
  </Sans>
)

@track()
export class BidButton extends React.Component<BidButtonProps> {
  @track({
    action_name: Schema.ActionNames.IdentityVerificationFAQ,
    action_type: Schema.ActionTypes.Tap,
  })
  redirectToIdentityVerificationFAQ() {
    navigate(`/identity-verification-faq`)
  }

  @track({
    action_name: Schema.ActionNames.RegisterToBid,
    action_type: Schema.ActionTypes.Tap,
  })
  redirectToRegister() {
    const { sale } = this.props.artwork
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    navigate(`/auction-registration/${sale.slug}`)
  }

  @track((props) => {
    const { artwork } = props
    return {
      action_name: watchOnly(artwork.sale)
        ? Schema.ActionNames.EnterLiveBidding
        : Schema.ActionNames.WatchLiveBidding,
      action_type: Schema.ActionTypes.Tap,
    }
  })
  redirectToLiveBidding() {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const { slug } = this.props.artwork.sale
    const liveUrl = `${PREDICTION_URL}/${slug}`
    navigate(liveUrl)
  }

  @track((props): any => {
    const { artwork } = props
    const myLotStanding = getMyLotStanding(artwork)
    const hasBid = getHasBid(myLotStanding)
    if (hasBid) {
      return {
        action_name: Schema.ActionNames.IncreaseMaxBid,
        action_type: Schema.ActionTypes.Tap,
      }
    }

    return {
      action: ActionType.tappedBid,
    }
  })
  redirectToBid(firstIncrement: number) {
    const { slug, sale } = this.props.artwork
    const bid = firstIncrement

    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    navigate(`/auction/${sale.slug}/bid/${slug}?bid=${bid}`)
  }

  renderIsPreview(
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    registrationStatus: BidButton_artwork$data["sale"]["registrationStatus"],
    needsIdentityVerification: boolean
  ) {
    return (
      <>
        {!registrationStatus && (
          <>
            <Button
              width={100}
              block
              size="large"
              mt={1}
              onPress={() => this.redirectToRegister()}
              haptic
            >
              Register to bid
            </Button>
            {needsIdentityVerification && (
              <IdentityVerificationRequiredMessage
                onPress={() => this.redirectToIdentityVerificationFAQ()}
              />
            )}
          </>
        )}
        {registrationStatus && !registrationStatus.qualifiedForBidding && (
          <>
            <Button width={100} block size="large" mt={1} disabled>
              Registration pending
            </Button>
            {needsIdentityVerification && (
              <IdentityVerificationRequiredMessage
                onPress={() => this.redirectToIdentityVerificationFAQ()}
              />
            )}
          </>
        )}
        {registrationStatus?.qualifiedForBidding && (
          <Button width={100} block size="large" mt={1} disabled>
            Registration complete
          </Button>
        )}
      </>
    )
  }

  renderIsLiveOpen() {
    const { sale } = this.props.artwork
    const isWatchOnly = watchOnly(sale)
    return (
      <>
        {isWatchOnly && (
          <ClassTheme>
            {({ color }) => (
              <Sans size="2" color={color("black60")} pb={1} textAlign="center">
                Registration closed
              </Sans>
            )}
          </ClassTheme>
        )}
        <Button width={100} block size="large" onPress={() => this.redirectToLiveBidding()}>
          {isWatchOnly ? "Watch live bidding" : "Enter live bidding"}
        </Button>
      </>
    )
  }

  render() {
    const { artwork, auctionState, me } = this.props
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
      return this.renderIsPreview(registrationStatus, needsIdentityVerification)
    } else if (auctionState === AuctionTimerState.LIVE_INTEGRATION_ONGOING) {
      return this.renderIsLiveOpen()
    } else if (registrationStatus && !qualifiedForBidding) {
      return (
        <>
          <Button width={100} block size="large" disabled>
            Registration pending
          </Button>
          {needsIdentityVerification && (
            <IdentityVerificationRequiredMessage
              onPress={() => this.redirectToIdentityVerificationFAQ()}
            />
          )}
        </>
      )
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    } else if (sale.isRegistrationClosed && !qualifiedForBidding) {
      return (
        <Button width={100} block size="large" disabled>
          Registration closed
        </Button>
      )
    } else if (needsIdentityVerification) {
      return (
        <>
          <Button width={100} block size="large" mt={1} onPress={() => this.redirectToRegister()}>
            Register to bid
          </Button>
          <IdentityVerificationRequiredMessage
            onPress={() => this.redirectToIdentityVerificationFAQ()}
          />
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
          block
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          onPress={() => this.redirectToBid(incrementCents)}
          haptic
        >
          {hasBid ? "Increase max bid" : "Bid"}
        </Button>
      )
    }
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
    }
  `,
  me: graphql`
    fragment BidButton_me on Me {
      identityVerified
    }
  `,
})
