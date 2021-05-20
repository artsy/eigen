// //ToDo: Replace Collection types to AuctionResult types

import { AuctionResultsRail_collectionsModule } from "__generated__/AuctionResultsRail_collectionsModule.graphql"
import { Flex, Sans } from "palette"
import React, { useImperativeHandle, useRef } from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"

import {
  CardRailAuctionResultsImageContainer,
  CardRailAuctionResultsCard,
  CardRailMetadataContainer as MetadataContainer,
} from "lib/Components/Home/CardRailCard"
import { CardRailFlatList } from "lib/Components/Home/CardRailFlatList"
import { extractNodes } from "lib/utils/extractNodes"
import { compact } from "lodash"
import { useTracking } from "react-tracking"
import HomeAnalytics from "../homeAnalytics"
import { RailScrollProps } from "./types"

interface Props {
  collectionsModule: AuctionResultsRail_collectionsModule
}

type Collection = AuctionResultsRail_collectionsModule["results"][0]

const AuctionResultsRail: React.FC<Props & RailScrollProps> = (props) => {
  const listRef = useRef<FlatList<any>>()
  const tracking = useTracking()

  useImperativeHandle(props.scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  return (
    <View>
      <Flex pl="2" pr="2">
        <SectionTitle title="Auction Results for You" />
      </Flex>

      <CardRailFlatList<NonNullable<Collection>>
        listRef={listRef}
        data={compact(props.collectionsModule.results)}
        keyExtractor={(item, index) => item.slug || String(index)}
        horizontal={false}
        renderItem={({ item: result, index }) => {
          const artworkImageURLs = extractNodes(result.artworksConnection, (artwork) => artwork.image?.url!)

          return (
            <CardRailAuctionResultsCard
              style={{ marginHorizontal: 20, flexDirection: "row" }}
              onPress={
                result?.slug
                  ? () => {
                      const tapEvent = HomeAnalytics.collectionThumbnailTapEvent(result?.slug, index)
                      if (tapEvent) {
                        tracking.trackEvent(tapEvent)
                      }
                      navigate(`/collection/${result.slug}`)
                    }
                  : undefined
              }
            >
              <View style={{ flexDirection: "row" }}>
                <CardRailAuctionResultsImageContainer>
                  <ImageView
                    style={{ marginHorizontal: 10, marginVertical: 15 }}
                    width={80}
                    height={80}
                    imageURL={artworkImageURLs[0]}
                  />
                </CardRailAuctionResultsImageContainer>
                <MetadataContainer style={{ flexDirection: "row" }}>
                  <View>
                    <Sans numberOfLines={1} weight="medium" size="3t">
                      {/* {result?.title} */}
                      {"Artist Name"}
                    </Sans>
                    <Sans numberOfLines={1} size="3t">
                      {"Untitled, 2013"}
                      {/* {result?.artworksConnection?.counts?.total ? `${result.artworksConnection.counts.total} works` : ""} */}
                    </Sans>
                    <Sans numberOfLines={1} size="3t" color="black60">
                      {"Pastel on paper"}
                      {/* {result?.title} */}
                    </Sans>
                    <Sans numberOfLines={1} size="3t" color="black60">
                      {"Feb 13, 2019 * Sotheby's"}
                      {/* {result?.artworksConnection?.counts?.total ? `${result.artworksConnection.counts.total} works` : ""} */}
                    </Sans>
                  </View>
                  <View>
                    <Sans numberOfLines={1} weight="medium" size="3t">
                      {/* {result?.title} */}
                      {"£162,500"}
                    </Sans>
                    <Sans numberOfLines={1} size="3t" color="#00A03E">
                      {"235%"}
                    </Sans>
                  </View>
                </MetadataContainer>
              </View>
            </CardRailAuctionResultsCard>
          )
        }}
      />
    </View>
  )
}

export const ActionResultsRailFragmentContainer = createFragmentContainer(AuctionResultsRail, {
  collectionsModule: graphql`
    fragment AuctionResultsRail_collectionsModule on HomePageMarketingCollectionsModule {
      results {
        title
        slug
        artworksConnection(first: 3) {
          counts {
            total
          }
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
