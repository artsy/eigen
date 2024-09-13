import { Flex, Spacer, Spinner } from "@artsy/palette-mobile"
import { HomeViewSectionArtists_section$data } from "__generated__/HomeViewSectionArtists_section.graphql"
import {
  IMAGE_MAX_HEIGHT as ARTIST_RAIL_IMAGE_MAX_HEIGHT,
  ArtistCardContainer,
} from "app/Components/Home/ArtistRails/ArtistCard"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import { PAGE_SIZE } from "app/Components/constants"
import { HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT } from "app/Scenes/HomeView/HomeView"
import {
  HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT,
  HORIZONTAL_FLATLIST_WINDOW_SIZE,
} from "app/Scenes/HomeView/helpers/constants"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { isTablet } from "react-native-device-info"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

interface HomeViewSectionArtworksProps {
  section: HomeViewSectionArtists_section$data
  relay: RelayPaginationProp
}

type Artist = ExtractNodeType<HomeViewSectionArtists_section$data["artistsConnection"]>
export const HomeViewSectionArtists: React.FC<HomeViewSectionArtworksProps> = ({
  section,
  relay,
}) => {
  const { hasMore, isLoading, loadMore } = relay
  const tracking = useHomeViewTracking()

  const title = section.component?.title
  const componentHref = section.component?.behaviors?.viewAll?.href

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

  if (!section.artistsConnection?.totalCount) {
    return null
  }

  const artists = extractNodes(section.artistsConnection)

  return (
    <Flex my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>
      <Flex px={2}>
        <SectionTitle
          title={title}
          onPress={
            componentHref
              ? () => {
                  navigate(componentHref)
                }
              : undefined
          }
        />
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
        renderItem={({ item: artist, index }) => {
          return (
            <ArtistCardContainer
              artist={artist}
              showDefaultFollowButton
              onPress={() => {
                tracking.tappedArtistGroup(
                  artist.internalID,
                  artist.slug,
                  section.internalID,
                  index
                )
              }}
            />
          )
        }}
        initialNumToRender={isTablet() ? 10 : HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT}
        windowSize={HORIZONTAL_FLATLIST_WINDOW_SIZE}
      />
    </Flex>
  )
}

export const HomeViewSectionArtistsPaginationContainer = createPaginationContainer(
  HomeViewSectionArtists,
  {
    section: graphql`
      fragment HomeViewSectionArtists_section on HomeViewSectionArtists
      @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        id
        internalID
        component {
          title
          behaviors {
            viewAll {
              href
            }
          }
        }
        artistsConnection(after: $cursor, first: $count)
          @connection(key: "HomeViewSectionArtists_artistsConnection") {
          totalCount
          edges {
            node {
              internalID
              slug
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
      query HomeViewSectionArtistsQuery($cursor: String, $count: Int!, $id: String!) {
        homeView {
          section(id: $id) {
            ...HomeViewSectionArtists_section @arguments(cursor: $cursor, count: $count)
          }
        }
      }
    `,
  }
)
