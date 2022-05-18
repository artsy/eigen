import { CommercialButtons_artwork } from "__generated__/CommercialButtons_artwork.graphql"
import { CommercialButtons_me } from "__generated__/CommercialButtons_me.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { useFeatureFlag } from "app/store/GlobalStore"
import { Spacer } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { BidButtonFragmentContainer } from "./BidButton"
import { BuyNowButtonFragmentContainer } from "./BuyNowButton"
import { InquiryButtonsFragmentContainer } from "./InquiryButtons"
import { MakeOfferButtonFragmentContainer } from "./MakeOfferButton"

export interface CommercialButtonProps {
  artwork: CommercialButtons_artwork
  me: CommercialButtons_me
  // EditionSetID is passed down from the edition selected by the user
  editionSetID?: string
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
    isSold,
  } = artwork
  const enableCreateArtworkAlert = useFeatureFlag("AREnableCreateArtworkAlert")
  const noEditions = !editionSets || editionSets.length === 0
  const shouldShowCreateAlertButton = enableCreateArtworkAlert && isSold

  if (isInAuction && artwork.sale && auctionState !== AuctionTimerState.CLOSED && isForSale) {
    return (
      <>
        {isBuyNowable && noEditions ? (
          <>
            <BidButtonFragmentContainer artwork={artwork} me={me} auctionState={auctionState} />
            <Spacer mb={1} />
            <BuyNowButtonFragmentContainer
              variant="outline"
              artwork={artwork}
              editionSetID={editionSetID ?? null}
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
        <BuyNowButtonFragmentContainer artwork={artwork} editionSetID={editionSetID ?? null} />
        <Spacer mb={1} />
        <MakeOfferButtonFragmentContainer
          artwork={artwork}
          editionSetID={editionSetID ?? null}
          variant="outline"
        />
      </>
    )
  }

  if (isAcquireable) {
    return <BuyNowButtonFragmentContainer artwork={artwork} editionSetID={editionSetID ?? null} />
  }

  if (isOfferable) {
    return (
      <>
        <MakeOfferButtonFragmentContainer artwork={artwork} editionSetID={editionSetID ?? null} />
        {isInquireable && (
          <>
            <Spacer my={0.5} />
            <InquiryButtonsFragmentContainer artwork={artwork} variant="outline" block />
          </>
        )}
      </>
    )
  }

  if (isInquireable) {
    return (
      <InquiryButtonsFragmentContainer
        artwork={artwork}
        variant={shouldShowCreateAlertButton ? "outline" : "fillDark"}
        block
      />
    )
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
      isSold
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
