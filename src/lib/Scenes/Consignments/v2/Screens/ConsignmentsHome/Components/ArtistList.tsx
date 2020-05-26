import { ContextModule, OwnerType, tappedEntityGroup, TappedEntityGroupArgs } from "@artsy/cohesion"
import { Box, color, EntityHeader, Flex, Join, Sans, Spacer } from "@artsy/palette"
import { ArtistList_artists } from "__generated__/ArtistList_artists.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { PlaceholderBox, PlaceholderText } from "lib/utils/placeholders"
import { chunk } from "lodash"
import React, { useRef } from "react"
import { FlatList, ScrollView, TouchableHighlight } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtistListProps {
  artists: ArtistList_artists
  isLoading?: boolean
}

export const ArtistList: React.FC<ArtistListProps> = ({ artists, isLoading }) => {
  if (isLoading) {
    return <ArtistListPlaceholder />
  }

  const chunksOfArtists = chunk(artists, 4)

  return (
    <Box px={2}>
      <Box>
        <Sans size="4">Artists in-demand on Artsy</Sans>

        <Spacer mb={2} />

        <ScrollView horizontal>
          <FlatList
            horizontal
            ItemSeparatorComponent={() => <Spacer mr={3} />}
            data={chunksOfArtists}
            initialNumToRender={2}
            renderItem={({ item }) => (
              <Flex>
                <Join separator={<Spacer mb={2} />}>
                  {item.map((artist, index) => {
                    return <ArtistItem artist={artist} key={artist.name || index} />
                  })}
                </Join>
              </Flex>
            )}
            keyExtractor={(_item, index) => String(index)}
          />
        </ScrollView>
      </Box>
    </Box>
  )
}

export const ArtistListFragmentContainer = createFragmentContainer(ArtistList, {
  artists: graphql`
    fragment ArtistList_artists on Artist @relay(plural: true) {
      name
      href
      image {
        cropped(width: 76, height: 70) {
          url
          width
          height
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

const ArtistItem: React.FC<{ artist: ArtistList_artists[0] }> = ({ artist }) => {
  const navRef = useRef<any>()
  const imageUrl = artist.image?.cropped?.url
  const tracking = useTracking()

  const handlePress = () => {
    if (artist.href) {
      tracking.trackEvent(tappedEntityGroup(trackingArgs))
      SwitchBoard.presentNavigationViewController(navRef.current, artist.href)
    }
  }

  return (
    <TouchableHighlight underlayColor={color("white100")} activeOpacity={0.8} onPress={handlePress} ref={navRef}>
      <Box width="270">
        <EntityHeader name={artist.name || ""} imageUrl={imageUrl || undefined} />
      </Box>
    </TouchableHighlight>
  )
}

const ArtistListPlaceholder: React.FC = () => {
  return (
    <Box px={2}>
      <Box>
        <PlaceholderText width={250} />

        <Spacer mb={2} />

        <Flex flexDirection="row">
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
    </Box>
  )
}
