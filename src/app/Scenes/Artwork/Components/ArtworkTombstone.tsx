import { ArtworkTombstone_artwork$data } from "__generated__/ArtworkTombstone_artwork.graphql"
import { useFeatureFlag } from "app/store/GlobalStore"
import { Box, comma, Flex, Spacer, Text } from "palette"
import { createFragmentContainer, graphql } from "react-relay"
import { ArtworkLotTimerFragmentContainer } from "./ArtworkLotTimer"
import { ArtworkMakerTitleFragmentContainer } from "./ArtworkMakerTitle"
import { CascadingEndTimesBanner } from "./CascadingEndTimesBanner"

export interface ArtworkTombstoneProps {
  artwork: ArtworkTombstone_artwork$data
  refetchArtwork: () => void
}

export const ArtworkTombstone: React.FC<ArtworkTombstoneProps> = ({ artwork, refetchArtwork }) => {
  const enableArtworkRedesign = useFeatureFlag("ARArtworkRedesingPhase2")

  const getArtworkTitleAndMaybeDate = () => {
    if (artwork.date) {
      return `${artwork.title!}${comma} ${artwork.date}`
    }

    return artwork.title!
  }

  const displayAuctionLotLabel =
    artwork.isInAuction &&
    artwork.saleArtwork &&
    artwork.saleArtwork.lotLabel &&
    artwork.sale &&
    !artwork.sale.isClosed &&
    !enableArtworkRedesign

  return (
    <Box textAlign="left">
      {!!displayAuctionLotLabel && (
        <>
          <Spacer mb={1} />
          <Text variant="md" color="black100">
            Lot {artwork.saleArtwork.lotLabel}
          </Text>
        </>
      )}
      {!!enableArtworkRedesign && (
        <ArtworkLotTimerFragmentContainer artwork={artwork} refetchArtwork={refetchArtwork} />
      )}

      <ArtworkMakerTitleFragmentContainer artwork={artwork} />
      <Flex flexDirection="row" flexWrap="wrap">
        <Text variant="lg-display" color="black60">
          {getArtworkTitleAndMaybeDate()}
        </Text>
      </Flex>

      {!!enableArtworkRedesign && !artwork.isForSale && (
        <>
          <Spacer mt={2} />
          <Text variant="md" color="black100">
            {artwork.saleMessage}
          </Text>
        </>
      )}
      {!!artwork.isInAuction && !artwork.sale?.isClosed && (
        <>
          {!!(artwork.sale?.cascadingEndTimeIntervalMinutes && !enableArtworkRedesign) && (
            <Flex my={2} mx={-2}>
              <CascadingEndTimesBanner
                cascadingEndTimeInterval={artwork.sale.cascadingEndTimeIntervalMinutes}
                extendedBiddingIntervalMinutes={artwork.sale.extendedBiddingIntervalMinutes}
              />
            </Flex>
          )}
          <Spacer mb={1} />
          {!!artwork.partner && (
            <Text variant="sm" color="black100" weight="medium">
              {artwork.partner.name}
            </Text>
          )}
          {!!artwork.saleArtwork && !!artwork.saleArtwork.estimate && (
            <Text variant="sm" color="black60">
              Estimated value: {artwork.saleArtwork.estimate}
            </Text>
          )}
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
      isInAuction
      date
      isForSale
      saleMessage
      saleArtwork {
        lotLabel
        estimate
      }
      partner {
        name
      }
      sale {
        isClosed
        cascadingEndTimeIntervalMinutes
        extendedBiddingIntervalMinutes
      }
      ...ArtworkMakerTitle_artwork
      artists {
        name
        href
      }
    }
  `,
})
