import { ContextModule, OwnerType, tappedEntityGroup, TappedEntityGroupArgs } from "@artsy/cohesion"
import { ArtistList_targetSupply$data } from "__generated__/ArtistList_targetSupply.graphql"
import { navigate } from "app/navigation/navigate"
import { PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
import { chunk, shuffle } from "lodash"
import { Box, EntityHeader, Flex, Join, Sans, Spacer } from "palette"
import { Touchable } from "palette"
import React from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtistListProps {
  targetSupply: ArtistList_targetSupply$data
  isLoading?: boolean
}

export const ArtistList: React.FC<ArtistListProps> = ({ targetSupply, isLoading }) => {
  if (isLoading) {
    return <ArtistListPlaceholder />
  }

  const microfunnelItems = targetSupply.microfunnel || []
  if (microfunnelItems.length === 0) {
    return null
  }

  const artists = shuffle(microfunnelItems.map((x) => x?.artist))
  const chunksOfArtists = chunk(artists, 4)

  return (
    <Box>
      <Box>
        <Sans size="4" px={2}>
          Artists in-demand on Artsy
        </Sans>

        <Spacer mb={2} />

        <FlatList
          horizontal
          ListHeaderComponent={() => <Spacer mr={2} />}
          ListFooterComponent={() => <Spacer mr={2} />}
          ItemSeparatorComponent={() => <Spacer mr={3} />}
          showsHorizontalScrollIndicator={false}
          data={chunksOfArtists}
          initialNumToRender={2}
          renderItem={({ item }) => (
            <Flex>
              <Join separator={<Spacer mb={2} />}>
                {item.map((artist, index) => {
                  return <ArtistItem artist={artist} key={artist?.name || index} />
                })}
              </Join>
            </Flex>
          )}
          keyExtractor={(_item, index) => String(index)}
        />
      </Box>
    </Box>
  )
}

export const ArtistListFragmentContainer = createFragmentContainer(ArtistList, {
  targetSupply: graphql`
    fragment ArtistList_targetSupply on TargetSupply {
      microfunnel {
        artist {
          internalID
          name
          href
          slug
          image {
            cropped(width: 76, height: 70) {
              url
              width
              height
            }
          }
        }
      }
    }
  `,
})

const trackingArgs: TappedEntityGroupArgs = {
  contextModule: ContextModule.artistHighDemandGrid,
  contextScreenOwnerType: OwnerType.sell,
  destinationScreenOwnerType: OwnerType.artist,
  type: "thumbnail",
}

const ArtistItem: React.FC<{ artist: any }> = ({ artist }) => {
  const imageUrl = artist.image?.cropped?.url
  const tracking = useTracking()

  const handlePress = () => {
    if (artist.href) {
      tracking.trackEvent(
        tappedEntityGroup({
          ...trackingArgs,
          destinationScreenOwnerId: artist.internalID,
          destinationScreenOwnerSlug: artist.slug,
        })
      )
      navigate(artist.href)
    }
  }

  return (
    <View>
      <Touchable testID="artist-item" onPress={handlePress}>
        <Box width="270">
          <EntityHeader name={artist.name || ""} imageUrl={imageUrl || undefined} />
        </Box>
      </Touchable>
    </View>
  )
}

const ArtistListPlaceholder: React.FC = () => {
  return (
    <Box>
      <Box px={2}>
        <PlaceholderText width={250} />
      </Box>

      <Spacer mb={2} />

      <Flex flexDirection="row" pl={2}>
        <Flex>
          <Join separator={<Spacer mb={2} />}>
            {[...new Array(4)].map((_, index) => {
              return (
                <Flex flexDirection="row" alignItems="center" key={index}>
                  <PlaceholderBox height={45} width={45} marginRight={10} />
                  <PlaceholderText width={150} />
                </Flex>
              )
            })}
          </Join>
        </Flex>
      </Flex>
    </Box>
  )
}
