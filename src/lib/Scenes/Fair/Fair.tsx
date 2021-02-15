import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Fair_fair } from "__generated__/Fair_fair.graphql"
import { FairQuery } from "__generated__/FairQuery.graphql"
import { AnimatedArtworkFilterButton, FilterModalMode, FilterModalNavigator } from "lib/Components/FilterModal"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { ArtworkFilterContext, ArtworkFilterGlobalStateProvider } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { hideBackButtonOnScroll } from "lib/utils/hideBackButtonOnScroll"
import { PlaceholderBox, PlaceholderGrid, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Flex, Separator, Spacer, Theme } from "palette"
import React, { useCallback, useRef, useState } from "react"
import { FlatList, View, ViewToken } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { FairArtworksFragmentContainer } from "./Components/FairArtworks"
import { FairCollectionsFragmentContainer } from "./Components/FairCollections"
import { FairEditorialFragmentContainer } from "./Components/FairEditorial"
import { FairEmptyStateFragmentContainer } from "./Components/FairEmptyState"
import { FairExhibitorsFragmentContainer } from "./Components/FairExhibitors"
import { FairFollowedArtistsRailFragmentContainer } from "./Components/FairFollowedArtistsRail"
import { FairHeaderFragmentContainer } from "./Components/FairHeader"
import { Tabs, TabsType } from "./Components/SimpleTabs"

interface FairQueryRendererProps {
  fairID: string
}

interface FairProps {
  fair: Fair_fair
}

interface ViewableItems {
  viewableItems?: ViewToken[]
}

const tabs: TabsType = [
  {
    label: "Exhibitors",
  },
  {
    label: "Artworks",
  },
]

export const Fair: React.FC<FairProps> = ({ fair }) => {
  const { isActive } = fair
  const hasArticles = !!fair.articles?.edges?.length
  const hasCollections = !!fair.marketingCollections.length
  const hasArtworks = !!(fair.counts?.artworks ?? 0 > 0)
  const hasExhibitors = !!(fair.counts?.partnerShows ?? 0 > 0)
  const hasFollowedArtistArtworks = !!(fair.followedArtistArtworks?.edges?.length ?? 0 > 0)

  const tracking = useTracking()
  const [activeTab, setActiveTab] = useState(0)

  const flatListRef = useRef<FlatList>(null)
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)
  const [isArtworksGridVisible, setArtworksGridVisible] = useState(false)

  const sections = isActive
    ? [
        "fairHeader",
        ...(hasArticles ? ["fairEditorial"] : []),
        ...(hasCollections ? ["fairCollections"] : []),
        ...(hasFollowedArtistArtworks ? ["fairFollowedArtistsRail"] : []),
        ...(hasArtworks && hasExhibitors ? ["fairTabs", "fairTabChildContent"] : []),
      ]
    : ["fairHeader", ...(hasArticles ? ["fairEditorial"] : []), "notActive"]

  const tabIndex = sections.indexOf("fairTabs")

  const { safeAreaInsets } = useScreenDimensions()

  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 30 })

  const viewableItemsChangedRef = React.useRef(({ viewableItems }: ViewableItems) => {
    const artworksItem = (viewableItems! ?? []).find((viewableItem: ViewToken) => {
      return viewableItem?.item === "fairTabChildContent"
    })
    setArtworksGridVisible(artworksItem?.isViewable ?? false)
  })

  /*
  This function is necessary to achieve the effect whereby the sticky tab
  has the necessary top-padding to avoid the status bar at the top of the screen,
  BUT does not appear to have that padding when rendered within the list.
  We achieve that by applying a negative bottom margin to the component
  directly above the tabs, and applying the same top margin to the tab component.

  The tricky thing is to make sure the top component is on top of the tabs margin!
  This was only possible by using the `CellRendererComponent` prop on FlatList.

  See https://github.com/facebook/react-native/issues/28751 for more information!
  */
  const cellItemRenderer = useCallback(({ index, item, children, ...props }) => {
    let zIndex

    // These zIndex values are finicky/important. We found that 11 and 20 worked.
    if (index < tabIndex) {
      zIndex = 11
    } else if (index === tabIndex) {
      zIndex = 20
    }
    return (
      <View
        {...props}
        key={`${item}`}
        style={{
          zIndex,
          marginBottom: index === tabIndex - 1 ? -safeAreaInsets.top : undefined,
        }}
      >
        {children}
      </View>
    )
  }, [])

  const handleFilterArtworksModal = () => {
    setFilterArtworkModalVisible(!isFilterArtworksModalVisible)
  }

  const trackTappedNavigationTab = (destinationTab: number) => {
    const trackTappedArtworkTabProps = {
      action: ActionType.tappedNavigationTab,
      context_screen_owner_type: OwnerType.fair,
      context_screen_owner_id: fair.internalID,
      context_screen_owner_slug: fair.slug,
      context_module: ContextModule.exhibitorsTab,
      subject: "Artworks",
    }
    const trackTappedExhibitorsTabProps = {
      action: ActionType.tappedNavigationTab,
      context_screen_owner_type: OwnerType.fair,
      context_screen_owner_id: fair.internalID,
      context_screen_owner_slug: fair.slug,
      context_module: ContextModule.artworksTab,
      subject: "Exhibitors",
    }

    if (activeTab !== destinationTab) {
      if (tabs[destinationTab].label === "Artworks") {
        tracking.trackEvent(trackTappedArtworkTabProps)
      } else {
        tracking.trackEvent(trackTappedExhibitorsTabProps)
      }
    }
  }

  const openFilterArtworksModal = () => {
    tracking.trackEvent({
      action_name: "filter",
      context_screen_owner_type: Schema.OwnerEntityTypes.Fair,
      context_screen: Schema.PageNames.FairPage,
      context_screen_owner_id: fair.internalID,
      context_screen_owner_slug: fair.slug,
      action_type: Schema.ActionTypes.Tap,
    })
    handleFilterArtworksModal()
  }

  const closeFilterArtworksModal = () => {
    tracking.trackEvent({
      action_name: "closeFilterWindow",
      context_screen_owner_type: Schema.OwnerEntityTypes.Fair,
      context_screen: Schema.PageNames.FairPage,
      context_screen_owner_id: fair.internalID,
      context_screen_owner_slug: fair.slug,
      action_type: Schema.ActionTypes.Tap,
    })
    handleFilterArtworksModal()
  }

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.FairPage,
        context_screen_owner_type: Schema.OwnerEntityTypes.Fair,
        context_screen_owner_id: fair.internalID,
        context_screen_owner_slug: fair.slug,
      }}
    >
      <ArtworkFilterGlobalStateProvider>
        <ArtworkFilterContext.Consumer>
          {() => (
            <Theme>
              <>
                <FlatList
                  data={sections}
                  ref={flatListRef}
                  viewabilityConfig={viewConfigRef.current}
                  onViewableItemsChanged={viewableItemsChangedRef.current}
                  ItemSeparatorComponent={() => <Spacer mb="3" />}
                  ListFooterComponent={<Spacer mb="3" />}
                  keyExtractor={(_item, index) => String(index)}
                  stickyHeaderIndices={[tabIndex]}
                  onScroll={hideBackButtonOnScroll}
                  scrollEventThrottle={100}
                  // @ts-ignore
                  CellRendererComponent={cellItemRenderer}
                  renderItem={({ item }): null | any => {
                    switch (item) {
                      case "fairHeader": {
                        return (
                          <>
                            <FairHeaderFragmentContainer fair={fair} />
                            <Separator mt="3" />
                          </>
                        )
                      }
                      case "notActive": {
                        return <FairEmptyStateFragmentContainer fair={fair} />
                      }
                      case "fairFollowedArtistsRail": {
                        return <FairFollowedArtistsRailFragmentContainer fair={fair} />
                      }
                      case "fairEditorial": {
                        return <FairEditorialFragmentContainer fair={fair} />
                      }
                      case "fairCollections": {
                        return <FairCollectionsFragmentContainer fair={fair} />
                      }
                      case "fairTabs": {
                        return (
                          <Box paddingTop={safeAreaInsets.top} backgroundColor="white">
                            <Tabs
                              setActiveTab={(index) => {
                                trackTappedNavigationTab(index as number)
                                setActiveTab(index)
                              }}
                              activeTab={activeTab}
                              tabs={tabs}
                            />
                          </Box>
                        )
                      }
                      case "fairTabChildContent": {
                        const tabToShow = tabs ? tabs[activeTab] : null

                        if (!tabToShow) {
                          return null
                        }

                        if (tabToShow.label === "Exhibitors") {
                          return <FairExhibitorsFragmentContainer fair={fair} />
                        }

                        if (tabToShow.label === "Artworks") {
                          return (
                            <Box px="2">
                              <FairArtworksFragmentContainer fair={fair} />
                              <FilterModalNavigator
                                isFilterArtworksModalVisible={isFilterArtworksModalVisible}
                                id={fair.internalID}
                                slug={fair.slug}
                                mode={FilterModalMode.Fair}
                                exitModal={handleFilterArtworksModal}
                                closeModal={closeFilterArtworksModal}
                              />
                            </Box>
                          )
                        }
                      }
                    }
                  }}
                />
                <AnimatedArtworkFilterButton
                  isVisible={isArtworksGridVisible && tabs[activeTab] && tabs[activeTab].label === "Artworks"}
                  onPress={openFilterArtworksModal}
                />
              </>
            </Theme>
          )}
        </ArtworkFilterContext.Consumer>
      </ArtworkFilterGlobalStateProvider>
    </ProvideScreenTracking>
  )
}

export const FairFragmentContainer = createFragmentContainer(Fair, {
  fair: graphql`
    fragment Fair_fair on Fair {
      internalID
      slug
      isActive
      articles: articlesConnection(first: 5, sort: PUBLISHED_AT_DESC) {
        edges {
          __typename
        }
      }
      marketingCollections(size: 5) {
        __typename
      }
      counts {
        artworks
        partnerShows
      }
      followedArtistArtworks: filterArtworksConnection(includeArtworksByFollowedArtists: true, first: 20) {
        edges {
          __typename
        }
      }
      ...FairHeader_fair
      ...FairEmptyState_fair
      ...FairEditorial_fair
      ...FairCollections_fair
      ...FairArtworks_fair
      ...FairExhibitors_fair
      ...FairFollowedArtistsRail_fair
    }
  `,
})

export const FairQueryRenderer: React.FC<FairQueryRendererProps> = ({ fairID }) => {
  return (
    <QueryRenderer<FairQuery>
      environment={defaultEnvironment}
      query={graphql`
        query FairQuery($fairID: String!) {
          fair(id: $fairID) @principalField {
            ...Fair_fair
          }
        }
      `}
      variables={{ fairID }}
      render={renderWithPlaceholder({
        Container: FairFragmentContainer,
        renderPlaceholder: () => <FairPlaceholder />,
      })}
    />
  )
}

export const FairPlaceholder: React.FC = () => (
  <Flex>
    <PlaceholderBox height={400} />
    <Flex flexDirection="row" justifyContent="space-between" alignItems="center" px="2">
      <Flex>
        <Spacer mb="2" />
        {/* Fair name */}
        <PlaceholderText width={220} />
        {/* Fair info */}
        <PlaceholderText width={190} />
        <PlaceholderText width={190} />
      </Flex>
    </Flex>
    <Spacer mb="2" />
    <Separator />
    <Spacer mb="2" />
    {/* masonry grid */}
    <PlaceholderGrid />
  </Flex>
)
