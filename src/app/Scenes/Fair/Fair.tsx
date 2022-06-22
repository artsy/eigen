import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Fair_fair$data } from "__generated__/Fair_fair.graphql"
import { FairQuery } from "__generated__/FairQuery.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { useHideBackButtonOnScroll } from "app/utils/hideBackButtonOnScroll"

import { HeaderArtworksFilterWithTotalArtworks as HeaderArtworksFilter } from "app/Components/HeaderArtworksFilter/HeaderArtworksFilterWithTotalArtworks"
import { SearchImageHeaderButton } from "app/Components/SearchImageHeaderButton"
import { PlaceholderBox, PlaceholderGrid, PlaceholderText } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { Box, Flex, Separator, Spacer } from "palette"
import { NavigationalTabs, TabsType } from "palette/elements/Tabs"
import React, { useCallback, useRef, useState } from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { useScreenDimensions } from "shared/hooks"
import { FairArtworksFragmentContainer } from "./Components/FairArtworks"
import { FairCollectionsFragmentContainer } from "./Components/FairCollections"
import { FairEditorialFragmentContainer } from "./Components/FairEditorial"
import { FairEmptyStateFragmentContainer } from "./Components/FairEmptyState"
import { FairExhibitorsFragmentContainer } from "./Components/FairExhibitors"
import { FairFollowedArtistsRailFragmentContainer } from "./Components/FairFollowedArtistsRail"
import { FairHeaderFragmentContainer } from "./Components/FairHeader"

interface FairQueryRendererProps {
  fairID: string
}

interface FairProps {
  fair: Fair_fair$data
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
  const { isActive, isReverseImageSearchEnabled } = fair
  const shouldShowImageSearchButton = isReverseImageSearchEnabled && !!isActive
  const hasArticles = !!fair.articles?.edges?.length
  const hasCollections = !!fair.marketingCollections.length
  const hasArtworks = !!(fair.counts?.artworks ?? 0 > 0)
  const hasExhibitors = !!(fair.counts?.partnerShows ?? 0 > 0)
  const hasFollowedArtistArtworks = !!(fair.followedArtistArtworks?.edges?.length ?? 0 > 0)

  const tracking = useTracking()
  const [activeTab, setActiveTab] = useState(0)

  const flatListRef = useRef<FlatList>(null)
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)

  const sections = isActive
    ? [
        "fairHeader",
        ...(hasArticles ? ["fairEditorial"] : []),
        ...(hasCollections ? ["fairCollections"] : []),
        ...(hasFollowedArtistArtworks ? ["fairFollowedArtistsRail"] : []),
        ...(hasArtworks && hasExhibitors ? ["fairTabsAndFilter", "fairTabChildContent"] : []),
      ]
    : ["fairHeader", ...(hasArticles ? ["fairEditorial"] : []), "notActive"]

  const stickyIndex = sections.indexOf("fairTabsAndFilter")

  const { safeAreaInsets } = useScreenDimensions()

  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 30 })

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
    if (index < stickyIndex) {
      zIndex = 11
    } else if (index === stickyIndex) {
      zIndex = 20
    }
    return (
      <View
        {...props}
        key={`${item}`}
        style={{
          zIndex,
          marginBottom: index === stickyIndex - 1 ? -safeAreaInsets.top : undefined,
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

  const hideBackButtonOnScroll = useHideBackButtonOnScroll()

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.FairPage,
        context_screen_owner_type: Schema.OwnerEntityTypes.Fair,
        context_screen_owner_id: fair.internalID,
        context_screen_owner_slug: fair.slug,
      }}
    >
      <ArtworkFiltersStoreProvider>
        <FlatList
          data={sections}
          ref={flatListRef}
          viewabilityConfig={viewConfigRef.current}
          ItemSeparatorComponent={() => <Spacer mb={3} />}
          ListFooterComponent={<Spacer mb={3} />}
          keyExtractor={(_item, index) => String(index)}
          stickyHeaderIndices={[stickyIndex]}
          onScroll={hideBackButtonOnScroll}
          scrollEventThrottle={100}
          // @ts-ignore
          CellRendererComponent={cellItemRenderer}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }): null | any => {
            switch (item) {
              case "fairHeader": {
                return (
                  <>
                    <FairHeaderFragmentContainer fair={fair} />
                    <Separator mt={3} />
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
              case "fairTabsAndFilter": {
                const tabToShow = tabs ? tabs[activeTab] : null
                return (
                  <Box paddingTop={safeAreaInsets.top} backgroundColor="white">
                    <NavigationalTabs
                      onTabPress={(_, index) => {
                        trackTappedNavigationTab(index as number)
                        setActiveTab(index)
                      }}
                      activeTab={activeTab}
                      tabs={tabs}
                    />
                    {tabToShow?.label === "Artworks" && (
                      <HeaderArtworksFilter onPress={openFilterArtworksModal} />
                    )}
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
                    <Box px={2}>
                      <FairArtworksFragmentContainer fair={fair} />
                      <ArtworkFilterNavigator
                        visible={isFilterArtworksModalVisible}
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
      </ArtworkFiltersStoreProvider>

      <SearchImageHeaderButton isImageSearchButtonVisible={shouldShowImageSearchButton} />
    </ProvideScreenTracking>
  )
}

export const FairFragmentContainer = createFragmentContainer(Fair, {
  fair: graphql`
    fragment Fair_fair on Fair {
      internalID
      slug
      isActive
      isReverseImageSearchEnabled
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
      followedArtistArtworks: filterArtworksConnection(
        first: 20
        input: { includeArtworksByFollowedArtists: true }
      ) {
        edges {
          __typename
        }
      }
      ...FairHeader_fair
      ...FairEmptyState_fair
      ...FairEditorial_fair
      ...FairCollections_fair
      ...FairArtworks_fair @arguments(input: { sort: "-decayed_merch" })
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
        <Spacer mb={2} />
        {/* Fair name */}
        <PlaceholderText width={220} />
        {/* Fair info */}
        <PlaceholderText width={190} />
        <PlaceholderText width={190} />
      </Flex>
    </Flex>
    <Spacer mb={2} />
    <Separator />
    <Spacer mb={2} />
    {/* masonry grid */}
    <PlaceholderGrid />
  </Flex>
)
