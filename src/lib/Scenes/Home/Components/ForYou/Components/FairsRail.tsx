import { Flex, Sans } from "@artsy/palette"
import { FairsRail_fairs_module } from "__generated__/FairsRail_fairs_module.graphql"
import React, { Component } from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { SectionTitle } from "lib/Components/SectionTitle"
import Switchboard from "lib/NativeModules/SwitchBoard"

import { CardRailCard } from "lib/Components/Home/CardRailCard"
import { CardRailFlatList } from "lib/Components/Home/CardRailFlatList"
import { concat, take } from "lodash"

const ARTWORKS_HEIGHT = 180

interface Props {
  fairs_module: FairsRail_fairs_module
}

type FairItem = FairsRail_fairs_module["results"][0]

export class FairsRail extends Component<Props, null> {
  render() {
    return (
      <View>
        <Flex pl="2" pr="2">
          <SectionTitle title="Recommended Art Fairs" />
        </Flex>

        <CardRailFlatList<FairItem>
          data={this.props.fairs_module.results}
          renderItem={({ item: result }) => {
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
            const artworkImageURLs = artworks.map(artwork => artwork.image.url)
            return (
              <CardRailCard
                key={result.slug}
                onPress={() => Switchboard.presentNavigationViewController(this, `${result.slug}?entity=fair`)}
              >
                <View>
                  <ArtworkImageContainer>
                    <ImageView width={ARTWORKS_HEIGHT} height={ARTWORKS_HEIGHT} imageURL={artworkImageURLs[0]} />
                    <Division />
                    <View>
                      <ImageView
                        width={ARTWORKS_HEIGHT / 2}
                        height={ARTWORKS_HEIGHT / 2}
                        imageURL={artworkImageURLs[1]}
                      />
                      <Division horizontal />
                      <ImageView
                        width={ARTWORKS_HEIGHT / 2}
                        height={ARTWORKS_HEIGHT / 2}
                        imageURL={artworkImageURLs[2]}
                      />
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
              </CardRailCard>
            )
          }}
        />
      </View>
    )
  }
}

// Default is a vertical division
export const Division = styled.View<{ horizontal?: boolean }>`
  border: 1px solid white;
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
                url(version: "large")
              }
            }
          }
        }
        otherArtworks: filterArtworksConnection(first: 3) {
          edges {
            node {
              image {
                url(version: "large")
              }
            }
          }
        }
      }
    }
  `,
})
