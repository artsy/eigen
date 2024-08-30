import { Flex, Screen, Spacer, Spinner, Text } from "@artsy/palette-mobile"
import { HomeViewQuery } from "__generated__/HomeViewQuery.graphql"
import {
  HomeViewSectionsConnection_viewer$data,
  HomeViewSectionsConnection_viewer$key,
} from "__generated__/HomeViewSectionsConnection_viewer.graphql"
import { Section } from "app/Scenes/HomeView/Sections/Section"
import { isSectionEmpty } from "app/Scenes/HomeView/utils/isSectionEmpty"
import { useRailViewedTracking } from "app/Scenes/HomeView/utils/useRailViewedTracking"
import { extractNodes } from "app/utils/extractNodes"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

export type SectionT = ExtractNodeType<
  HomeViewSectionsConnection_viewer$data["homeView"]["sectionsConnection"]
>

export const HomeView: React.FC = () => {
  const queryData = useLazyLoadQuery<HomeViewQuery>(homeViewScreenQuery, {
    count: 5,
  })

  const { data, loadNext, hasNext } = usePaginationFragment<
    HomeViewQuery,
    HomeViewSectionsConnection_viewer$key
  >(sectionsFragment, queryData.viewer)

  const sections = extractNodes(data?.homeView.sectionsConnection)

  const { viewabilityConfig, onViewableItemsChanged } = useRailViewedTracking({
    keyExtractor: (section) => section.internalID,
    filterSection: isSectionEmpty,
  })

  return (
    <Screen>
      <Screen.Body fullwidth>
        <Screen.FlatList
          data={sections}
          keyExtractor={(item) => `${item.internalID || ""}`}
          renderItem={({ item }) => {
            return <Section section={item} />
          }}
          ItemSeparatorComponent={() => <Spacer y={2} />}
          onEndReached={() => loadNext(10)}
          ListFooterComponent={
            hasNext ? (
              <Flex width="100%" justifyContent="center" alignItems="center" height={200}>
                <Spinner />
              </Flex>
            ) : null
          }
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
        />
      </Screen.Body>
    </Screen>
  )
}

export const HomeViewScreen: React.FC = () => (
  <Suspense
    fallback={
      <Flex flex={1} justifyContent="center" alignItems="center">
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
            ... on ActivityRailHomeViewSection {
              internalID
              _notificationsConnection: notificationsConnection {
                totalCount
              }
              ...ActivityRailHomeViewSection_section
            }
            ... on ArticlesRailHomeViewSection {
              internalID
              _articlesRailConnection: articlesConnection {
                totalCount
              }
              ...ArticlesRailHomeViewSection_section
              ...ArticlesCardsHomeViewSection_section
            }
            ... on ArtworksRailHomeViewSection {
              internalID
              _artworksConnection: artworksConnection {
                totalCount
              }
              ...ArtworksRailHomeViewSection_section
              ...FeaturedCollectionHomeViewSection_section
            }
            ... on ArtistsRailHomeViewSection {
              internalID
              _artistsConnection: artistsConnection {
                totalCount
              }
              ...ArtistsRailHomeViewSection_section
            }
            ... on AuctionResultsRailHomeViewSection {
              internalID
              _auctionResultsConnection: auctionResultsConnection {
                totalCount
              }
              ...AuctionResultsRailHomeViewSection_section
            }
            ... on HeroUnitsHomeViewSection {
              internalID
              _heroUnitsConnection: heroUnitsConnection {
                totalCount
              }
              ...HeroUnitsRailHomeViewSection_section
            }
            ... on FairsRailHomeViewSection {
              internalID
              _fairsConnection: fairsConnection {
                totalCount
              }
              ...FairsRailHomeViewSection_section
            }
            ... on MarketingCollectionsRailHomeViewSection {
              internalID
              _marketingCollectionsConnection: marketingCollectionsConnection {
                totalCount
              }
              ...MarketingCollectionsRailHomeViewSection_section
            }
            ... on ShowsRailHomeViewSection {
              internalID
              ...ShowsRailHomeViewSection_section
            }
            ... on ViewingRoomsRailHomeViewSection {
              internalID
              ...ViewingRoomsRailHomeViewSection_section
            }
            ... on SalesRailHomeViewSection {
              internalID
              _salesConnection: salesConnection {
                totalCount
              }
              ...SalesRailHomeViewSection_section
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
