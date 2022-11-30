import { ArtworkStickyBottomContent_artwork$key } from "__generated__/ArtworkStickyBottomContent_artwork.graphql"
import { ArtworkStore } from "app/Scenes/Artwork/ArtworkStore"
import { Box, Text } from "palette"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface ArtworkStickyBottomContentProps {
  artwork: ArtworkStickyBottomContent_artwork$key
}

export const ArtworkStickyBottomContent: React.FC<ArtworkStickyBottomContentProps> = ({
  artwork,
}) => {
  const data = useFragment(artworkStickyBottomContentFragment, artwork)
  const editionSets = data.editionSets ?? []
  const auctionState = ArtworkStore.useStoreState((state) => state.auctionState)
  const selectedEditionId = ArtworkStore.useStoreState((state) => state.selectedEditionId)
  const selectedEdition = editionSets.find((editionSet) => {
    return editionSet?.internalID === selectedEditionId
  })

  return (
    <Box p={2} position="absolute" left={0} right={0} bottom={0} bg="red">
      <Text>Auction state: {auctionState}</Text>
      {!!selectedEdition && <Text>Edition Id: {selectedEdition.saleMessage}</Text>}
    </Box>
  )
}

const artworkStickyBottomContentFragment = graphql`
  fragment ArtworkStickyBottomContent_artwork on Artwork {
    editionSets {
      internalID
      saleMessage
    }
  }
`
