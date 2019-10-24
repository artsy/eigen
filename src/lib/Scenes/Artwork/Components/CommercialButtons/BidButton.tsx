import { Button, color, Sans } from "@artsy/palette"
import { BidButton_artwork } from "__generated__/BidButton_artwork.graphql"
import { AuctionTimerState } from "lib/Components/Bidding/Components/Timer"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema } from "lib/utils/track"
import React from "react"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"
import track from "react-tracking"

export const PREDICTION_URL = "https://live.artsy.net"

export interface BidButtonProps {
  artwork: BidButton_artwork
  auctionState: AuctionTimerState
  relay: RelayProp
}

const registrationWasAttempted = sale => !!sale.registrationStatus
const isRegisteredToBid = sale => registrationWasAttempted(sale) && sale.registrationStatus.qualifiedForBidding
const watchOnly = sale => sale.isRegistrationClosed && !isRegisteredToBid(sale)
const getMyLotStanding = artwork => artwork.myLotStanding && artwork.myLotStanding.length && artwork.myLotStanding[0]
const getHasBid = myLotStanding => !!(myLotStanding && myLotStanding.mostRecentBid)

@track()
export class BidButton extends React.Component<BidButtonProps> {
  @track({
    action_name: Schema.ActionNames.RegisterToBid,
    action_type: Schema.ActionTypes.Tap,
  })
  redirectToRegister() {
    const { sale } = this.props.artwork
    SwitchBoard.presentNavigationViewController(this, `/auction-registration/${sale.slug}`)
  }

  @track(props => {
    const { artwork } = props
    return {
      action_name: watchOnly(artwork.sale) ? Schema.ActionNames.EnterLiveBidding : Schema.ActionNames.WatchLiveBidding,
      action_type: Schema.ActionTypes.Tap,
    }
  })
  redirectToLiveBidding() {
    const { slug } = this.props.artwork.sale
    const liveUrl = `${PREDICTION_URL}/${slug}`
    SwitchBoard.presentNavigationViewController(this, liveUrl)
  }

  @track(props => {
    const { artwork } = props
    const myLotStanding = getMyLotStanding(artwork)
    const hasBid = getHasBid(myLotStanding)
    return {
      action_name: hasBid ? Schema.ActionNames.IncreaseMaxBid : Schema.ActionNames.Bid,
      action_type: Schema.ActionTypes.Tap,
    }
  })
  redirectToBid(firstIncrement: number) {
    const { slug, sale } = this.props.artwork
    const bid = firstIncrement

    SwitchBoard.presentNavigationViewController(this, `/auction/${sale.slug}/bid/${slug}?bid=${bid}`)
  }

  renderIsPreview(registrationAttempted: boolean, registeredToBid: boolean) {
    return (
      <>
        {!registrationAttempted && (
          <Button width={100} block size="large" mt={1} onPress={() => this.redirectToRegister()}>
            Register to bid
          </Button>
        )}
        {registrationAttempted &&
          !registeredToBid && (
            <Button width={100} block size="large" mt={1} disabled>
              Registration pending
            </Button>
          )}
        {registrationAttempted &&
          registeredToBid && (
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
          <Sans size="2" color={color("black60")} pb={1} textAlign="center">
            Registration closed
          </Sans>
        )}
        <Button width={100} block size="large" onPress={() => this.redirectToLiveBidding()}>
          {isWatchOnly ? "Watch live bidding" : "Enter live bidding"}
        </Button>
      </>
    )
  }

  render() {
    const { artwork, auctionState } = this.props
    const { sale, saleArtwork } = artwork

    if (sale && sale.isClosed) {
      return null
    }

    const registrationAttempted = registrationWasAttempted(sale)
    const registeredToBid = isRegisteredToBid(sale)

    /**
     * NOTE: This is making an incorrect assumption that there could only ever
     *       be 1 live sale with this work. When we run into that case, there is
     *       likely design work to be done too, so we can adjust this then.
     */
    const myLotStanding = getMyLotStanding(artwork)
    const hasBid = getHasBid(myLotStanding)

    if (auctionState === AuctionTimerState.PREVIEW) {
      return this.renderIsPreview(registrationAttempted, registeredToBid)
    } else if (auctionState === AuctionTimerState.LIVE_INTEGRATION_ONGOING) {
      return this.renderIsLiveOpen()
    } else if (registrationAttempted && !registeredToBid) {
      return (
        <Button width={100} block size="large" disabled>
          Registration pending
        </Button>
      )
    } else if (sale.isRegistrationClosed && !registeredToBid) {
      return (
        <Button width={100} block size="large" disabled>
          Registration closed
        </Button>
      )
    } else {
      const myLastMaxBid = hasBid && myLotStanding.mostRecentBid.maxBid.cents
      const increments = saleArtwork.increments.filter(increment => increment.cents > (myLastMaxBid || 0))
      const firstIncrement = increments && increments.length && increments[0]
      const incrementCents = firstIncrement && firstIncrement.cents

      return (
        <Button width={100} size="large" block onPress={() => this.redirectToBid(incrementCents)}>
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
})
