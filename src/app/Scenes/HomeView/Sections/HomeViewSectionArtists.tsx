import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import {
  Flex,
  FlexProps,
  Join,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Spinner,
} from "@artsy/palette-mobile"
import { HomeViewSectionArtistsMainQuery } from "__generated__/HomeViewSectionArtistsMainQuery.graphql"
import { HomeViewSectionArtists_section$data } from "__generated__/HomeViewSectionArtists_section.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import {
  ARTIST_CARD_WIDTH,
  IMAGE_MAX_HEIGHT as ARTIST_RAIL_IMAGE_MAX_HEIGHT,
  ArtistCardContainer,
} from "app/Scenes/HomeView/Components/ArtistRails/ArtistCard"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { useMemoizedRandom } from "app/utils/placeholders"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { times } from "lodash"
import { memo } from "react"
import { ScrollView } from "react-native"
import {
  createPaginationContainer,
  graphql,
  RelayPaginationProp,
  useLazyLoadQuery,
} from "react-relay"

interface HomeViewSectionArtistsProps {
  section: HomeViewSectionArtists_section$data
  relay: RelayPaginationProp
  index: number
}

type Artist = ExtractNodeType<HomeViewSectionArtists_section$data["artistsConnection"]>

export const HomeViewSectionArtists: React.FC<HomeViewSectionArtistsProps & FlexProps> = memo(
  ({ section, index, ...flexProps }) => {
    const tracking = useHomeViewTracking()
    const viewAll = section.component?.behaviors?.viewAll

    if (!section.artistsConnection?.totalCount) {
      return null
    }

    const artists = extractNodes(section.artistsConnection)

    const onSectionViewAll = () => {
      if (viewAll?.href) {
        tracking.tappedArticleGroupViewAll(
          section.contextModule as ContextModule,
          viewAll?.ownerType as ScreenOwnerType
        )
      }
    }

    // TODO: Still not performant, look into bringing back useCallback

    return (
      <Flex {...flexProps}>
        <Flex px={2}>
          <SectionTitle
            href={viewAll?.href}
            title={section.component?.title}
            onPress={viewAll ? onSectionViewAll : undefined}
          />
        </Flex>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        >
          {artists.map((artist, idx) => (
            <Flex key={(artist as Artist).internalID} mr={2}>
              <ArtistCardContainer
                artist={artist as Artist}
                showDefaultFollowButton
                onPress={() => {
                  tracking.tappedArtistGroup(
                    (artist as Artist).internalID,
                    (artist as Artist).slug,
                    section.contextModule as ContextModule,
                    idx
                  )
                }}
              />
            </Flex>
          ))}

          {/* Simple spacer at end instead of ListFooterComponent */}
          <Flex
            width={ARTIST_CARD_WIDTH / 2}
            height={ARTIST_RAIL_IMAGE_MAX_HEIGHT}
            justifyContent="center"
            alignItems="center"
          >
            <Spinner />
          </Flex>
        </ScrollView>

        <HomeViewSectionSentinel
          contextModule={section.contextModule as ContextModule}
          index={index}
        />
      </Flex>
    )
  }
)

export const HomeViewSectionArtistsPaginationContainer = createPaginationContainer(
  HomeViewSectionArtists,
  {
    section: graphql`
      fragment HomeViewSectionArtists_section on HomeViewSectionArtists
      @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        internalID
        contextModule
        component {
          title
          behaviors {
            viewAll {
              href
              ownerType
            }
          }
        }
        ownerType

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

const homeViewSectionArtistsQuery = graphql`
  query HomeViewSectionArtistsMainQuery($id: String!) {
    homeView {
      section(id: $id) {
        ...HomeViewSectionArtists_section
      }
    }
  }
`

const HomeViewSectionArtistsPlaceholder: React.FC<FlexProps> = (flexProps) => {
  const randomValue = useMemoizedRandom()
  return (
    <Skeleton>
      <Flex {...flexProps}>
        <Flex mx={2}>
          <SkeletonText variant="sm-display">Recommended Artists</SkeletonText>
          <Spacer y={2} />

          <Flex flexDirection="row">
            <Join separator={<Spacer x="15px" />}>
              {times(3 + randomValue * 10).map((index) => (
                <Flex key={index}>
                  <SkeletonBox
                    key={index}
                    height={ARTIST_RAIL_IMAGE_MAX_HEIGHT}
                    width={ARTIST_CARD_WIDTH}
                  />
                  <Spacer y={1} />

                  <SkeletonText variant="xs" mb={0.5}>
                    Andy Warhol
                  </SkeletonText>
                  <SkeletonText variant="xs">Nationality, b 1023</SkeletonText>
                </Flex>
              ))}
            </Join>
          </Flex>
        </Flex>
      </Flex>
    </Skeleton>
  )
}

export const HomeViewSectionArtistsQueryRenderer: React.FC<SectionSharedProps> = memo(
  withSuspense({
    Component: ({ sectionID, index, ...flexProps }) => {
      const data = useLazyLoadQuery<HomeViewSectionArtistsMainQuery>(homeViewSectionArtistsQuery, {
        id: sectionID,
      })

      if (!data.homeView.section) {
        return null
      }

      return (
        <HomeViewSectionArtistsPaginationContainer
          section={data.homeView.section}
          index={index}
          {...flexProps}
        />
      )
    },
    LoadingFallback: HomeViewSectionArtistsPlaceholder,
    ErrorFallback: NoFallback,
  })
)
