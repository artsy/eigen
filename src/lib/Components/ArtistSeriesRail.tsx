import { color, Sans, Spacer } from "@artsy/palette"
import { ArtistCollectionsRail_collections } from "__generated__/ArtistCollectionsRail_collections.graphql"
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
import styled from "styled-components"

interface ArtistSeriesRailProps {
  collections: ArtistSeriesRail_collectionGroup["members"] | ArtistCollectionsRail_collections
}

type ArtistSeriesItem = ArtistSeriesRail_collectionGroup["members"][0] | ArtistCollectionsRail_collections[0]

export const GenericArtistSeriesRail: React.FC<ArtistSeriesRailProps> = ({ collections }) => {
  const navRef = useRef<any>()
  const handleNavigation = (slug: string) => {
    return SwitchBoard.presentNavigationViewController(navRef.current, `/collection/${slug}`)
  }
  return (
    <CardRailFlatList<ArtistSeriesItem>
      data={collections}
      keyExtractor={(_item, index) => String(index)}
      initialNumToRender={3}
      ListHeaderComponent={() => <Spacer mx={2} />}
      ListFooterComponent={() => <Spacer mx={2} />}
      ItemSeparatorComponent={() => <Spacer mx={0.5} />}
      renderItem={({ item: result, index }) => {
        const artworkImageURLs = result?.artworksConnection?.edges?.map(edge => edge?.node?.image?.url) ?? []

        return (
          <CardRailCard
            ref={navRef}
            key={index}
            onPress={() => {
              handleNavigation(result.slug)
            }}
          >
            <View>
              <ArtworkImageContainer>
                <ImageView
                  width={ARTWORKS_HEIGHT}
                  height={ARTWORKS_HEIGHT}
                  imageURL={artworkImageURLs[0] as any /* STRICTNESS_MIGRATION */}
                />
                <Division />
                <View>
                  <ImageView
                    width={ARTWORKS_HEIGHT / 2}
                    height={ARTWORKS_HEIGHT / 2}
                    imageURL={artworkImageURLs[1] as any /* STRICTNESS_MIGRATION */}
                  />
                  <Division horizontal />
                  <ImageView
                    width={ARTWORKS_HEIGHT / 2}
                    height={ARTWORKS_HEIGHT / 2 - 2}
                    imageURL={artworkImageURLs[2] as any /* STRICTNESS_MIGRATION */}
                  />
                </View>
              </ArtworkImageContainer>

              <MetadataContainer>
                <ArtistSeriesTitle weight="medium" size="3t">
                  {result.title}
                </ArtistSeriesTitle>
                <ArtistSeriesMeta color={color("black60")} size="3t">
                  {"From $" + `${result.priceGuidance! /* STRICTNESS_MIGRATION */.toLocaleString()}`}
                </ArtistSeriesMeta>
              </MetadataContainer>
            </View>
          </CardRailCard>
        )
      }}
    />
  )
}

export const ArtistSeriesMeta = styled(Sans)`
  margin: 0px 15px;
`

export const ArtistSeriesTitle = styled(Sans)`
  margin: 15px 15px 0px 15px;
`

const MetadataContainer = styled(View)`
  margin-bottom: 15px;
`
