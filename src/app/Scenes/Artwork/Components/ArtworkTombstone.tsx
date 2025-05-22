import { comma, Spacer, Flex, Box, Text } from "@artsy/palette-mobile"
import { ArtworkTombstone_artwork$data } from "__generated__/ArtworkTombstone_artwork.graphql"
import { createFragmentContainer, graphql } from "react-relay"
import { ArtworkLotTimerFragmentContainer } from "./ArtworkLotTimer"
import { ArtworkMakerTitleFragmentContainer } from "./ArtworkMakerTitle"

export interface ArtworkTombstoneProps {
  artwork: ArtworkTombstone_artwork$data
  refetchArtwork: () => void
}

export const ArtworkTombstone: React.FC<ArtworkTombstoneProps> = ({ artwork, refetchArtwork }) => {
  const shouldDisplaySaleMessage = !artwork.isForSale && !!artwork.saleMessage

  return (
    <Box textAlign="left">
      <ArtworkLotTimerFragmentContainer artwork={artwork} refetchArtwork={refetchArtwork} />

      <ArtworkMakerTitleFragmentContainer artwork={artwork} />
      <Flex flexDirection="row" flexWrap="wrap">
        <Text color="mono60">
          <Text variant="lg-display" italic>
            {artwork.title}
            {!!artwork.date && `${comma} `}
          </Text>
          {!!artwork.date && <Text variant="lg-display">{artwork.date}</Text>}
        </Text>
      </Flex>
      {!!shouldDisplaySaleMessage && (
        <>
          <Spacer y={2} />
          <Text variant="md" color="mono100">
            {artwork.saleMessage}
          </Text>
        </>
      )}
    </Box>
  )
}

export const ArtworkTombstoneFragmentContainer = createFragmentContainer(ArtworkTombstone, {
  artwork: graphql`
    fragment ArtworkTombstone_artwork on Artwork {
      ...ArtworkLotTimer_artwork
      title
      date
      isForSale
      saleMessage
      ...ArtworkMakerTitle_artwork
    }
  `,
})
