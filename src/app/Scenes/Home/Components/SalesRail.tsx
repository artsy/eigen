import { Flex, Text } from "@artsy/palette-mobile"
import { SalesRail_salesModule$data } from "__generated__/SalesRail_salesModule.graphql"
import { BrowseMoreRailCard } from "app/Components/BrowseMoreRailCard"
import {
  CardRailCard,
  CardRailMetadataContainer as MetadataContainer,
} from "app/Components/Home/CardRailCard"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import { ThreeUpImageLayout } from "app/Components/ThreeUpImageLayout"
import HomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { compact } from "lodash"
import React, { memo, useImperativeHandle, useRef } from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { RailScrollProps } from "./types"

interface Props {
  title: string
  subtitle?: string
  salesModule: SalesRail_salesModule$data
}

type Sale = SalesRail_salesModule$data["results"][0]

const SalesRail: React.FC<Props & RailScrollProps> = ({
  title,
  subtitle,
  scrollRef,
  salesModule,
}) => {
  const listRef = useRef<FlatList<any>>()
  const tracking = useTracking()
  const isArtworksConnectionEnabled = useFeatureFlag("AREnableArtworksConnectionForAuction")

  const { width } = useScreenDimensions()
  const isTablet = width > 700

  useImperativeHandle(scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  const hasSales = salesModule.results?.length

  const handleMorePress = () => {
    tracking.trackEvent(HomeAnalytics.auctionBrowseMoreTapEvent())
    navigate("/auctions")
  }

  if (!hasSales) {
    return null
  }

  return (
    <Flex>
      <Flex px={2}>
        <SectionTitle
          title={title}
          subtitle={subtitle}
          onPress={() => {
            tracking.trackEvent(HomeAnalytics.auctionHeaderTapEvent())
            navigate("/auctions")
          }}
        />
      </Flex>
      <CardRailFlatList<Sale>
        prefetchUrlExtractor={(item) => item?.href!}
        prefetchVariablesExtractor={(item) => ({ saleSlug: item?.slug })}
        listRef={listRef}
        data={salesModule.results}
        initialNumToRender={isTablet ? 10 : 5}
        renderItem={({ item: result, index }) => {
          let imageURLs

          if (isArtworksConnectionEnabled) {
            imageURLs = extractNodes(result?.artworksConnection, (artwork) => artwork.image?.url)
          } else {
            imageURLs = extractNodes(
              result?.saleArtworksConnection,
              (artwork) => artwork.artwork?.image?.url
            )
          }

          // Sales are expected to always have >= 2 artworks, but we should
          // still be cautious to avoid crashes if this assumption is broken.
          const availableArtworkImageURLs = compact(imageURLs)

          return (
            <CardRailCard
              key={result?.href!}
              onPress={() => {
                tracking.trackEvent(
                  HomeAnalytics.auctionThumbnailTapEvent(result?.internalID, result?.slug, index)
                )
                const url = result?.liveURLIfOpen ?? result?.href
                if (url) {
                  navigate(url)
                }
              }}
            >
              <View>
                <ThreeUpImageLayout imageURLs={availableArtworkImageURLs} />
                <MetadataContainer>
                  <Text numberOfLines={2} lineHeight="20px" variant="sm">
                    {result?.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    lineHeight="20px"
                    color="black60"
                    variant="sm"
                    testID="sale-subtitle"
                    ellipsizeMode="middle"
                  >
                    {result?.formattedStartDateTime}
                  </Text>
                </MetadataContainer>
              </View>
            </CardRailCard>
          )
        }}
        ListFooterComponent={
          handleMorePress ? (
            <BrowseMoreRailCard onPress={handleMorePress} text="Browse All Auctions" />
          ) : undefined
        }
      />
    </Flex>
  )
}

export const SalesRailFragmentContainer = memo(
  createFragmentContainer(SalesRail, {
    salesModule: graphql`
      fragment SalesRail_salesModule on HomePageSalesModule {
        results {
          id
          slug
          internalID
          href
          name
          liveURLIfOpen
          formattedStartDateTime
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
)
