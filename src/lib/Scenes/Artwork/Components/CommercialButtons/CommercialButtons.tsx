import { Button, Spacer } from "@artsy/palette"
import { CommercialButtons_artwork } from "__generated__/CommercialButtons_artwork.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema, Track, track as _track } from "lib/utils/track"
import React from "react"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"
import { BidButtonFragmentContainer as BidButton } from "./BidButton"
import { BuyNowButtonFragmentContainer as BuyNowButton } from "./BuyNowButton"
import { MakeOfferButtonFragmentContainer as MakeOfferButton } from "./MakeOfferButton"

export interface CommercialButtonProps {
  artwork: CommercialButtons_artwork
  relay: RelayProp
  // EditionSetID is passed down from the edition selected by the user
  editionSetID?: string
}

const track: Track<CommercialButtonProps> = _track

@track()
export class CommercialButtons extends React.Component<CommercialButtonProps> {
  @track({
    action_name: Schema.ActionNames.ContactGallery,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.CommercialButtons,
  })
  handleInquiry() {
    SwitchBoard.presentNavigationViewController(this, `/inquiry/${this.props.artwork.slug}`)
  }

  render() {
    const { artwork } = this.props
    const { isBuyNowable, isAcquireable, isOfferable, isInquireable, isInAuction, editionSets } = artwork
    const noEditions = (editionSets && editionSets.length === 0) || !editionSets

    if (isInAuction && artwork.sale && !artwork.sale.isClosed) {
      return (
        <>
          {isBuyNowable && noEditions ? (
            <>
              <BidButton artwork={artwork} />
              <Spacer mb={1} />
              <BuyNowButton variant="secondaryOutline" artwork={artwork} editionSetID={this.props.editionSetID} />
            </>
          ) : (
            <BidButton artwork={artwork} />
          )}
        </>
      )
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
      isBuyNowable

      editionSets {
        id
      }

      sale {
        isClosed
      }

      ...BuyNowButton_artwork
      ...BidButton_artwork
      ...MakeOfferButton_artwork
    }
  `,
})
