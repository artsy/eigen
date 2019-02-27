import { Box, Sans, Separator, Serif } from "@artsy/palette"
import { ArtistListItem_artist } from "__generated__/ArtistListItem_artist.graphql"
import { ArtistListItemContainer as ArtistListItem } from "lib/Components/ArtistListItem"
import React from "react"
import { SectionList, TouchableWithoutFeedback } from "react-native"

interface Props {
  Component?: any
  data: Array<{
    data: ArtistListItem_artist[]
    letter: string
    index: number
  }>
  onEndReached?: () => void
  viewArtist: (context: any, artist: string, id?: string, _id?: string) => void
}

export const ArtistsGroupedByName: React.SFC<Props> = ({ data, onEndReached, Component, viewArtist }) => (
  <SectionList
    onEndReached={onEndReached}
    renderItem={({ item }) => (
      <TouchableWithoutFeedback
        onPress={() => {
          return viewArtist(Component, item.href, item.id, item._id)
        }}
      >
        <Box px={2} mb={2}>
          <ArtistListItem artist={item} />
        </Box>
      </TouchableWithoutFeedback>
    )}
    ListHeaderComponent={() => {
      return (
        <Box px={2} mb={2} pt={85}>
          <Serif size="8">Artists</Serif>
        </Box>
      )
    }}
    renderSectionHeader={({ section: { letter } }) => (
      <Box px={2} mb={2}>
        <Sans size="4">{letter}</Sans>
      </Box>
    )}
    renderSectionFooter={({ section }) => {
      if (section.index < data.length - 1) {
        return (
          <Box px={2} pb={2}>
            <Separator />
          </Box>
        )
      }
    }}
    sections={data}
    keyExtractor={item => item.__id}
  />
)
