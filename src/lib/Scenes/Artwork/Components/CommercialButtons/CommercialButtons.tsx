import { Button, Spacer } from "@artsy/palette"
import { CommercialButtons_artwork } from "__generated__/CommercialButtons_artwork.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"
import { BidButtonFragmentContainer as BidButton } from "./BidButton"
import { BuyNowButtonFragmentContainer as BuyNowButton } from "./BuyNowButton"
import { MakeOfferButtonFragmentContainer as MakeOfferButton } from "./MakeOfferButton"

export interface CommercialButtonProps {
  artwork: CommercialButtons_artwork
  relay: RelayProp
  editionSetID?: string
}

export class CommercialButtons extends React.Component<CommercialButtonProps> {
  handleInquiry = () => {
    SwitchBoard.presentModalViewController(this, `/inquiry/${this.props.artwork.slug}`)
  }

  handleBid = () => {
    SwitchBoard.presentModalViewController(this, `/bid/${this.props.artwork.slug}`)
  }

  renderButtons = () => {
    const { artwork } = this.props
    const { isAcquireable, isOfferable, isInquireable, isInAuction } = artwork

    if (isInAuction && artwork.sale && !artwork.sale.isClosed) {
      return <BidButton artwork={artwork} />
    } else if (isOfferable && isAcquireable) {
      return (
        <>
          <BuyNowButton artwork={artwork} editionSetID={this.props.editionSetID} />
          <Spacer mb={1} />
          <MakeOfferButton artwork={artwork} editionSetID={this.props.editionSetID} variant="secondaryOutline" />
        </>
      )
    } else if (isAcquireable) {
      return <BuyNowButton artwork={artwork} editionSetID={this.props.editionSetID} />
    } else if (isOfferable) {
      return <MakeOfferButton artwork={artwork} editionSetID={this.props.editionSetID} />
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
      isBiddable
      isInAuction

      sale {
        isClosed
      }

      ...BuyNowButton_artwork
      ...BidButton_artwork
      ...MakeOfferButton_artwork
    }
  `,
})
