import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { RelatedArtistsContainer } from "../RelatedArtists"
import { ArticlesContainer } from "./Articles"
import { BiographyContainer } from "./Biography"

import { Box, Separator, Spacer } from "@artsy/palette"
import { ArtistAbout_artist } from "__generated__/ArtistAbout_artist.graphql"
import { SwitchBoard } from "lib/NativeModules/SwitchBoard"
import { CaretButton } from "../Buttons/CaretButton"
import { StickyTabPageScrollView } from "../StickyTabPage/StickyTabPageScrollView"
import { ArtistConsignButtonFragmentContainer as ArtistConsignButton } from "./ArtistConsignButton"

interface Props {
  artist: ArtistAbout_artist
}

class ArtistAbout extends React.Component<Props> {
  render() {
    return (
      <StickyTabPageScrollView>
        {this.biography()}
        {this.articles()}
        {this.relatedArtists()}
      </StickyTabPageScrollView>
    )
  }

  biography() {
    if (this.props.artist.has_metadata) {
      return (
        <Box>
          <BiographyContainer artist={this.props.artist as any} />
          {this.auctionResults()}
          {this.consignButton()}
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

  consignButton() {
    return (
      <>
        <ArtistConsignButton artist={this.props.artist} />
        <Spacer mb={3} />
      </>
    )
  }

  articles() {
    if (this.props.artist.articles?.edges?.length) {
      return (
        <>
          <Box my={3}>
            <ArticlesContainer articles={this.props.artist.articles.edges.map(elem => elem?.node!)} />
          </Box>
          <Separator />
        </>
      )
    }
  }

  relatedArtists() {
    const relatedArtistsPresent = this.props.artist.related?.artists?.edges?.[0]

    return (
      relatedArtistsPresent && (
        <Box my={3}>
          <RelatedArtistsContainer
            artists={this.props.artist.related?.artists?.edges?.map(elem => elem?.node!) ?? []}
          />
        </Box>
      )
    )
  }
}

export const ArtistAboutContainer = createFragmentContainer(ArtistAbout, {
  artist: graphql`
    fragment ArtistAbout_artist on Artist {
      has_metadata: hasMetadata
      is_display_auction_link: isDisplayAuctionLink
      slug
      ...Biography_artist
      ...ArtistConsignButton_artist
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
