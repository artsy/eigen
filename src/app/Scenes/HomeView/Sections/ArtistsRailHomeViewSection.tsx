import { Flex, Spacer, Spinner } from "@artsy/palette-mobile"
import { ArtistsRailHomeViewSection_section$data } from "__generated__/ArtistsRailHomeViewSection_section.graphql"
import {
  IMAGE_MAX_HEIGHT as ARTIST_RAIL_IMAGE_MAX_HEIGHT,
  ArtistCardContainer,
} from "app/Components/Home/ArtistRails/ArtistCard"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import { PAGE_SIZE } from "app/Components/constants"
import { extractNodes } from "app/utils/extractNodes"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

interface ArtworksRailHomeViewSectionProps {
  section: ArtistsRailHomeViewSection_section$data
  relay: RelayPaginationProp
}

type Artist = ExtractNodeType<ArtistsRailHomeViewSection_section$data["artistsConnection"]>
export const ArtistsRailHomeViewSection: React.FC<ArtworksRailHomeViewSectionProps> = ({
  section,
  relay,
}) => {
  const { hasMore, isLoading, loadMore } = relay

  const title = section.component?.title

  const onEndReached = () => {
    if (!hasMore() && !isLoading()) {
      return
    }

    loadMore(PAGE_SIZE, (error) => {
      if (error) {
        console.error(error.message)
      }
    })
  }

  if (section.artistsConnection?.totalCount === 0) {
    return null
  }

  const artists = extractNodes(section.artistsConnection)

  return (
    <Flex>
      <Flex px={2}>
        <SectionTitle title={title} />
      </Flex>
      <CardRailFlatList<Artist>
        data={artists}
        keyExtractor={(artist) => artist.internalID}
        onEndReached={onEndReached}
        ItemSeparatorComponent={() => <Spacer x={1} />}
        ListFooterComponent={() => {
          if (hasMore() && isLoading()) {
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

export const ArtistsRailHomeViewSectionPaginationContainer = createPaginationContainer(
  ArtistsRailHomeViewSection,
  {
    section: graphql`
      fragment ArtistsRailHomeViewSection_section on ArtistsRailHomeViewSection
      @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        id
        internalID
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
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.section.artistsConnection
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        id: _props.section.internalID,
        cursor,
        count,
      }
    },
    query: graphql`
      query ArtistsRailHomeViewSectionQuery($cursor: String, $count: Int!, $id: String!) {
        homeView {
          section(id: $id) {
            ...ArtistsRailHomeViewSection_section @arguments(cursor: $cursor, count: $count)
          }
        }
      }
    `,
  }
)
