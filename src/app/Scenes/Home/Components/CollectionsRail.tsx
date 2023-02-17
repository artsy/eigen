import { SpacingUnit, Flex, Text } from "@artsy/palette-mobile"
import { CollectionsRail_collectionsModule$data } from "__generated__/CollectionsRail_collectionsModule.graphql"
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
import { compact } from "lodash"
import React, { useImperativeHandle, useRef } from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { RailScrollProps } from "./types"

interface Props {
  title: string
  subtitle?: string
  collectionsModule: CollectionsRail_collectionsModule$data
  mb?: SpacingUnit
}

type Collection = CollectionsRail_collectionsModule$data["results"][0]

const CollectionsRail: React.FC<Props & RailScrollProps> = (props) => {
  const listRef = useRef<FlatList<any>>()
  const tracking = useTracking()

  useImperativeHandle(props.scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  if (!props.collectionsModule.results?.length) {
    return null
  }

  return (
    <Flex mb={props.mb}>
      <Flex pl={2} pr={2}>
        <SectionTitle title={props.title} subtitle={props.subtitle} />
      </Flex>

      <CardRailFlatList<NonNullable<Collection>>
        listRef={listRef}
        data={compact(props.collectionsModule.results)}
        keyExtractor={(item, index) => item.slug || String(index)}
        renderItem={({ item: result, index }) => {
          // Collections are expected to always have >= 2 artworks, but we should
          // still be cautious to avoid crashes if this assumption is broken.
          const artworkImageURLs = extractNodes(
            result.artworksConnection,
            (artwork) => artwork.image?.url!
          )

          return (
            <CardRailCard
              onPress={
                result?.slug
                  ? () => {
                      const tapEvent = HomeAnalytics.collectionThumbnailTapEvent(
                        result?.slug,
                        index
                      )
                      if (tapEvent) {
                        tracking.trackEvent(tapEvent)
                      }
                      navigate(`/collection/${result.slug}`)
                    }
                  : undefined
              }
            >
              <View>
                <ThreeUpImageLayout imageURLs={artworkImageURLs} />
                <MetadataContainer>
                  <Text variant="sm" numberOfLines={1} weight="medium">
                    {result?.title}
                  </Text>
                  <Text variant="sm" numberOfLines={1} color="black60">
                    {result?.artworksConnection?.counts?.total
                      ? `${result.artworksConnection.counts.total} works`
                      : ""}
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

export const CollectionsRailFragmentContainer = createFragmentContainer(CollectionsRail, {
  collectionsModule: graphql`
    fragment CollectionsRail_collectionsModule on HomePageMarketingCollectionsModule {
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
