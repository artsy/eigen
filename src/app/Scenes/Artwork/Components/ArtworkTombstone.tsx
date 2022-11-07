import { ArtworkTombstone_artwork$data } from "__generated__/ArtworkTombstone_artwork.graphql"
import { navigate } from "app/navigation/navigate"
import { Schema } from "app/utils/track"
import { Box, comma, Flex, Spacer, Text } from "palette"
import React, { useState } from "react"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { CascadingEndTimesBanner } from "./CascadingEndTimesBanner"

type Artist = NonNullable<NonNullable<ArtworkTombstone_artwork$data["artists"]>[0]>

export interface ArtworkTombstoneProps {
  artwork: ArtworkTombstone_artwork$data
}

export interface ArtworkTombstoneState {
  showingMoreArtists: boolean
  showAuthenticityCertificateModal: boolean
}

export const ArtworkTombstone: React.FC<ArtworkTombstoneProps> = ({ artwork }) => {
  const { trackEvent } = useTracking()
  const [showingMoreArtists, setShowingMoreArtists] = useState(false)

  const handleArtistTap = (href: string) => {
    trackEvent({
      action_name: Schema.ActionNames.ArtistName,
      action_type: Schema.ActionTypes.Tap,
      context_module: Schema.ContextModules.ArtworkTombstone,
    })
    navigate(href)
  }

  const showMoreArtists = () => {
    setShowingMoreArtists((current) => !current)
  }

  const renderSingleArtist = (artist: Artist) => {
    return <Text variant="lg-display">{renderArtistName(artist.name!, artist.href)}</Text>
  }

  const renderArtistName = (artistName: string, href: string | null) => {
    return href ? (
      <TouchableWithoutFeedback onPress={() => handleArtistTap(href)}>
        <Text variant="lg-display">{artistName}</Text>
      </TouchableWithoutFeedback>
    ) : (
      <Text variant="lg-display">{artistName}</Text>
    )
  }

  const renderMultipleArtists = () => {
    const artists = artwork.artists ?? []
    const truncatedArtists = !showingMoreArtists ? artists.slice(0, 3) : artists
    const artistNames = truncatedArtists.map((artist, index) => {
      const artistNameWithComma = index !== artists.length - 1 ? artist!.name + ", " : artist!.name!
      return (
        <React.Fragment key={artist!.href}>
          {renderArtistName(artistNameWithComma, artist!.href)}
        </React.Fragment>
      )
    })

    return (
      <Flex flexDirection="row" flexWrap="wrap">
        <Text variant="lg-display">
          {artistNames}
          {!showingMoreArtists && artists!.length > 3 && (
            <TouchableWithoutFeedback onPress={showMoreArtists}>
              <Text variant="lg-display">{artists!.length - 3} more</Text>
            </TouchableWithoutFeedback>
          )}
        </Text>
      </Flex>
    )
  }

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
    !artwork.sale.isClosed

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
      <Flex flexDirection="row" flexWrap="wrap">
        {artwork.artists?.length === 1
          ? renderSingleArtist(artwork!.artists![0]!)
          : renderMultipleArtists()}
        {!!(artwork.artists?.length === 0 && artwork.culturalMaker) &&
          renderArtistName(artwork.culturalMaker, null)}
      </Flex>
      <Flex flexDirection="row" flexWrap="wrap">
        <Text variant="lg-display" color="black60">
          {getArtworkTitleAndMaybeDate()}
        </Text>
      </Flex>
      {!!artwork.isInAuction && !artwork.sale?.isClosed && (
        <>
          {!!artwork.sale?.cascadingEndTimeIntervalMinutes && (
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
      title
      isInAuction
      medium
      date
      culturalMaker
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
      artists {
        name
        href
        ...FollowArtistLink_artist
      }
    }
  `,
})
