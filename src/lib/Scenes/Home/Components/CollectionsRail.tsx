import { Flex, Sans } from "@artsy/palette"
import { CollectionsRail_collectionsModule } from "__generated__/CollectionsRail_collectionsModule.graphql"
import React, { Component, createRef } from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { SectionTitle } from "lib/Components/SectionTitle"
import Switchboard from "lib/NativeModules/SwitchBoard"

import {
  CARD_RAIL_ARTWORKS_HEIGHT as ARTWORKS_HEIGHT,
  CardRailArtworkImageContainer as ArtworkImageContainer,
  CardRailCard,
  CardRailDivision as Division,
  CardRailMetadataContainer as MetadataContainer,
} from "lib/Components/Home/CardRailCard"
import { CardRailFlatList } from "lib/Components/Home/CardRailFlatList"
import { compact } from "lodash"
import { RailScrollRef } from "./types"

interface Props {
  collectionsModule: CollectionsRail_collectionsModule
}

type Collection = CollectionsRail_collectionsModule["results"][0]

export class CollectionsRail extends Component<Props> implements RailScrollRef {
  private listRef = createRef<FlatList<any>>()

  scrollToTop() {
    this.listRef.current?.scrollToOffset({ offset: 0, animated: true })
  }

  render() {
    return (
      <View>
        <Flex pl="2" pr="2">
          <SectionTitle title="Collections" subtitle="The newest works curated by Artsy" />
        </Flex>

        <CardRailFlatList<NonNullable<Collection>>
          listRef={this.listRef}
          data={compact(this.props.collectionsModule.results)}
          keyExtractor={(item, index) => item.slug || String(index)}
          renderItem={({ item: result }) => {
            // Collections are expected to always have >= 2 artworks, but we should
            // still be cautious to avoid crashes if this assumption is broken.
            const artworkImageURLs = result.artworksConnection?.edges?.map(edge => edge?.node?.image?.url!) || []

            return (
              <CardRailCard
                onPress={() =>
                  result?.slug
                    ? Switchboard.presentNavigationViewController(this, `/collection/${result.slug}`)
                    : undefined
                }
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
                      {result?.title}
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

export const CollectionsRailFragmentContainer = createFragmentContainer(CollectionsRail, {
  collectionsModule: graphql`
    fragment CollectionsRail_collectionsModule on HomePageMarketingCollectionsModule {
      results {
        title
        slug
        artworksConnection(first: 3) {
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
