import { FairsRail_fairsModule$data } from "__generated__/FairsRail_fairsModule.graphql"
import ImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { SectionTitle } from "app/Components/SectionTitle"
import { bullet, Flex, Text } from "palette"
import React, { useImperativeHandle, useRef } from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

import {
  CARD_RAIL_ARTWORKS_HEIGHT as ARTWORKS_HEIGHT,
  CardRailArtworkImageContainer as ArtworkImageContainer,
  CardRailCard,
  CardRailDivision as Division,
  CardRailMetadataContainer as MetadataContainer,
} from "app/Components/Home/CardRailCard"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { concat, take } from "lodash"
import HomeAnalytics from "../homeAnalytics"
import { RailScrollProps } from "./types"

interface Props {
  title: string
  subtitle?: string
  fairsModule: FairsRail_fairsModule$data
  mb?: number
}

type FairItem = FairsRail_fairsModule$data["results"][0]

const FairsRail: React.FC<Props & RailScrollProps> = (props) => {
  const listRef = useRef<FlatList<any>>()
  const tracking = useTracking()

  useImperativeHandle(props.scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  const FairHeader = () => (
    <Flex pl="2" pr="2">
      <SectionTitle title={props.title} subtitle={props.subtitle} />
    </Flex>
  )

  if (!props.fairsModule?.results?.length) {
    return null
  }

  return (
    <Flex mb={props.mb}>
      {props.fairsModule.results.length ? <FairHeader /> : null}
      <CardRailFlatList<FairItem>
        listRef={listRef}
        data={props.fairsModule.results}
        ListEmptyComponent={() => <React.Fragment />}
        renderItem={({ item: result, index }) => {
          // Fairs are expected to always have >= 2 artworks and a hero image.
          // We can make assumptions about this in UI layout, but should still
          // be cautious to avoid crashes if this assumption is broken.
          const artworkImageURLs = take(
            concat(
              [result?.image?.url!],
              extractNodes(result?.followedArtistArtworks, (artwork) => artwork.image?.url!),
              extractNodes(result?.otherArtworks, (artwork) => artwork.image?.url!)
            ),
            3
          )
          const location = result?.location?.city || result?.location?.country
          return (
            <CardRailCard
              key={result?.slug}
              onPress={() => {
                tracking.trackEvent(
                  HomeAnalytics.fairThumbnailTapEvent(result?.internalID, result?.slug, index)
                )
                if (result?.slug) {
                  navigate(`/fair/${result?.slug}`)
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
                  <Text numberOfLines={1} lineHeight="20" variant="sm">
                    {result?.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    lineHeight="20"
                    color="black60"
                    variant="sm"
                    testID="card-subtitle"
                    ellipsizeMode="middle"
                  >
                    {result?.exhibitionPeriod}
                    {Boolean(location) && `  ${bullet}  ${location}`}
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

export const FairsRailFragmentContainer = createFragmentContainer(FairsRail, {
  fairsModule: graphql`
    fragment FairsRail_fairsModule on HomePageFairsModule {
      results {
        id
        internalID
        slug
        profile {
          slug
        }
        name
        exhibitionPeriod(format: SHORT)
        image {
          url(version: "large")
        }
        location {
          city
          country
        }
        followedArtistArtworks: filterArtworksConnection(
          first: 2
          input: { includeArtworksByFollowedArtists: true }
        ) {
          edges {
            node {
              image {
                url(version: "large")
              }
            }
          }
        }
        otherArtworks: filterArtworksConnection(first: 2) {
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
