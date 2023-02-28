import { Flex, Text } from "@artsy/palette-mobile"
import themeGet from "@styled-system/theme-get"
import { CollectionsRail_collectionsModule$data } from "__generated__/CollectionsRail_collectionsModule.graphql"
import { FiveUpImageLayout } from "app/Components/FiveUpImageLayout"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import HomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { compact } from "lodash"
import React, { memo, useImperativeHandle, useRef } from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { RailScrollProps } from "./types"

interface Props {
  title: string
  subtitle?: string
  collectionsModule: CollectionsRail_collectionsModule$data
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
    <Flex>
      <Flex pl={2} pr={2}>
        <SectionTitle title={props.title} subtitle={props.subtitle} />
      </Flex>

      <CardRailFlatList<NonNullable<Collection>>
        listRef={listRef}
        data={compact(props.collectionsModule.results)}
        keyExtractor={(item, index) => item.slug || String(index)}
        renderItem={({ item, index }) => {
          // Collections are expected to always have >= 2 artworks, but we should
          // still be cautious to avoid crashes if this assumption is broken.
          const artworkImageURLs = extractNodes(
            item.artworksConnection,
            (artwork) => artwork.image?.url!
          )

          return (
            <CollectionCard
              testID={`collections-rail-card-${item.slug}`}
              onPress={
                item?.slug
                  ? () => {
                      const tapEvent = HomeAnalytics.collectionThumbnailTapEvent(item?.slug, index)
                      if (tapEvent) {
                        tracking.trackEvent(tapEvent)
                      }
                      navigate(`/collection/${item.slug}`)
                    }
                  : undefined
              }
            >
              <Flex>
                <FiveUpImageLayout imageURLs={artworkImageURLs} />

                <Flex mt={1}>
                  <Text variant="sm-display" numberOfLines={1} weight="medium">
                    {item?.title}
                  </Text>
                  <Text variant="xs" numberOfLines={1} color="black60">
                    {item?.artworksConnection?.counts?.total
                      ? `${item.artworksConnection.counts.total} works`
                      : ""}
                  </Text>
                </Flex>
              </Flex>
            </CollectionCard>
          )
        }}
      />
    </Flex>
  )
}

export const CollectionsRailFragmentContainer = memo(
  createFragmentContainer(CollectionsRail, {
    collectionsModule: graphql`
      fragment CollectionsRail_collectionsModule on HomePageMarketingCollectionsModule {
        results {
          title
          slug
          artworksConnection(first: 5, sort: "-decayed_merch") {
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
)

const CollectionCard = styled.TouchableHighlight.attrs(() => ({
  underlayColor: themeGet("colors.white100"),
  activeOpacity: 0.8,
}))``
