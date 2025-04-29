import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Screen, Spinner } from "@artsy/palette-mobile"
import { PortalHost } from "@gorhom/portal"
import { useFocusEffect } from "@react-navigation/native"
import * as Sentry from "@sentry/react-native"
import { HomeViewFetchMeQuery } from "__generated__/HomeViewFetchMeQuery.graphql"
import { HomeViewQuery } from "__generated__/HomeViewQuery.graphql"
import { HomeViewSectionsConnection_viewer$key } from "__generated__/HomeViewSectionsConnection_viewer.graphql"
import { SearchQuery } from "__generated__/SearchQuery.graphql"
import { useDismissSavedArtwork } from "app/Components/ProgressiveOnboarding/useDismissSavedArtwork"
import { useEnableProgressiveOnboarding } from "app/Components/ProgressiveOnboarding/useEnableProgressiveOnboarding"
import { RetryErrorBoundary, useRetryErrorBoundaryContext } from "app/Components/RetryErrorBoundary"
import { EmailConfirmationBannerFragmentContainer } from "app/Scenes/HomeView/Components/EmailConfirmationBanner"
import { HomeHeader } from "app/Scenes/HomeView/Components/HomeHeader"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { Section } from "app/Scenes/HomeView/Sections/Section"
import { useDarkModeOnboarding } from "app/Scenes/HomeView/hooks/useDarkModeOnboarding"
import { useHomeViewExperimentTracking } from "app/Scenes/HomeView/hooks/useHomeViewExperimentTracking"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { Playground } from "app/Scenes/Playground/Playground"
import { GlobalStore } from "app/store/GlobalStore"
import { useExperimentVariant } from "app/system/flags/hooks/useExperimentVariant"
import { navigate } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { useBottomTabsScrollToTop } from "app/utils/bottomTabsHelper"
import { extractNodes } from "app/utils/extractNodes"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useIsDeepLink } from "app/utils/hooks/useIsDeepLink"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { usePrefetch } from "app/utils/queryPrefetching"
import { requestPushNotificationsPermission } from "app/utils/requestPushNotificationsPermission"
import { useMaybePromptForReview } from "app/utils/useMaybePromptForReview"
import { memo, RefObject, Suspense, useCallback, useEffect, useState } from "react"
import { FlatList, Linking, RefreshControl, StatusBar } from "react-native"
import { fetchQuery, graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

export const NUMBER_OF_SECTIONS_TO_LOAD = 10

export const homeViewScreenQueryVariables = () => ({
  count: NUMBER_OF_SECTIONS_TO_LOAD,
})

export const HomeView: React.FC = memo(() => {
  const flashlistRef = useBottomTabsScrollToTop()

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

  const { trackExperiment: trackInternalTestingExperiment } = useExperimentVariant(
    "onyx_internal-testing-experiment"
  )
  const { trackExperiment: trackQuickLinksExperiment } = useExperimentVariant(
    "onyx_quick-links-experiment"
  )
  const enableNavigationPills = useFeatureFlag("AREnableHomeViewQuickLinks")

  useEffect(() => {
    trackInternalTestingExperiment()

    if (enableNavigationPills) {
      trackQuickLinksExperiment()
    }
  }, [])

  const { data, loadNext, hasNext } = usePaginationFragment<
    HomeViewQuery,
    HomeViewSectionsConnection_viewer$key
  >(sectionsFragment, queryData.viewer)

  const [savedArtworksCount, setSavedArtworksCount] = useState(0)
  const [refetchKey, setRefetchKey] = useState(0)

  useDismissSavedArtwork(savedArtworksCount > 0)
  useEnableProgressiveOnboarding()

  const prefetchUrl = usePrefetch()
  useHomeViewExperimentTracking(queryData.homeView?.experiments)
  const tracking = useHomeViewTracking()

  useMaybePromptForReview({ contextModule: ContextModule.tabBar, contextOwnerType: OwnerType.home })

  const sections = extractNodes(data?.homeView.sectionsConnection)

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      const isDeepLink = !!url
      if (!isDeepLink) {
        prefetchUrl<SearchQuery>("search")
        prefetchUrl("my-profile")
        prefetchUrl("inbox")
        prefetchUrl("infinite-discovery")
      }
    })
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
        setRefetchKey((prev) => prev + 1)
      },
      error: (error: Error) => {
        setIsRefreshing(false)
        console.error(error)
      },
    })
  }

  useDarkModeOnboarding()

  return (
    <Screen safeArea={true}>
      <Screen.Body fullwidth>
        <FlatList
          automaticallyAdjustKeyboardInsets
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ref={flashlistRef as RefObject<FlatList>}
          data={sections}
          keyExtractor={(item) => item.internalID}
          renderItem={({ item, index }) => {
            return <Section section={item} my={2} index={index} refetchKey={refetchKey} />
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
          stickyHeaderIndices={[0]}
          windowSize={15}
        />
        {!!data?.me && <EmailConfirmationBannerFragmentContainer me={data.me} />}
      </Screen.Body>
    </Screen>
  )
})

const HomeViewScreenComponent: React.FC = () => {
  const artQuizState = GlobalStore.useAppState((state) => state.onboarding.onboardingArtQuizState)
  const isNavigationReady = GlobalStore.useAppState((state) => state.sessionState.isNavigationReady)
  const theme = GlobalStore.useAppState((state) => state.devicePrefs.colorScheme)

  const showPlayground = useDevToggle("DTShowPlayground")

  const { isDeepLink } = useIsDeepLink()

  StatusBar.setBarStyle(theme === "dark" ? "light-content" : "dark-content")

  useEffect(() => {
    if (artQuizState === "incomplete" && isNavigationReady) {
      // Wait for react-navigation to start drawing the screen before navigating to ArtQuiz
      requestAnimationFrame(() => {
        navigate("/art-quiz")
      })
      return
    }
  }, [artQuizState, isNavigationReady])

  // We want to avoid rendering the home view when the user comes back from a deep link
  // Because it triggers a lot of queries that affect the user's experience and can be avoided
  if (isDeepLink !== false) {
    return null
  }

  if (artQuizState === "incomplete") {
    return null
  }

  if (showPlayground) {
    return <Playground />
  }

  return (
    <HomeViewStoreProvider>
      <RetryErrorBoundary trackErrorBoundary={false}>
        <Suspense fallback={<HomeViewScreenPlaceholder />}>
          <Sentry.TimeToInitialDisplay record>
            <HomeView />
          </Sentry.TimeToInitialDisplay>
        </Suspense>
        <PortalHost name={`${OwnerType.home}-SearchOverlay`} />
      </RetryErrorBoundary>
    </HomeViewStoreProvider>
  )
}

export const HomeViewScreen = memo(Sentry.withProfiler(HomeViewScreenComponent))

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
