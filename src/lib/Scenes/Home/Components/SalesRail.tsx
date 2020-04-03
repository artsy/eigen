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
            // Fairs are expected to always have >= 2 artworks and a hero image.
            // We can make assumptions about this in UI layout, but should still
            // be cautious to avoid crashes if this assumption is broken.
            return (
              <CardRailCard
                key={result.slug}
                onPress={() => Switchboard.presentNavigationViewController(this, `${result.slug}`)}
              >
                <View>
                  <ArtworkImageContainer>
                    <ImageView width={ARTWORKS_HEIGHT} height={ARTWORKS_HEIGHT} imageURL={null} />
                    <Division />
                    <View>
                      <ImageView width={ARTWORKS_HEIGHT / 2} height={ARTWORKS_HEIGHT / 2} imageURL={null} />
                      <Division horizontal />
                      <ImageView width={ARTWORKS_HEIGHT / 2} height={ARTWORKS_HEIGHT / 2} imageURL={null} />
                    </View>
                  </ArtworkImageContainer>
                  <MetadataContainer>
                    <Sans numberOfLines={1} weight="medium" size="3t">
                      Title
                    </Sans>
                    <Sans numberOfLines={1} size="3t" color="black60" data-test-id="subtitle">
                      TBD
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
        slug
      }
    }
  `,
})
