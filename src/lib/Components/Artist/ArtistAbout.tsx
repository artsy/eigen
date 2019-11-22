import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import RelatedArtists from "../RelatedArtists"
import Articles from "./Articles"
import Biography from "./Biography"

import { Box, Separator, Spacer } from "@artsy/palette"
import { ArtistAbout_artist } from "__generated__/ArtistAbout_artist.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { get } from "lib/utils/get"
import { CaretButton } from "../Buttons/CaretButton"

interface Props {
  artist: ArtistAbout_artist
}

class ArtistAbout extends React.Component<Props> {
  render() {
    return (
      <Box py={3} px={2}>
        {this.biography()}
        {this.articles()}
        {this.relatedArtists()}
      </Box>
    )
  }

  biography() {
    if (this.props.artist.has_metadata) {
      return (
        <Box>
          <Biography artist={this.props.artist as any} />
          {this.auctionResults()}
          <Separator />
        </Box>
      )
    }
  }

  auctionResults() {
    if (this.props.artist.is_display_auction_link) {
      const url = `/artist/${this.props.artist.slug}/auction-results`
      return (
        <>
          <CaretButton onPress={() => SwitchBoard.presentNavigationViewController(this, url)} text="Auction results" />
          <Spacer mb={3} />
        </>
      )
    }
  }

  articles() {
    if (this.props.artist.articles.edges.length) {
      return (
        <>
          <Box my={3}>
            <Articles articles={this.props.artist.articles.edges.map(({ node }) => node)} />
          </Box>
          <Separator />
        </>
      )
    }
  }

  relatedArtists() {
    const relatedArtistsPresent = get(this.props, p => p.artist.related.artists.edges[0])

    return (
      relatedArtistsPresent && (
        <Box my={3}>
          <RelatedArtists artists={this.props.artist.related.artists.edges.map(({ node }) => node)} />
        </Box>
      )
    )
  }
}

export default createFragmentContainer(ArtistAbout, {
  artist: graphql`
    fragment ArtistAbout_artist on Artist {
      has_metadata: hasMetadata
      is_display_auction_link: isDisplayAuctionLink
      slug
      ...Biography_artist
      related {
        artists: artistsConnection(first: 16) {
          edges {
            node {
              ...RelatedArtists_artists
            }
          }
        }
      }
      articles: articlesConnection(first: 10) {
        edges {
          node {
            ...Articles_articles
          }
        }
      }
    }
  `,
})
