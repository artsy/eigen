import { Flex, Sans } from "@artsy/palette"
import { SalesRail_salesModule } from "__generated__/SalesRail_salesModule.graphql"
import React, { Component } from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { SectionTitle } from "lib/Components/SectionTitle"
import Switchboard from "lib/NativeModules/SwitchBoard"

import { CardRailCard } from "lib/Components/Home/CardRailCard"
import { CardRailFlatList } from "lib/Components/Home/CardRailFlatList"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { capitalize } from "lodash"

const ARTWORKS_HEIGHT = 180

interface Props {
  salesModule: SalesRail_salesModule
}

type Sale = SalesRail_salesModule["results"][0]

export class FairsRail extends Component<Props> {
  render() {
    return (
      <View>
        <Flex pl="2" pr="2">
          <SectionTitle
            title="Auctions"
            subtitle="Upcoming timed and live auctions on Artsy"
            onPress={() => SwitchBoard.presentNavigationViewController(this, "/auctions")}
          />
        </Flex>

        <CardRailFlatList<Sale>
          data={this.props.salesModule.results}
          renderItem={({ item: result }) => {
            // Sales are expected to always have >= 2 artworks, but we should
            // still be cautious to avoid crashes if this assumption is broken.
            const artworkImageURLs = result.saleArtworksConnection.edges.map(edge => edge.node.artwork.image.url)
            return (
              <CardRailCard
                key={result.href}
                onPress={() => Switchboard.presentNavigationViewController(this, result.liveURLIfOpen || result.href)}
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
                    <Sans numberOfLines={2} weight="medium" size="3t">
                      {result.name}
                    </Sans>
                    <Sans numberOfLines={1} size="3t" color="black60" data-test-id="subtitle">
                      {!!result.liveStartAt ? "Live Auction" : "Timed Auction"} • {capitalize(result.displayTimelyAt)}
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
  overflow: hidden;
`

const MetadataContainer = styled.View`
  /* 13px on bottom helps the margin feel visually consistent around all sides */
  margin: 15px 15px 13px;
`

export default createFragmentContainer(FairsRail, {
  salesModule: graphql`
    fragment SalesRail_salesModule on HomePageSalesModule {
      results {
        id
        href
        name
        liveURLIfOpen
        liveStartAt
        displayTimelyAt
        saleArtworksConnection(first: 3) {
          edges {
            node {
              artwork {
                image {
                  url(version: "large")
                }
              }
            }
          }
        }
      }
    }
  `,
})
