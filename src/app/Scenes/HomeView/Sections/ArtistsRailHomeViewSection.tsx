import { Flex, Spacer, Spinner } from "@artsy/palette-mobile"
import {
  ArtistsRailHomeViewSection_section$data,
  ArtistsRailHomeViewSection_section$key,
} from "__generated__/ArtistsRailHomeViewSection_section.graphql"
import {
  IMAGE_MAX_HEIGHT as ARTIST_RAIL_IMAGE_MAX_HEIGHT,
  ArtistCardContainer,
} from "app/Components/Home/ArtistRails/ArtistCard"
import { CardRailFlatList, INTER_CARD_PADDING } from "app/Components/Home/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import { extractNodes } from "app/utils/extractNodes"
import { ExtractNodeType } from "app/utils/relayHelpers"
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

  const onEndReached = () => {
    if (!!hasNext && !isLoadingNext) {
      loadNext?.(1)
    }
  }

  if (data.artistsConnection?.totalCount === 0) {
    return null
  }

  const artists = extractNodes(data.artistsConnection)

  return (
    <Flex>
      <Flex pl={2} pr={2}>
        <SectionTitle title={title} />
      </Flex>
      <CardRailFlatList<Artist>
        data={artists}
        keyExtractor={(artist) => artist.internalID}
        onEndReached={onEndReached}
        ItemSeparatorComponent={() => <Spacer x={`${INTER_CARD_PADDING}px`} />}
        ListFooterComponent={() => {
          if (hasNext && isLoadingNext) {
            return (
              <Flex
                width={ARTIST_RAIL_IMAGE_MAX_HEIGHT / 2}
                height={ARTIST_RAIL_IMAGE_MAX_HEIGHT}
                justifyContent="center"
                alignItems="center"
              >
                <Spinner />
              </Flex>
            )
          }

          return null
        }}
        renderItem={({ item: artist }) => {
          return <ArtistCardContainer artist={artist} showDefaultFollowButton />
        }}
      />
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
