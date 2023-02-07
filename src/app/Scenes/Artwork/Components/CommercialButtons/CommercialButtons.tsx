import { Spacer } from "@artsy/palette-mobile"
import { CommercialButtons_artwork$data } from "__generated__/CommercialButtons_artwork.graphql"
import { CommercialButtons_me$data } from "__generated__/CommercialButtons_me.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { createFragmentContainer, graphql } from "react-relay"
import { BidButtonFragmentContainer } from "./BidButton"
import { BuyNowButton } from "./BuyNowButton"
import { InquiryButtonsFragmentContainer } from "./InquiryButtons"
import { MakeOfferButtonFragmentContainer } from "./MakeOfferButton"

export interface CommercialButtonProps {
  artwork: CommercialButtons_artwork$data
  me: CommercialButtons_me$data
  // EditionSetID is passed down from the edition selected by the user
  editionSetID?: string
  // FIXME: auctionState can be undefined
  auctionState: AuctionTimerState
}

export const CommercialButtons: React.FC<CommercialButtonProps> = ({
  artwork,
  me,
  auctionState,
  editionSetID,
}) => {
  const {
    isBuyNowable,
    isAcquireable,
    isOfferable,
    isInquireable,
    isInAuction,
    editionSets,
    isForSale,
  } = artwork
  const noEditions = !editionSets || editionSets.length === 0

  if (isInAuction && artwork.sale && auctionState !== AuctionTimerState.CLOSED && isForSale) {
    return (
      <>
        {isBuyNowable && noEditions ? (
          <>
            <BidButtonFragmentContainer artwork={artwork} me={me} auctionState={auctionState} />
            <Spacer y="1" />
            <BuyNowButton
              variant="outline"
              artwork={artwork}
              editionSetID={editionSetID ?? null}
              renderSaleMessage
            />
          </>
        ) : (
          <BidButtonFragmentContainer artwork={artwork} me={me} auctionState={auctionState} />
        )}
      </>
    )
  }

  if (isOfferable && isAcquireable) {
    return (
      <>
        <BuyNowButton artwork={artwork} editionSetID={editionSetID ?? null} />
        <Spacer y="1" />
        <MakeOfferButtonFragmentContainer
          artwork={artwork}
          editionSetID={editionSetID ?? null}
          variant="outline"
        />
      </>
    )
  }

  if (isAcquireable) {
    return <BuyNowButton artwork={artwork} editionSetID={editionSetID ?? null} />
  }

  if (isOfferable) {
    return (
      <>
        <MakeOfferButtonFragmentContainer artwork={artwork} editionSetID={editionSetID ?? null} />
        {isInquireable && (
          <>
            <Spacer y="0.5" />
            <InquiryButtonsFragmentContainer artwork={artwork} variant="outline" block />
          </>
        )}
      </>
    )
  }

  if (isInquireable) {
    return <InquiryButtonsFragmentContainer artwork={artwork} block />
  }

  return null
}

export const CommercialButtonsFragmentContainer = createFragmentContainer(CommercialButtons, {
  artwork: graphql`
    fragment CommercialButtons_artwork on Artwork {
      slug
      isAcquireable
      isOfferable
      isInquireable
      isInAuction
      isBuyNowable
      isForSale
      editionSets {
        id
      }

      sale {
        isClosed
      }

      ...BuyNowButton_artwork
      ...BidButton_artwork
      ...MakeOfferButton_artwork
      ...InquiryButtons_artwork
    }
  `,
  me: graphql`
    fragment CommercialButtons_me on Me {
      ...BidButton_me
    }
  `,
})
