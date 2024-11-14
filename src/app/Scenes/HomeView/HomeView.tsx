import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Screen, Spinner } from "@artsy/palette-mobile"
import { useFocusEffect } from "@react-navigation/native"
import { HomeViewFetchMeQuery } from "__generated__/HomeViewFetchMeQuery.graphql"
import { HomeViewQuery } from "__generated__/HomeViewQuery.graphql"
import { HomeViewSectionsConnection_viewer$key } from "__generated__/HomeViewSectionsConnection_viewer.graphql"
import { SearchQuery } from "__generated__/SearchQuery.graphql"
import { useDismissSavedArtwork } from "app/Components/ProgressiveOnboarding/useDismissSavedArtwork"
import { useEnableProgressiveOnboarding } from "app/Components/ProgressiveOnboarding/useEnableProgressiveOnboarding"
import { RetryErrorBoundary, useRetryErrorBoundaryContext } from "app/Components/RetryErrorBoundary"
import { EmailConfirmationBannerFragmentContainer } from "app/Scenes/Home/Components/EmailConfirmationBanner"
import { HomeHeader } from "app/Scenes/HomeView/Components/HomeHeader"
import { HomeViewStore, HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { Section } from "app/Scenes/HomeView/Sections/Section"
import { useHomeViewExperimentTracking } from "app/Scenes/HomeView/hooks/useHomeViewExperimentTracking"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { searchQueryDefaultVariables } from "app/Scenes/Search/Search"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { useBottomTabsScrollToTop } from "app/utils/bottomTabsHelper"
import { useExperimentVariant } from "app/utils/experiments/hooks"
import { extractNodes } from "app/utils/extractNodes"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { usePrefetch } from "app/utils/queryPrefetching"
import { requestPushNotificationsPermission } from "app/utils/requestPushNotificationsPermission"
import { useMaybePromptForReview } from "app/utils/useMaybePromptForReview"
import { RefObject, Suspense, useCallback, useEffect, useState } from "react"
import { FlatList, RefreshControl } from "react-native"
import { fetchQuery, graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

export const NUMBER_OF_SECTIONS_TO_LOAD = 10

export const homeViewScreenQueryVariables = () => ({
  count: NUMBER_OF_SECTIONS_TO_LOAD,
})

export const HomeView: React.FC = () => {
  const flashlistRef = useBottomTabsScrollToTop("home")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { fetchKey } = useRetryErrorBoundaryContext()

  const queryData = useLazyLoadQuery<HomeViewQuery>(
    homeViewScreenQuery,
    homeViewScreenQueryVariables(),
    {
      networkCacheConfig: {
        force: false,
      },
      fetchKey,
    }
  )

  const trackedSectionTypes = HomeViewStore.useStoreState((state) => state.trackedSectionTypes)

  const { trackExperiment } = useExperimentVariant("onyx_artwork-card-save-and-follow-cta-redesign")

  useEffect(() => {
    if (trackedSectionTypes.includes("HomeViewSectionArtworks")) {
      trackExperiment()
    }
  }, [trackedSectionTypes.includes("HomeViewSectionArtworks")])

  const { data, loadNext, hasNext } = usePaginationFragment<
    HomeViewQuery,
    HomeViewSectionsConnection_viewer$key
  >(sectionsFragment, queryData.viewer)

  const [savedArtworksCount, setSavedArtworksCount] = useState(0)

  useDismissSavedArtwork(savedArtworksCount > 0)
  useEnableProgressiveOnboarding()
  const prefetchUrl = usePrefetch()
  const tracking = useHomeViewTracking()
  useHomeViewExperimentTracking(queryData.homeView?.experiments)

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

  const fetchSavedArtworksCount = async () => {
    fetchQuery<HomeViewFetchMeQuery>(
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
    ).subscribe({
      error: (error: any) => {
        console.error("Unable to fetch saved artworks count.", error)
      },
      next: (data) => {
        setSavedArtworksCount(data?.me?.counts?.savedArtworks || 0)
      },
    })
  }

  useEffect(() => {
    fetchSavedArtworksCount()
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
    <Screen safeArea={true}>
      <Screen.Body fullwidth>
        <FlatList
          showsVerticalScrollIndicator={false}
          ref={flashlistRef as RefObject<FlatList>}
          data={sections}
          keyExtractor={(item) => item.internalID}
          renderItem={({ item, index }) => {
            return <Section section={item} my={2} index={index} />
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
          onEndReachedThreshold={2}
        />
        {!!data?.me && <EmailConfirmationBannerFragmentContainer me={data.me} />}
      </Screen.Body>
    </Screen>
  )
}

const HomeViewScreenPlaceholder: React.FC = () => {
  return (
    <ProvidePlaceholderContext>
      <Screen safeArea={true}>
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
      <RetryErrorBoundary trackErrorBoundary={false}>
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

    me {
      ...EmailConfirmationBanner_me
    }
  }
`

export const homeViewScreenQuery = graphql`
  query HomeViewQuery($count: Int!, $cursor: String) {
    homeView {
      experiments {
        name
        variant
        enabled
      }
    }
    viewer {
      ...HomeViewSectionsConnection_viewer @arguments(count: $count, cursor: $cursor)
    }
  }
`
