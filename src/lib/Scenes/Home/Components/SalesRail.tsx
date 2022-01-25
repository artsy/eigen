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
import { bullet, Flex, Text } from "palette"
import React, { useImperativeHandle, useRef } from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import HomeAnalytics from "../homeAnalytics"
import { RailScrollProps } from "./types"

interface Props {
  title: string
  subtitle?: string
  salesModule: SalesRail_salesModule
  mb?: number
}

type Sale = SalesRail_salesModule["results"][0]

const SalesRail: React.FC<Props & RailScrollProps> = ({
  title,
  subtitle,
  scrollRef,
  salesModule,
  mb,
}) => {
  const listRef = useRef<FlatList<any>>()
  const tracking = useTracking()

  const getSaleSubtitle = (
    liveStartAt: string | undefined | null,
    displayTimelyAt: string | undefined | null
  ) => {
    const saleSubtitle = !!liveStartAt ? "Live Auction" : "Timed Auction"
    const dateAt = formatDisplayTimelyAt(displayTimelyAt !== undefined ? displayTimelyAt : null)
    if (dateAt) {
      return `${saleSubtitle} ${bullet} ${dateAt}`
    } else {
      return `${saleSubtitle}`
    }
  }

  useImperativeHandle(scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  const hasSales = salesModule.results?.length

  if (!hasSales) {
    return null
  }

  return (
    <Flex mb={mb}>
      <Flex pl="2" pr="2">
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
                <ArtworkImageContainer>
                  <ImageView
                    width={ARTWORKS_HEIGHT}
                    height={ARTWORKS_HEIGHT}
                    imageURL={artworkImageURLs[0]}
                  />
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
                    {getSaleSubtitle(result?.liveStartAt, result?.displayTimelyAt).trim()}
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
