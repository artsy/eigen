import { SalesRail_salesModule$data } from "__generated__/SalesRail_salesModule.graphql"
import {
  CardRailCard,
  CardRailMetadataContainer as MetadataContainer,
} from "app/Components/Home/CardRailCard"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import { ThreeUpImageLayout } from "app/Components/ThreeUpImageLayout"
import HomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { useFeatureFlag } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { compact } from "lodash"
import { Flex, Text } from "palette"
import React, { useImperativeHandle, useRef } from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { RailScrollProps } from "./types"

interface Props {
  title: string
  subtitle?: string
  salesModule: SalesRail_salesModule$data
  mb?: number
}

type Sale = SalesRail_salesModule$data["results"][0]

const SalesRail: React.FC<Props & RailScrollProps> = ({
  title,
  subtitle,
  scrollRef,
  salesModule,
  mb,
}) => {
  const listRef = useRef<FlatList<any>>()
  const tracking = useTracking()
  const isArtworksConnectionEnabled = useFeatureFlag("AREnableArtworksConnectionForAuction")

  useImperativeHandle(scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  const hasSales = salesModule.results?.length

  if (!hasSales) {
    return null
  }

  return (
    <Flex mb={mb}>
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
                  <Text numberOfLines={2} lineHeight="20" variant="sm">
                    {result?.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    lineHeight="20"
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
      />
    </Flex>
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
