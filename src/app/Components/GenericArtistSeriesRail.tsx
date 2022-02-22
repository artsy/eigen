import { ArtistAbout_artist } from "__generated__/ArtistAbout_artist.graphql"
import { ArtistCollectionsRail_collections } from "__generated__/ArtistCollectionsRail_collections.graphql"
import { CollectionArtistSeriesRail_collectionGroup } from "__generated__/CollectionArtistSeriesRail_collectionGroup.graphql"
import {
  CARD_RAIL_ARTWORKS_HEIGHT as ARTWORKS_HEIGHT,
  CardRailArtworkImageContainer as ArtworkImageContainer,
  CardRailCard,
  CardRailDivision as Division,
} from "app/Components/Home/CardRailCard"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import ImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Schema } from "app/utils/track"
import { Sans, Spacer, useColor } from "palette"
import React from "react"
import { View } from "react-native"
import { useTracking } from "react-tracking"
// @ts-ignore
import styled from "styled-components/native"

interface GenericArtistSeriesRailProps {
  collections:
    | CollectionArtistSeriesRail_collectionGroup["members"]
    | ArtistAbout_artist["iconicCollections"]
  contextScreenOwnerType: Schema.OwnerEntityTypes.Collection | Schema.OwnerEntityTypes.Artist
  contextScreenOwnerId: string
  contextScreenOwnerSlug: string
}

type GenericArtistSeriesItem =
  | CollectionArtistSeriesRail_collectionGroup["members"][0]
  | ArtistCollectionsRail_collections[0]

export const GenericArtistSeriesRail: React.FC<GenericArtistSeriesRailProps> = (props) => {
  const color = useColor()
  const { collections, contextScreenOwnerType, contextScreenOwnerId, contextScreenOwnerSlug } =
    props

  const tracking = useTracking()

  const handleNavigation = (slug: string) => {
    return navigate(`/collection/${slug}`)
  }

  const validateArtworkImageURL = (
    url: string | null | undefined,
    firstFallbackUrl: string | null | undefined,
    secondFallbackUrl: string | null | undefined = null
  ) => {
    return url ? url : firstFallbackUrl ? firstFallbackUrl : secondFallbackUrl
  }

  return (
    <View>
      <CardRailFlatList<GenericArtistSeriesItem>
        data={collections as GenericArtistSeriesItem[]}
        keyExtractor={(_item, index) => String(index)}
        initialNumToRender={3}
        ListHeaderComponent={() => <Spacer mx={2} />}
        ListFooterComponent={() => <Spacer mx={2} />}
        ItemSeparatorComponent={() => <Spacer mx={0.5} />}
        renderItem={({ item: result, index }) => {
          const artworkImageURLs = extractNodes(
            result?.artworksConnection,
            (artwork) => artwork.image?.url!
          )

          return (
            <CardRailCard
              key={index}
              onPress={() => {
                tracking.trackEvent({
                  context_module: Schema.ContextModules.ArtistSeriesRail,
                  context_screen_owner_type: contextScreenOwnerType,
                  context_screen_owner_id: contextScreenOwnerId,
                  context_screen_owner_slug: contextScreenOwnerSlug,
                  destination_screen_owner_type: Schema.OwnerEntityTypes.Collection,
                  destination_screen_owner_id: result.id,
                  destination_screen_owner_slug: result.slug,
                  horizontal_slide_position: index,
                  action_type: Schema.ActionTypes.TappedCollectionGroup,
                  type: "thumbnail",
                })

                handleNavigation(result.slug)
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
                      imageURL={validateArtworkImageURL(artworkImageURLs[1], artworkImageURLs[0])}
                    />
                    <Division horizontal />
                    <ImageView
                      width={ARTWORKS_HEIGHT / 2}
                      height={ARTWORKS_HEIGHT / 2 - 2}
                      imageURL={validateArtworkImageURL(
                        artworkImageURLs[2],
                        artworkImageURLs[1],
                        artworkImageURLs[0]
                      )}
                    />
                  </View>
                </ArtworkImageContainer>

                <MetadataContainer>
                  <GenericArtistSeriesTitle weight="medium" size="3t">
                    {result.title}
                  </GenericArtistSeriesTitle>
                  {!!result.priceGuidance && (
                    <GenericArtistSeriesMeta color={color("black60")} size="3t">
                      {"From $" + `${result.priceGuidance.toLocaleString()}`}
                    </GenericArtistSeriesMeta>
                  )}
                </MetadataContainer>
              </View>
            </CardRailCard>
          )
        }}
      />
    </View>
  )
}

export const GenericArtistSeriesMeta = styled(Sans)`
  margin: 0 15px;
`

export const GenericArtistSeriesTitle = styled(Sans)`
  margin: 15px 15px 0 15px;
`

const MetadataContainer = styled(View)`
  margin-bottom: 15px;
`
