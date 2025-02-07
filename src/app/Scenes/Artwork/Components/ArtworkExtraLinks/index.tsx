import { ArtworkExtraLinks_artwork$data } from "__generated__/ArtworkExtraLinks_artwork.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { createFragmentContainer, graphql } from "react-relay"
import { AuctionFaqSection } from "./AuctionFaqSection"

export interface ArtworkExtraLinksProps {
  artwork: ArtworkExtraLinks_artwork$data
  auctionState: AuctionTimerState
}

export const ArtworkExtraLinks: React.FC<ArtworkExtraLinksProps> = ({ artwork, auctionState }) => {
  return <AuctionFaqSection artwork={artwork} auctionState={auctionState} />
}

export const ArtworkExtraLinksFragmentContainer = createFragmentContainer(ArtworkExtraLinks, {
  artwork: graphql`
    fragment ArtworkExtraLinks_artwork on Artwork {
      isAcquireable
      isInAuction
      isOfferable
      title
      isForSale
      sale {
        isClosed
        isBenefit
        partner {
          name
        }
      }
      artists {
        isConsignable
        name
      }
      artist {
        name
      }
    }
  `,
})
