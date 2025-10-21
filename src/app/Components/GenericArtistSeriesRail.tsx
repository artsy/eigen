import { Spacer, Text, useColor } from "@artsy/palette-mobile"
import { CollectionArtistSeriesRail_collectionGroup$data } from "__generated__/CollectionArtistSeriesRail_collectionGroup.graphql"
import { CardRailCard } from "app/Components/CardRail/CardRailCard"
import { CardRailFlatList } from "app/Components/CardRail/CardRailFlatList"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Schema } from "app/utils/track"
import { compact } from "lodash"
import { View } from "react-native"
import { useTracking } from "react-tracking"
// @ts-ignore
import styled from "styled-components/native"
import { MultipleImageLayout } from "./MultipleImageLayout"

interface GenericArtistSeriesRailProps {
  collections: CollectionArtistSeriesRail_collectionGroup$data["members"]
  contextScreenOwnerType: Schema.OwnerEntityTypes.Collection | Schema.OwnerEntityTypes.Artist
  contextScreenOwnerId: string
  contextScreenOwnerSlug: string
}

type GenericArtistSeriesItem = CollectionArtistSeriesRail_collectionGroup$data["members"][0]

export const GenericArtistSeriesRail: React.FC<GenericArtistSeriesRailProps> = (props) => {
  const color = useColor()
  const { collections, contextScreenOwnerType, contextScreenOwnerId, contextScreenOwnerSlug } =
    props

  const tracking = useTracking()

  const handleNavigation = (slug: string) => {
    return navigate(`/collection/${slug}`)
  }

  return (
    <View>
      <CardRailFlatList<GenericArtistSeriesItem>
        data={collections as GenericArtistSeriesItem[]}
        keyExtractor={(_item, index) => String(index)}
        initialNumToRender={3}
        ListHeaderComponent={() => <Spacer x={2} />}
        ListFooterComponent={() => <Spacer x={2} />}
        ItemSeparatorComponent={() => <Spacer x={0.5} />}
        renderItem={({ item: result, index }) => {
          const artworkImageURLs = compact(
            extractNodes(result?.artworksConnection, (artwork) => artwork.image?.url)
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
                <MultipleImageLayout imageURLs={artworkImageURLs} />

                <MetadataContainer>
                  <Text weight="medium" variant="sm" m="15px" mb={0}>
                    {result.title}
                  </Text>
                  {!!result.priceGuidance && (
                    <Text color={color("mono60")} variant="sm" mx="15px">
                      {"From $" + `${result.priceGuidance.toLocaleString()}`}
                    </Text>
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

const MetadataContainer = styled(View)`
  margin-bottom: 15px;
`
