import { color, Flex, Join, Sans } from "@artsy/palette"
import { ArtistSeriesRail_collectionGroup } from "__generated__/ArtistSeriesRail_collectionGroup.graphql"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React, { useRef } from "react"
import { FlatList, TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

interface ArtistSeriesRailProps {
  collectionGroup: ArtistSeriesRail_collectionGroup
}

const ARTWORKS_HEIGHT = 180

export const ArtistSeriesRail: React.SFC<ArtistSeriesRailProps> = props => {
  const navRef = useRef<any>()
  const { collectionGroup } = props

  const renderItem = artworkPanelItem => {
    const artworks = artworkPanelItem?.artworksConnection?.edges
    const imageMeta = (artwork, index) => {
      switch (index) {
        case 0:
          return {
            style: { width: ARTWORKS_HEIGHT - 2, height: ARTWORKS_HEIGHT + 1 },
            url: artwork?.node?.image?.url,
          }
        case 1:
          return {
            style: { width: ARTWORKS_HEIGHT / 2 - 1, height: ARTWORKS_HEIGHT / 2 },
            url: artwork?.node?.image?.url,
          }
        case 2:
          return {
            style: { width: ARTWORKS_HEIGHT / 2 - 1, height: ARTWORKS_HEIGHT / 2 - 1 },
            url: artwork?.node?.image?.url,
          }
      }
    }

    return (
      <ArtworkImageContainer>
        {
          <Join separator={<Division />}>
            <ImageView imageURL={imageMeta(artworks[0], 0).url} style={imageMeta(artworks[0], 0).style} />
            <Flex>
              <ImageView imageURL={imageMeta(artworks[1], 1).url} style={imageMeta(artworks[1], 1).style} />
              <Division />
              <ImageView imageURL={imageMeta(artworks[2], 2).url} style={imageMeta(artworks[2], 2).style} />
            </Flex>
          </Join>
        }
      </ArtworkImageContainer>
    )
  }

  const handleNavigationToCollection = (collectionSlug: string) => {
    SwitchBoard.presentNavigationViewController(navRef.current, `/collection/${collectionSlug}`)
  }

  return (
    <>
      <CollectionName weight="medium" size="3t" mb={2}>
        {collectionGroup.name}
      </CollectionName>
      <FlatList
        horizontal
        keyExtractor={(_item, index) => String(index)}
        data={collectionGroup?.members}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            ref={navRef}
            onPress={() => {
              handleNavigationToCollection(item.slug)
            }}
          >
            <ArtistSeriesItemWrapper mr={collectionGroup.members.length - 1 === index ? 0 : 2}>
              {renderItem(item)}
              <ArtistSeriesTitle weight="medium" size="3t">
                {item.title}
              </ArtistSeriesTitle>
              <ArtistSeriesMeta color={color("black60")} size="3t">
                {"From $" + `${item.priceGuidance.toLocaleString()}`}
              </ArtistSeriesMeta>
            </ArtistSeriesItemWrapper>
          </TouchableOpacity>
        )}
      />
    </>
  )
}

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

export const CollectionName = styled(Sans)``

export const ArtistSeriesMeta = styled(Sans)`
  margin: 0px 15px;
`

export const ArtistSeriesTitle = styled(Sans)`
  margin: 15px 15px 0px 15px;
`

const ArtistSeriesItemWrapper = styled(Flex)`
  flex-direction: column;
  width: 270px;
  height: 249px;
  border: solid 1px ${color("black10")};
`

export const ArtworkImageContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

export const Division = styled.View`
  border: 1px solid white;
  width: 1px;
`
