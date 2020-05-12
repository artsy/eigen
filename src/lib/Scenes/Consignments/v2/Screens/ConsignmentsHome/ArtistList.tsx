import { Box, color, Flex, Join, Sans, Spacer } from "@artsy/palette"
import { ArtistList_artists } from "__generated__/ArtistList_artists.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { chunk } from "lodash"
import React, { useRef } from "react"
import { FlatList, TouchableHighlight } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtistListProps {
  artists: ArtistList_artists
}

export const ArtistList: React.FC<ArtistListProps> = ({ artists }) => {
  const chunksOfArtists = chunk(artists, 3)

  return (
    <FlatList
      horizontal
      ItemSeparatorComponent={() => <Spacer mr={3} />}
      data={chunksOfArtists}
      initialNumToRender={2}
      renderItem={({ item }) => <StackOfArtists artists={item} />}
      keyExtractor={(_item, index) => String(index)}
    />
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

const StackOfArtists: React.FC<{ artists: Array<ArtistList_artists[0]> }> = ({ artists }) => {
  return (
    <Flex>
      <Join separator={<Spacer mb={2} />}>
        {artists.map((artist, index) => {
          return <ArtistItem artist={artist} key={artist.name || index} />
        })}
      </Join>
    </Flex>
  )
}

const ArtistItem: React.FC<{ artist: ArtistList_artists[0] }> = ({ artist }) => {
  const navRef = useRef<any>()
  const imageUrl = artist.image?.cropped?.url
  const width = artist.image?.cropped?.width || 76
  const height = artist.image?.cropped?.height || 70

  const handlePress = () => {
    if (artist.href) {
      SwitchBoard.presentNavigationViewController(navRef.current, artist.href)
    }
  }

  return (
    <TouchableHighlight underlayColor={color("white100")} activeOpacity={0.8} onPress={handlePress} ref={navRef}>
      <Flex flexDirection="row" alignItems="center" width="300">
        <Box width={76} height={70} mr={1}>
          {imageUrl && <OpaqueImageView width={width} height={height} imageURL={imageUrl} useRawURL />}
        </Box>
        <Sans size="4">{artist.name}</Sans>
      </Flex>
    </TouchableHighlight>
  )
}

const top20Artists = {
  "4d8d120c876c697ae1000046": "Alex Katz",
  "4dd1584de0091e000100207c": "Banksy",
  "4d8b926a4eb68a1b2c0000ae": "Damien Hirst",
  "4d8b92854eb68a1b2c0001b6": "David Hockney",
  "4de3c41f7a22e70001002b13": "David Shrigley",
  "4d8b92774eb68a1b2c000138": "Ed Ruscha",
  "4d9e1a143c86c538060000a4": "Eddie Martinez",
  "548c89017261695fe5210500": "Genieve Figgis",
  "4e97537ca200000001002237": "Harland Miller",
  "4d8b92904eb68a1b2c00022e": "Invader",
  "506b332d4466170002000489": "Katherine Bernhardt",
  "4e934002e340fa0001005336": "KAWS",
  "4ed901b755a41e0001000a9f": "Kehinde Wiley",
  "4e975df46ba7120001001fe2": "Mr. Brainwash",
  "4f5f64c13b555230ac000004": "Nina Chanel Abney",
  "4d8b92734eb68a1b2c00010c": "Roy Lichtenstein",
  "4d9b330cff9a375c2f0031a8": "Sterling Ruby",
  "551bcaa77261692b6f181400": "Stik",
  "4d8b92bb4eb68a1b2c000452": "Takashi Murakami",
  "4ef3c0ee9f1ce1000100022f": "Tomoo Gokita",
}

export const top20ArtistIDs = Object.keys(top20Artists)
