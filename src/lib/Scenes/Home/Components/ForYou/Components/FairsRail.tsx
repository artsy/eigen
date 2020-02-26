import { Sans, Separator } from "@artsy/palette"
import { FairsRail_fairs_module } from "__generated__/FairsRail_fairs_module.graphql"
import React, { Component } from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import { Card, CardScrollView } from "lib/Components/Home/CardScrollView"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import Switchboard from "lib/NativeModules/SwitchBoard"
import SectionTitle from "lib/Scenes/Home/Components/SectionTitle"

import { concat, take } from "lodash"

const ARTWORKS_HEIGHT = 180

interface Props {
  fairs_module: FairsRail_fairs_module
}

export class FairsRail extends Component<Props, null> {
  render() {
    if (!this.props.fairs_module.results.length) {
      return
    }

    const fairCards = this.props.fairs_module.results.map(result => {
      const artworks = take(
        concat(
          result.followedArtistArtworks.edges.map(edge => edge.node),
          result.otherArtworks.edges.map(edge => edge.node)
        ),
        3
      )
      // Fairs are expected to always have >= 3 artworks. We can make
      // assumptions about this in UI layout, but should still be cautious
      // to avoid crashes if this assumption is broken.
      const artworkImageURLs: string[] = []
      if (artworks.length > 0) {
        artworkImageURLs.push(artworks[0].image.mediumImage)
      }
      if (artworks.length > 1) {
        artworkImageURLs.push(artworks[1].image.smallImage)
      }
      if (artworks.length > 2) {
        artworkImageURLs.push(artworks[2].image.smallImage)
      }
      return (
        <Card
          key={result.slug}
          onPress={() => Switchboard.presentNavigationViewController(this, `${result.slug}?entity=fair`)}
        >
          <View>
            <ArtworkImageContainer>
              <ImageView width={ARTWORKS_HEIGHT} height={ARTWORKS_HEIGHT} imageURL={artworkImageURLs[0]} />
              <Division />
              <View>
                <ImageView width={ARTWORKS_HEIGHT / 2} height={ARTWORKS_HEIGHT / 2} imageURL={artworkImageURLs[1]} />
                <Division horizontal />
                <ImageView width={ARTWORKS_HEIGHT / 2} height={ARTWORKS_HEIGHT / 2} imageURL={artworkImageURLs[2]} />
              </View>
            </ArtworkImageContainer>
            <MetadataContainer>
              <Sans numberOfLines={1} weight="medium" size="3t">
                {result.name}
              </Sans>
              <Sans numberOfLines={1} size="3t">
                {result.exhibitionPeriod}
              </Sans>
            </MetadataContainer>
          </View>
        </Card>
      )
    })

    return (
      <View>
        <Title>
          <SectionTitle>Recommended Art Fairs</SectionTitle>
        </Title>
        <CardScrollView>{fairCards}</CardScrollView>
        <Separator />
      </View>
    )
  }
}

const Title = styled(SectionTitle)`
  margin-left: 20;
`

// Default is a vertical division
export const Division = styled.View<{ horizontal }>`
  border: 1px solid white;
  border-bottom-width: 0;
  ${({ horizontal }) => (horizontal ? "height" : "width")}: 1px;
`

const ArtworkImageContainer = styled.View`
  width: 100%;
  height: ${ARTWORKS_HEIGHT}px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const MetadataContainer = styled.View`
  /* 13px on bottom helps the margin feel visually consistent around all sides */
  margin: 15px 15px 13px;
`

export default createFragmentContainer(FairsRail, {
  fairs_module: graphql`
    fragment FairsRail_fairs_module on HomePageFairsModule {
      results {
        id
        slug
        profile {
          slug
        }
        name
        exhibitionPeriod
        followedArtistArtworks: filterArtworksConnection(first: 3, includeArtworksByFollowedArtists: true) {
          edges {
            node {
              image {
                smallImage: url(version: "small")
                mediumImage: url(version: "medium")
              }
            }
          }
        }
        otherArtworks: filterArtworksConnection(first: 3) {
          edges {
            node {
              image {
                smallImage: url(version: "small")
                mediumImage: url(version: "medium")
              }
            }
          }
        }
      }
    }
  `,
})
