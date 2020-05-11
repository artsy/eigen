import { Flex, Sans } from "@artsy/palette"
import { SalesRail_salesModule } from "__generated__/SalesRail_salesModule.graphql"
import React, { Component, createRef } from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { SectionTitle } from "lib/Components/SectionTitle"
import Switchboard from "lib/NativeModules/SwitchBoard"
import track, { TrackingProp } from "react-tracking"

import {
  CARD_RAIL_ARTWORKS_HEIGHT as ARTWORKS_HEIGHT,
  CardRailArtworkImageContainer as ArtworkImageContainer,
  CardRailCard,
  CardRailDivision as Division,
  CardRailMetadataContainer as MetadataContainer,
} from "lib/Components/Home/CardRailCard"
import { CardRailFlatList } from "lib/Components/Home/CardRailFlatList"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { capitalize } from "lodash"
import HomeAnalytics from "../homeAnalytics"
import { RailScrollRef } from "./types"

interface Props {
  salesModule: SalesRail_salesModule
  tracking: TrackingProp
}

type Sale = SalesRail_salesModule["results"][0]

@track()
export class SalesRail extends Component<Props> implements RailScrollRef {
  private listRef = createRef<FlatList<any>>()

  scrollToTop() {
    this.listRef.current?.scrollToOffset({ offset: 0, animated: false })
  }

  render() {
    return (
      <View>
        <Flex pl="2" pr="2">
          <SectionTitle
            title="Auctions"
            subtitle="Bid online in live and timed auctions"
            onPress={() => {
              this.props.tracking.trackEvent(HomeAnalytics.auctionHeaderTapEvent())
              SwitchBoard.presentNavigationViewController(this, "/auctions")
            }}
          />
        </Flex>

        <CardRailFlatList<Sale>
          listRef={this.listRef}
          data={this.props.salesModule.results}
          renderItem={({ item: result }) => {
            // Sales are expected to always have >= 2 artworks, but we should
            // still be cautious to avoid crashes if this assumption is broken.
            const artworkImageURLs = result?.saleArtworksConnection?.edges?.map(
              edge => edge?.node?.artwork?.image?.url! /* STRICTNESS_MIGRATION */
            )

            return (
              <CardRailCard
                key={result?.href! /* STRICTNESS_MIGRATION */}
                onPress={() => {
                  this.props.tracking.trackEvent(
                    HomeAnalytics.auctionThumbnailTapEvent(
                      result?.internalID ?? "unspecified",
                      result?.slug ?? "unspecified"
                    )
                  )
                  Switchboard.presentNavigationViewController(
                    this,
                    result?.liveURLIfOpen! /* STRICTNESS_MIGRATION */ || result?.href! /* STRICTNESS_MIGRATION */
                  )
                }}
              >
                <View>
                  <ArtworkImageContainer>
                    <ImageView
                      width={ARTWORKS_HEIGHT}
                      height={ARTWORKS_HEIGHT}
                      imageURL={artworkImageURLs! /* STRICTNESS_MIGRATION */[0]}
                    />
                    <Division />
                    <View>
                      <ImageView
                        width={ARTWORKS_HEIGHT / 2}
                        height={ARTWORKS_HEIGHT / 2}
                        imageURL={artworkImageURLs! /* STRICTNESS_MIGRATION */[1]}
                      />
                      <Division horizontal />
                      <ImageView
                        width={ARTWORKS_HEIGHT / 2}
                        height={ARTWORKS_HEIGHT / 2}
                        imageURL={artworkImageURLs! /* STRICTNESS_MIGRATION */[2]}
                      />
                    </View>
                  </ArtworkImageContainer>
                  <MetadataContainer>
                    <Sans numberOfLines={2} weight="medium" size="3t">
                      {result?./* STRICTNESS_MIGRATION */ name}
                    </Sans>
                    <Sans numberOfLines={1} size="3t" color="black60" data-test-id="sale-subtitle">
                      {!!result?./* STRICTNESS_MIGRATION */ liveStartAt ? "Live Auction" : "Timed Auction"} •{" "}
                      {capitalize(result?.displayTimelyAt! /* STRICTNESS_MIGRATION */)}
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

export const SalesRailFragmentContainer = createFragmentContainer(SalesRail, {
  salesModule: graphql`
    fragment SalesRail_salesModule on HomePageSalesModule {
      results {
        id
        slug
        internalID
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
