import {
  Flex,
  Screen,
  Spacer,
  SpacingUnitDSValueNumber,
  Spinner,
  Text,
} from "@artsy/palette-mobile"
import { HomeViewQuery } from "__generated__/HomeViewQuery.graphql"
import { HomeViewSectionsConnection_viewer$key } from "__generated__/HomeViewSectionsConnection_viewer.graphql"
import { HomeHeader } from "app/Scenes/HomeView/Components/HomeHeader"
import { Section } from "app/Scenes/HomeView/Sections/Section"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { useBottomTabsScrollToTop } from "app/utils/bottomTabsHelper"
import { extractNodes } from "app/utils/extractNodes"
import { Suspense, useState } from "react"
import { RefreshControl } from "react-native"
import { fetchQuery, graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

const SECTION_SEPARATOR_HEIGHT: SpacingUnitDSValueNumber = 6
const NUMBER_OF_SECTIONS_TO_LOAD = 10

export const HomeView: React.FC = () => {
  const queryData = useLazyLoadQuery<HomeViewQuery>(homeViewScreenQuery, {
    count: NUMBER_OF_SECTIONS_TO_LOAD,
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { data, loadNext, hasNext } = usePaginationFragment<
    HomeViewQuery,
    HomeViewSectionsConnection_viewer$key
  >(sectionsFragment, queryData.viewer)

  const flatlistRef = useBottomTabsScrollToTop("home")

  const sections = extractNodes(data?.homeView.sectionsConnection)

  const handleRefresh = () => {
    if (isRefreshing) return

    setIsRefreshing(true)

    fetchQuery(getRelayEnvironment(), homeViewScreenQuery, {
      count: NUMBER_OF_SECTIONS_TO_LOAD,
    }).subscribe({
      complete: () => {
        setIsRefreshing(false)
      },
      error: (error: Error) => {
        setIsRefreshing(false)
        console.error(error)
      },
    })
  }

  return (
    <Screen safeArea={false}>
      <Screen.Body fullwidth>
        <Screen.FlatList
          innerRef={flatlistRef}
          data={sections}
          keyExtractor={(item) => `${item.internalID || ""}`}
          renderItem={({ item }) => {
            return <Section section={item} />
          }}
          ItemSeparatorComponent={SectionSeparator}
          onEndReached={() => loadNext(10)}
          ListHeaderComponent={<HomeHeader />}
          ListFooterComponent={
            hasNext ? (
              <Flex width="100%" justifyContent="center" alignItems="center" height={200}>
                <Spinner />
              </Flex>
            ) : null
          }
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        />
      </Screen.Body>
    </Screen>
  )
}

const SectionSeparator = () => <Spacer y={SECTION_SEPARATOR_HEIGHT} />

export const HomeViewScreen: React.FC = () => (
  <Suspense
    fallback={
      <Flex flex={1} justifyContent="center" alignItems="center" testID="new-home-view-skeleton">
        <Text>Loading home view…</Text>
      </Flex>
    }
  >
    <HomeView />
  </Suspense>
)

const sectionsFragment = graphql`
  fragment HomeViewSectionsConnection_viewer on Viewer
  @argumentDefinitions(count: { type: "Int" }, cursor: { type: "String" })
  @refetchable(queryName: "HomeView_homeViewRefetch") {
    homeView {
      sectionsConnection(first: $count, after: $cursor)
        @connection(key: "HomeView_sectionsConnection") {
        edges {
          node {
            __typename
            ... on HomeViewSectionGeneric {
              internalID
              component {
                type
              }
              ...HomeViewSectionGeneric_section
            }
            ... on HomeViewSectionActivity {
              internalID
              ...HomeViewSectionActivity_section
            }
            ... on HomeViewSectionArticles {
              internalID
              ...HomeViewSectionArticles_section
              ...HomeViewSectionArticlesCards_section
            }
            ... on HomeViewSectionArtworks {
              internalID
              ...HomeViewSectionArtworks_section
              ...HomeViewSectionFeaturedCollection_section
            }
            ... on HomeViewSectionArtists {
              internalID
              ...HomeViewSectionArtists_section
            }
            ... on HomeViewSectionAuctionResults {
              internalID
              ...HomeViewSectionAuctionResults_section
            }
            ... on HomeViewSectionHeroUnits {
              internalID
              ...HomeViewSectionHeroUnits_section
            }
            ... on HomeViewSectionFairs {
              internalID
              ...HomeViewSectionFairs_section
            }
            ... on HomeViewSectionMarketingCollections {
              internalID
              ...HomeViewSectionMarketingCollections_section
            }
            ... on HomeViewSectionShows {
              internalID
              ...HomeViewSectionShows_section
            }
            ... on HomeViewSectionViewingRooms {
              internalID
              ...HomeViewSectionViewingRooms_section
            }
            ... on HomeViewSectionSales {
              internalID
              ...HomeViewSectionSales_section
            }
            ... on HomeViewSectionGalleries {
              internalID
              ...HomeViewSectionGalleries_section
            }
          }
        }
      }
    }
  }
`

export const homeViewScreenQuery = graphql`
  query HomeViewQuery($count: Int!, $cursor: String) {
    viewer {
      ...HomeViewSectionsConnection_viewer @arguments(count: $count, cursor: $cursor)
    }
  }
`
