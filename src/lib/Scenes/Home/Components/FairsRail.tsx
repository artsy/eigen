import { FairsRail_fairsModule } from "__generated__/FairsRail_fairsModule.graphql"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { SectionTitle } from "lib/Components/SectionTitle"
import { Flex, Sans } from "palette"
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
} from "lib/Components/Home/CardRailCard"
import { CardRailFlatList } from "lib/Components/Home/CardRailFlatList"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { concat, take } from "lodash"
import HomeAnalytics from "../homeAnalytics"
import { RailScrollProps } from "./types"

interface Props {
  fairsModule: FairsRail_fairsModule
}

type FairItem = FairsRail_fairsModule["results"][0]

const FairsRail: React.FC<Props & RailScrollProps> = (props) => {
  const listRef = useRef<FlatList<any>>()
  const tracking = useTracking()

  useImperativeHandle(props.scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  return (
    <View>
      <Flex pl="2" pr="2">
        <SectionTitle title="Featured fairs" subtitle="See works in top art fairs" />
      </Flex>

      <CardRailFlatList<FairItem>
        listRef={listRef}
        data={props.fairsModule.results}
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
                tracking.trackEvent(HomeAnalytics.fairThumbnailTapEvent(result?.internalID, result?.slug, index))
                if (result?.slug) {
                  navigate(`/fair/${result?.slug}`)
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
                  <Sans numberOfLines={1} weight="medium" size="3t">
                    {result?.name}
                  </Sans>
                  <Sans numberOfLines={1} size="3t" color="black60" data-test-id="card-subtitle">
                    {result?.exhibitionPeriod}
                    {Boolean(location) && `  •  ${location}`}
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
        exhibitionPeriod
        image {
          url(version: "large")
        }
        location {
          city
          country
        }
        followedArtistArtworks: filterArtworksConnection(first: 2, includeArtworksByFollowedArtists: true) {
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
