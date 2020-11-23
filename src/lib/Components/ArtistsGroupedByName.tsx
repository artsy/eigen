import { ArtistListItem_artist } from "__generated__/ArtistListItem_artist.graphql"
import { ArtistListItemContainer as ArtistListItem } from "lib/Components/ArtistListItem"
import { hideBackButtonOnScroll } from "lib/utils/hideBackButtonOnScroll"
import { Box, Sans, Separator, Serif } from "palette"
import React from "react"
import { SectionList } from "react-native"

interface Props {
  Component?: any
  data: Array<{
    data: ArtistListItem_artist[]
    letter: string
    index: number
  }>
  onEndReached?: () => void
}

export const ArtistsGroupedByName: React.FC<Props> = ({ data, onEndReached }) => (
  <SectionList
    windowSize={6}
    onEndReached={onEndReached}
    onEndReachedThreshold={3}
    renderItem={({ item }) => (
      <Box px={2} mb={2}>
        <ArtistListItem artist={item as any /* STRICTNESS_MIGRATION */} />
      </Box>
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
        <Sans size="4" weight="medium">
          {letter}
        </Sans>
      </Box>
    )}
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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
    keyExtractor={(_, index) => index.toString()}
    onScroll={hideBackButtonOnScroll}
    scrollEventThrottle={100}
  />
)
