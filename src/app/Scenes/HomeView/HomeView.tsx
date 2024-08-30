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
import { extractNodes } from "app/utils/extractNodes"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

const SECTION_SEPARATOR_HEIGHT: SpacingUnitDSValueNumber = 6

export const HomeView: React.FC = () => {
  const queryData = useLazyLoadQuery<HomeViewQuery>(homeViewScreenQuery, {
    count: 10,
  })

  const { data, loadNext, hasNext } = usePaginationFragment<
    HomeViewQuery,
    HomeViewSectionsConnection_viewer$key
  >(sectionsFragment, queryData.viewer)

  const sections = extractNodes(data?.homeView.sectionsConnection)

  return (
    <Screen safeArea={false}>
      <Screen.Body fullwidth>
        <Screen.FlatList
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
            ... on GenericHomeViewSection {
              internalID
              component {
                type
              }
              ...GenericHomeViewSection_section
            }
            ... on ActivityHomeViewSection {
              internalID
              ...ActivityHomeViewSection_section
            }
            ... on ArticlesHomeViewSection {
              internalID
              ...ArticlesHomeViewSection_section
              ...ArticlesCardsHomeViewSection_section
            }
            ... on ArtworksHomeViewSection {
              internalID
              ...ArtworksHomeViewSection_section
              ...FeaturedCollectionHomeViewSection_section
            }
            ... on ArtistsHomeViewSection {
              internalID
              ...ArtistsHomeViewSection_section
            }
            ... on AuctionResultsHomeViewSection {
              internalID
              ...AuctionResultsHomeViewSection_section
            }
            ... on HeroUnitsHomeViewSection {
              internalID
              ...HeroUnitsHomeViewSection_section
            }
            ... on FairsHomeViewSection {
              internalID
              ...FairsHomeViewSection_section
            }
            ... on MarketingCollectionsHomeViewSection {
              internalID
              ...MarketingCollectionsHomeViewSection_section
            }
            ... on ShowsHomeViewSection {
              internalID
              ...ShowsHomeViewSection_section
            }
            ... on ViewingRoomsHomeViewSection {
              internalID
              ...ViewingRoomsHomeViewSection_section
            }
            ... on SalesHomeViewSection {
              internalID
              ...SalesHomeViewSection_section
            }
            ... on GalleriesHomeViewSection {
              internalID
              ...GalleriesHomeViewSection_section
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
