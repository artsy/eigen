import { color, Flex, Sans, Spacer } from "@artsy/palette"
import { ArtistSeriesRail_collectionGroup } from "__generated__/ArtistSeriesRail_collectionGroup.graphql"
import {
  CARD_RAIL_ARTWORKS_HEIGHT as ARTWORKS_HEIGHT,
  CardRailArtworkImageContainer as ArtworkImageContainer,
  CardRailCard,
  CardRailDivision as Division,
} from "lib/Components/Home/CardRailCard"
import { CardRailFlatList } from "lib/Components/Home/CardRailFlatList"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React, { useRef } from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

interface ArtistSeriesRailProps {
  collectionGroup: ArtistSeriesRail_collectionGroup
}

type ArtistSeriesItem = ArtistSeriesRail_collectionGroup["members"][0]

export const ArtistSeriesRail: React.SFC<ArtistSeriesRailProps> = props => {
  const navRef = useRef<any>()
  const { collectionGroup } = props

  return (
    <ArtistSeriesWrapper>
      <CollectionName size="4" mb={2} ml={4}>
        {collectionGroup.name}
      </CollectionName>
      <CardRailFlatList<ArtistSeriesItem>
        data={collectionGroup?.members}
        keyExtractor={(_item, index) => String(index)}
        ListHeaderComponent={() => <Spacer mx={2} />}
        ListFooterComponent={() => <Spacer mx={2} />}
        ItemSeparatorComponent={() => <Spacer mx={0.5} />}
        initialNumToRender={3}
        renderItem={({ item: result, index }) => {
          const artworkImageURLs = result?.artworksConnection?.edges?.map(edge => edge?.node?.image?.url) ?? []

          return (
            <CardRailCard
              ref={navRef}
              key={index}
              onPress={() => SwitchBoard.presentNavigationViewController(navRef.current, `/collection/${result.slug}`)}
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
                      height={ARTWORKS_HEIGHT / 2 - 2}
                      imageURL={artworkImageURLs[2]}
                    />
                  </View>
                </ArtworkImageContainer>

                <MetadataContainer>
                  <ArtistSeriesTitle weight="medium" size="3t">
                    {result.title}
                  </ArtistSeriesTitle>
                  <ArtistSeriesMeta color={color("black60")} size="3t">
                    {"From $" + `${result.priceGuidance.toLocaleString()}`}
                  </ArtistSeriesMeta>
                </MetadataContainer>
              </View>
            </CardRailCard>
          )
        }}
      />
    </ArtistSeriesWrapper>
  )
}

const ArtistSeriesWrapper = styled(Flex)`
  margin-left: -20px;
`

export const ArtistSeriesMeta = styled(Sans)`
  margin: 0px 15px;
`

export const ArtistSeriesTitle = styled(Sans)`
  margin: 15px 15px 0px 15px;
`

const MetadataContainer = styled.View`
  margin-bottom: 15px;
`

export const CollectionName = styled(Sans)``

export const ArtistSeriesRailContainer = createFragmentContainer(ArtistSeriesRail, {
  collectionGroup: graphql`
    fragment ArtistSeriesRail_collectionGroup on MarketingCollectionGroup {
      name
      members {
        slug
        title
        priceGuidance
        artworksConnection(first: 3, aggregations: [TOTAL], sort: "-decayed_merch") {
          edges {
            node {
              title
              image {
                url
              }
            }
          }
        }
        defaultHeader: artworksConnection(sort: "-decayed_merch", first: 1) {
          edges {
            node {
              image {
                url
              }
            }
          }
        }
      }
    }
  `,
})
