import { ArtworkTombstone_artwork$data } from "__generated__/ArtworkTombstone_artwork.graphql"
import { navigate } from "app/navigation/navigate"
import { Schema, track } from "app/utils/track"
import { Box, comma, Flex, Spacer, Text } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { CascadingEndTimesBanner } from "./CascadingEndTimesBanner"

type Artist = NonNullable<NonNullable<ArtworkTombstone_artwork$data["artists"]>[0]>

export interface ArtworkTombstoneProps {
  artwork: ArtworkTombstone_artwork$data
}

export interface ArtworkTombstoneState {
  showingMoreArtists: boolean
  showAuthenticityCertificateModal: boolean
}

@track()
export class ArtworkTombstone extends React.Component<
  ArtworkTombstoneProps,
  ArtworkTombstoneState
> {
  state = {
    showingMoreArtists: false,
    showAuthenticityCertificateModal: false,
  }

  @track(() => ({
    action_name: Schema.ActionNames.ArtistName,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.ArtworkTombstone,
  }))
  handleArtistTap(href: string) {
    navigate(href)
  }

  showMoreArtists = () => {
    this.setState({
      ...this.state,
      showingMoreArtists: !this.state.showingMoreArtists,
    })
  }

  renderSingleArtist(artist: Artist) {
    return <Text variant="lg-display">{this.renderArtistName(artist.name!, artist.href)}</Text>
  }

  renderArtistName(artistName: string, href: string | null) {
    return href ? (
      <TouchableWithoutFeedback onPress={this.handleArtistTap.bind(this, href)}>
        <Text variant="lg-display">{artistName}</Text>
      </TouchableWithoutFeedback>
    ) : (
      <Text variant="lg-display">{artistName}</Text>
    )
  }

  renderMultipleArtists = () => {
    const artists = this.props.artwork.artists ?? []
    const truncatedArtists = !this.state.showingMoreArtists ? artists.slice(0, 3) : artists
    const artistNames = truncatedArtists.map((artist, index) => {
      const artistNameWithComma = index !== artists.length - 1 ? artist!.name + ", " : artist!.name!
      return (
        <React.Fragment key={artist!.href}>
          {this.renderArtistName(artistNameWithComma, artist!.href)}
        </React.Fragment>
      )
    })

    return (
      <Flex flexDirection="row" flexWrap="wrap">
        <Text variant="lg-display">
          {artistNames}
          {!this.state.showingMoreArtists && artists! /* STRICTNESS_MIGRATION */.length > 3 && (
            <TouchableWithoutFeedback onPress={this.showMoreArtists}>
              <Text variant="lg-display">
                {artists! /* STRICTNESS_MIGRATION */.length - 3} more
              </Text>
            </TouchableWithoutFeedback>
          )}
        </Text>
      </Flex>
    )
  }

  getArtworkTitleAndMaybeDate = () => {
    const { artwork } = this.props

    if (artwork.date) {
      return `${artwork.title!}${comma} ${artwork.date}`
    }

    return artwork.title!
  }

  render() {
    const { artwork } = this.props
    const displayAuctionLotLabel =
      artwork.isInAuction &&
      artwork.saleArtwork &&
      artwork.saleArtwork.lotLabel &&
      artwork.sale &&
      !artwork.sale.isClosed

    return (
      <Box textAlign="left">
        <Flex flexDirection="row" flexWrap="wrap">
          {artwork.artists! /* STRICTNESS_MIGRATION */.length === 1
            ? this.renderSingleArtist(artwork!.artists![0]!)
            : this.renderMultipleArtists()}
          {!!(artwork.artists! /* STRICTNESS_MIGRATION */.length === 0 && artwork.culturalMaker) &&
            this.renderArtistName(artwork.culturalMaker, null)}
        </Flex>
        {!!displayAuctionLotLabel && (
          <>
            <Spacer mb={1} />
            <Text variant="sm" color="black100" weight="medium">
              Lot {artwork.saleArtwork.lotLabel}
            </Text>
          </>
        )}
        <Flex flexDirection="row" flexWrap="wrap">
          <Text variant="lg-display" color="black60">
            {this.getArtworkTitleAndMaybeDate()}
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
