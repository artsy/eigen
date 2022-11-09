import { ArtworkStickyBottomContent_artwork$key } from "__generated__/ArtworkStickyBottomContent_artwork.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { ArtworkStore } from "app/Scenes/Artwork/ArtworkStore"
import { Box } from "palette"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { ArtworkPrice } from "./ArtworkPrice"

interface ArtworkStickyBottomContentProps {
  artwork: ArtworkStickyBottomContent_artwork$key
}

export const ArtworkStickyBottomContent: React.FC<ArtworkStickyBottomContentProps> = ({
  artwork,
}) => {
  const data = useFragment(artworkStickyBottomContentFragment, artwork)
  const auctionState = ArtworkStore.useStoreState((state) => state.auctionState)

  if (!data.isForSale || auctionState === AuctionTimerState.CLOSED) {
    return null
  }

  return (
    <Box p={2} position="absolute" left={0} right={0} bottom={0} bg="red">
      <ArtworkPrice artwork={data} />
    </Box>
  )
}

const artworkStickyBottomContentFragment = graphql`
  fragment ArtworkStickyBottomContent_artwork on Artwork {
    isForSale
    ...ArtworkPrice_artwork
  }
`
