import { Flex, Spinner } from "@artsy/palette-mobile"
import {
  ArtistsRailHomeViewSection_section$data,
  ArtistsRailHomeViewSection_section$key,
} from "__generated__/ArtistsRailHomeViewSection_section.graphql"
import { ArtistCardContainer, IMAGE_MAX_HEIGHT } from "app/Components/Home/ArtistRails/ArtistCard"
import { CARD_WIDTH } from "app/Components/Home/CardRailCard"
import { CardRailFlatList, INTER_CARD_PADDING } from "app/Components/Home/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import { extractNodes } from "app/utils/extractNodes"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { useCallback } from "react"
import { View } from "react-native"
import { graphql, usePaginationFragment } from "react-relay"

interface ArtworksRailHomeViewSectionProps {
  section: ArtistsRailHomeViewSection_section$key
}

type Artist = ExtractNodeType<ArtistsRailHomeViewSection_section$data["artistsConnection"]>
export const ArtistsRailHomeViewSection: React.FC<ArtworksRailHomeViewSectionProps> = ({
  section,
}) => {
  const { data, hasNext, loadNext, isLoadingNext } = usePaginationFragment(artistsFragment, section)

  const title = data.component?.title

  const onEndReached = useCallback(() => {
    if (!!hasNext && !isLoadingNext) {
      loadNext?.(1)
    }
  }, [hasNext, isLoadingNext, loadNext])

  if (data.artistsConnection?.totalCount === 0) return null

  const artists = extractNodes(data.artistsConnection)

  return (
    <Flex>
      <View>
        <Flex pl={2} pr={2}>
          <SectionTitle title={title} />
        </Flex>
        <CardRailFlatList<Artist>
          data={artists}
          keyExtractor={(artist) => artist.internalID}
          // I noticed that sometimes FlatList seemed to get confused about where cards should be
          // and making this explicit fixes that.
          getItemLayout={(_data, index) => ({
            index,
            offset: index * (CARD_WIDTH + INTER_CARD_PADDING),
            length: CARD_WIDTH + INTER_CARD_PADDING,
          })}
          onEndReached={onEndReached}
          ListFooterComponent={() => {
            if (!!hasNext && isLoadingNext) {
              return (
                <Flex
                  width={IMAGE_MAX_HEIGHT / 2}
                  height={IMAGE_MAX_HEIGHT}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Spinner />
                </Flex>
              )
            }
            return null
          }}
          renderItem={({ item: artist, index }) => {
            return (
              <View style={{ flexDirection: "row" }}>
                <ArtistCardContainer
                  artist={artist}
                  // onFollow={() => followOrUnfollowArtist(artist)}
                />
                {index === artists.length - 1 ? null : (
                  <View style={{ width: INTER_CARD_PADDING }} />
                )}
              </View>
            )
          }}
        />
      </View>
    </Flex>
  )
}

export const artistsFragment = graphql`
  fragment ArtistsRailHomeViewSection_section on ArtistsRailHomeViewSection
  @refetchable(queryName: "ArtistsRailHomeViewSection_artistsRailHomeViewSectionRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
    component {
      title
    }
    artistsConnection(after: $cursor, first: $count)
      @connection(key: "ArtistsRailHomeViewSection_artistsConnection") {
      totalCount
      edges {
        node {
          internalID
          ...ArtistCard_artist
        }
      }
    }
  }
`
