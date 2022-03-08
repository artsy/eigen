import { CommercialButtons_artwork } from "__generated__/CommercialButtons_artwork.graphql"
import { CommercialButtons_me } from "__generated__/CommercialButtons_me.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { navigate } from "app/navigation/navigate"
import { useFeatureFlag } from "app/store/GlobalStore"
import { InquiryOptions } from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { Schema } from "app/utils/track"
import { Button, Spacer } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
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
  const { trackEvent } = useTracking()
  const newFirstInquiry = useFeatureFlag("AROptionsNewFirstInquiry")

  const handleInquiry = () => {
    trackEvent({
      action_name: Schema.ActionNames.ContactGallery,
      action_type: Schema.ActionTypes.Tap,
      context_module: Schema.ContextModules.CommercialButtons,
    })
    navigate(`/inquiry/${artwork.slug}`)
  }

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
        {isInquireable && <Spacer my={0.5} />}
        {isInquireable && !newFirstInquiry && (
          <Button onPress={handleInquiry} size="large" variant="outline" block width={100} haptic>
            {InquiryOptions.ContactGallery}
          </Button>
        )}
        {isInquireable && newFirstInquiry && (
          <InquiryButtonsFragmentContainer
            artwork={artwork}
            editionSetID={editionSetID}
            variant="outline"
          />
        )}
      </>
    )
  }

  if (isInquireable && !newFirstInquiry) {
    return (
      <Button onPress={handleInquiry} size="large" block width={100} haptic>
        {InquiryOptions.ContactGallery}
      </Button>
    )
  }

  if (isInquireable && newFirstInquiry) {
    return <InquiryButtonsFragmentContainer artwork={artwork} editionSetID={editionSetID} />
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
