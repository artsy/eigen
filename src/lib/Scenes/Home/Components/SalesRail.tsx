import { SalesRail_salesModule } from "__generated__/SalesRail_salesModule.graphql"
import {
  CARD_RAIL_ARTWORKS_HEIGHT as ARTWORKS_HEIGHT,
  CardRailArtworkImageContainer as ArtworkImageContainer,
  CardRailCard,
  CardRailDivision as Division,
  CardRailMetadataContainer as MetadataContainer,
} from "lib/Components/Home/CardRailCard"
import { CardRailFlatList } from "lib/Components/Home/CardRailFlatList"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { formatDisplayTimelyAt } from "lib/Scenes/Sale/helpers"
import { extractNodes } from "lib/utils/extractNodes"
import { compact } from "lodash"
import { bullet, Flex, Sans, Text } from "palette"
import { usePaletteFlagStore } from "palette/PaletteFlag"
import React, { useEffect, useImperativeHandle, useRef } from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import HomeAnalytics from "../homeAnalytics"
import { RailScrollProps } from "./types"

interface Props {
  salesModule: SalesRail_salesModule
  onHide?: () => void
  onShow?: () => void
}

type Sale = SalesRail_salesModule["results"][0]

const SalesRail: React.FC<Props & RailScrollProps> = (props) => {
  const { scrollRef, salesModule, onHide, onShow } = props
  const listRef = useRef<FlatList<any>>()
  const tracking = useTracking()
  const allowV3 = usePaletteFlagStore((state) => state.allowV3)

  const getSaleSubtitle = (liveStartAt: string | undefined | null, displayTimelyAt: string | undefined | null) => {
    const subtitle = !!liveStartAt ? "Live Auction" : "Timed Auction"
    const dateAt = formatDisplayTimelyAt(displayTimelyAt !== undefined ? displayTimelyAt : null)
    return `${subtitle} ${bullet} ${dateAt}`
  }

  useImperativeHandle(scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  // Checks to see if the artworks rail is being rendered and hides the separator accordingly
  useEffect(() => {
    salesModule.results?.length ? onShow?.() : onHide?.()
  }, [salesModule.results])

  if (!salesModule.results?.length) {
    return null
  }

  return (
    <View>
      <Flex pl="2" pr="2">
        <SectionTitle
          title="Auctions"
          subtitle="Discover and bid on works for you"
          onPress={() => {
            tracking.trackEvent(HomeAnalytics.auctionHeaderTapEvent())
            navigate("/auctions")
          }}
        />
      </Flex>
      <CardRailFlatList<Sale>
        listRef={listRef}
        data={salesModule.results}
        renderItem={({ item: result, index }) => {
          // Sales are expected to always have >= 2 artworks, but we should
          // still be cautious to avoid crashes if this assumption is broken.
          const availableArtworkImageURLs = compact(
            extractNodes(result?.saleArtworksConnection, (artwork) => artwork.artwork?.image?.url)
          )

          // Ensure we have an array of exactly 3 URLs, copying over the last image if we have less than 3
          const artworkImageURLs = [null, null, null].reduce((acc: string[], _, i) => {
            return [...acc, availableArtworkImageURLs[i] || acc[i - 1]]
          }, [])

          return (
            <CardRailCard
              key={result?.href!}
              onPress={() => {
                tracking.trackEvent(HomeAnalytics.auctionThumbnailTapEvent(result?.internalID, result?.slug, index))
                const url = result?.liveURLIfOpen ?? result?.href
                if (url) {
                  navigate(url)
                }
              }}
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
                  {/* TODO-PALETTE-V3 remove V2 part */}
                  {allowV3 ? (
                    <>
                      <Text numberOfLines={2} lineHeight="20" variant="mediumText">
                        {result?.name}
                      </Text>
                      <Text
                        numberOfLines={1}
                        lineHeight="20"
                        color="black60"
                        variant="mediumText"
                        data-test-id="sale-subtitle"
                        ellipsizeMode="middle"
                      >
                        {getSaleSubtitle(result?.liveStartAt, result?.displayTimelyAt).trim()}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Sans numberOfLines={2} weight="medium" size="3t">
                        {result?.name}
                      </Sans>
                      <Sans
                        numberOfLines={1}
                        size="3t"
                        color="black60"
                        data-test-id="sale-subtitle"
                        ellipsizeMode="middle"
                      >
                        {getSaleSubtitle(result?.liveStartAt, result?.displayTimelyAt).trim()}
                      </Sans>
                    </>
                  )}
                </MetadataContainer>
              </View>
            </CardRailCard>
          )
        }}
      />
    </View>
  )
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
