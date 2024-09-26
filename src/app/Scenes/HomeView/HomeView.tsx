import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Screen, Spinner } from "@artsy/palette-mobile"
import { useFocusEffect } from "@react-navigation/native"
import { HomeViewFetchMeQuery } from "__generated__/HomeViewFetchMeQuery.graphql"
import { HomeViewQuery } from "__generated__/HomeViewQuery.graphql"
import { HomeViewSectionsConnection_viewer$key } from "__generated__/HomeViewSectionsConnection_viewer.graphql"
import { SearchQuery } from "__generated__/SearchQuery.graphql"
import { useDismissSavedArtwork } from "app/Components/ProgressiveOnboarding/useDismissSavedArtwork"
import { useEnableProgressiveOnboarding } from "app/Components/ProgressiveOnboarding/useEnableProgressiveOnboarding"
import { RetryErrorBoundary } from "app/Components/RetryErrorBoundary"
import { HomeHeader } from "app/Scenes/HomeView/Components/HomeHeader"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { Section } from "app/Scenes/HomeView/Sections/Section"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { searchQueryDefaultVariables } from "app/Scenes/Search/Search"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { useBottomTabsScrollToTop } from "app/utils/bottomTabsHelper"
import { extractNodes } from "app/utils/extractNodes"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { usePrefetch } from "app/utils/queryPrefetching"
import { requestPushNotificationsPermission } from "app/utils/requestPushNotificationsPermission"
import { useMaybePromptForReview } from "app/utils/useMaybePromptForReview"
import { Suspense, useCallback, useEffect, useState } from "react"
import { FlatList, RefreshControl } from "react-native"
import { fetchQuery, graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

export const NUMBER_OF_SECTIONS_TO_LOAD = 5
// Hard coding the value here because 30px is not a valid value for the spacing unit
// and we need it to be consistent with 60px spacing between sections
export const HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT = "30px"

export const homeViewScreenQueryVariables = () => ({
  count: NUMBER_OF_SECTIONS_TO_LOAD,
})

export const HomeView: React.FC = () => {
  const flashlistRef = useBottomTabsScrollToTop("home")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const queryData = useLazyLoadQuery<HomeViewQuery>(
    homeViewScreenQuery,
    homeViewScreenQueryVariables(),
    {
      networkCacheConfig: {
        force: false,
      },
    }
  )

  const { data, loadNext, hasNext } = usePaginationFragment<
    HomeViewQuery,
    HomeViewSectionsConnection_viewer$key
  >(sectionsFragment, queryData.viewer)

  const [savedArtworksCount, setSavedArtworksCount] = useState(0)

  useDismissSavedArtwork(savedArtworksCount > 0)
  useEnableProgressiveOnboarding()
  const prefetchUrl = usePrefetch()
  const tracking = useHomeViewTracking()

  useMaybePromptForReview({ contextModule: ContextModule.tabBar, contextOwnerType: OwnerType.home })

  const sections = extractNodes(data?.homeView.sectionsConnection)

  useEffect(() => {
    prefetchUrl<SearchQuery>("search", searchQueryDefaultVariables)
    prefetchUrl("my-profile")
    prefetchUrl("inbox")
    prefetchUrl("sell")
  }, [])

  useEffect(() => {
    requestPushNotificationsPermission()
  }, [])

  useFocusEffect(
    useCallback(() => {
      tracking.screen(OwnerType.home)
    }, [])
  )

  useEffect(() => {
    const fetchMe = async () => {
      const result = await fetchQuery<HomeViewFetchMeQuery>(
        getRelayEnvironment(),
        graphql`
          query HomeViewFetchMeQuery {
            me {
              counts {
                savedArtworks
              }
            }
          }
        `,
        {}
      ).toPromise()

      return result?.me
    }

    fetchMe().then((me) => {
      if (me?.counts?.savedArtworks) {
        setSavedArtworksCount(me?.counts?.savedArtworks)
      }
    })
  }, [])

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
        <FlatList
          ref={flashlistRef}
          data={sections}
          keyExtractor={(item) => item.internalID}
          renderItem={({ item, index }) => {
            return <Section section={item} my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT} index={index} />
          }}
          onEndReached={() => loadNext(NUMBER_OF_SECTIONS_TO_LOAD)}
          ListHeaderComponent={HomeHeader}
          ListFooterComponent={
            hasNext ? (
              <Flex width="100%" justifyContent="center" alignItems="center" height={200}>
                <Spinner />
              </Flex>
            ) : null
          }
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
          onEndReachedThreshold={1}
        />
      </Screen.Body>
    </Screen>
  )
}

const HomeViewScreenPlaceholder: React.FC = () => {
  return (
    <ProvidePlaceholderContext>
      <Screen safeArea={false}>
        <Screen.Body fullwidth>
          <Flex testID="new-home-view-skeleton">
            <HomeHeader />
          </Flex>
        </Screen.Body>
      </Screen>
    </ProvidePlaceholderContext>
  )
}

export const HomeViewScreen: React.FC = () => {
  return (
    <HomeViewStoreProvider>
      <RetryErrorBoundary>
        <Suspense fallback={<HomeViewScreenPlaceholder />}>
          <HomeView />
        </Suspense>
      </RetryErrorBoundary>
    </HomeViewStoreProvider>
  )
}

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
            internalID
            component {
              title
              type
            }
            ...HomeViewSectionGeneric_section
          }
        }
      }
    }
  }
`

export const homeViewScreenQuery = graphql`
  query HomeViewQuery($count: Int!, $cursor: String) @cacheable {
    viewer {
      ...HomeViewSectionsConnection_viewer @arguments(count: $count, cursor: $cursor)
    }
  }
`
