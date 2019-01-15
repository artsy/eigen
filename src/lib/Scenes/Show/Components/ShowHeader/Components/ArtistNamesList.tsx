import { Flex, Sans } from "@artsy/palette"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { TouchableOpacity } from "react-native"

export const ArtistNamesList = ({ artists, component, viewAllArtists }) => {
  if (!artists || !artists.length) {
    return null
  }
  const urlMappedToArtist = {}
  const names = artists
    .map(artist => artist.name)
    .slice(0, 5)
    .join(", ")

  artists.map(artist => (urlMappedToArtist[artist.name] = artist.href)).slice(0, 5)
  const remainderCount = artists.length - 5
  const remainder =
    remainderCount > 0 ? (
      <Flex flexDirection="row" flexWrap="wrap">
        <Sans size="2">{" and "}</Sans>
        <TouchableOpacity
          onPress={() => {
            viewAllArtists()
          }}
        >
          <Sans size="2" weight="medium">
            {remainderCount + " more"}
          </Sans>
        </TouchableOpacity>
      </Flex>
    ) : null

  return (
    <Flex flexDirection="row" flexWrap="wrap">
      <Sans size="2">{"Works by "}</Sans>
      <TouchableOpacity
        onPress={() => {
          SwitchBoard.presentNavigationViewController(component, urlMappedToArtist[names])
        }}
      >
        <Sans size="2" weight="medium">
          {names}
        </Sans>
      </TouchableOpacity>
      {remainder}
    </Flex>
  )
}
