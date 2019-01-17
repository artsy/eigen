import { Flex, Sans } from "@artsy/palette"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { TouchableOpacity } from "react-native"

export const ArtistNamesList = ({ artists, Component, viewAllArtists }) => {
  if (!artists || !artists.length) {
    return null
  }
  const artistCutoffIndex = 5
  const truncatedArtistList = artists.slice(0, artistCutoffIndex)
  const artistsToDisplay = truncatedArtistList.map((artist, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          SwitchBoard.presentNavigationViewController(Component, artist.href)
        }}
      >
        <Sans size="2" weight="medium">
          {index === truncatedArtistList.length - 1 ? artist.name : artist.name + ", "}
        </Sans>
      </TouchableOpacity>
    )
  })

  const remainderCount = artists.length - 5
  const remainingArtists = remainderCount > 0 && (
    <Flex flexDirection="row" flexWrap="wrap">
      <Sans size="2"> and </Sans>
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
  )

  return (
    <Flex flexDirection="row" flexWrap="wrap">
      <Sans size="2">Works by </Sans>
      {artistsToDisplay}
      {remainingArtists}
    </Flex>
  )
}
