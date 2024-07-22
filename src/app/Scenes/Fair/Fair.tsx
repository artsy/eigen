import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Box, Flex, Screen, Separator, ShareIcon, Spacer } from "@artsy/palette-mobile"
import { FairQuery } from "__generated__/FairQuery.graphql"
import { Fair_fair$data } from "__generated__/Fair_fair.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { HeaderArtworksFilterWithTotalArtworks as HeaderArtworksFilter } from "app/Components/HeaderArtworksFilter/HeaderArtworksFilterWithTotalArtworks"
import { NavigationalTabs, TabsType } from "app/Components/LegacyTabs"
import { getShareURL } from "app/Components/ShareSheet/helpers"
import { useToast } from "app/Components/Toast/toastHook"
import { goBack } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { compact } from "lodash"
import React, { useState } from "react"
import { TouchableOpacity } from "react-native"
import RNShare from "react-native-share"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
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

type SectionT =
  | "fairHeader"
  | "fairTabsAndFilter"
  | "fairTabChildContent"
  | "fairCollections"
  | "fairFollowedArtistsRail"
  | "fairEditorial"
  | "notActive"

export const Fair: React.FC<FairProps> = ({ fair }) => {
  const { isActive } = fair
  const hasArticles = !!fair.articles?.edges?.length
  const hasCollections = !!fair.marketingCollections.length
  const hasArtworks = !!(fair.counts?.artworks ?? 0 > 0)
  const hasExhibitors = !!(fair.counts?.partnerShows ?? 0 > 0)
  const hasFollowedArtistArtworks = !!(fair.followedArtistArtworks?.edges?.length ?? 0 > 0)

  const { show: showToast } = useToast()

  const tracking = useTracking()
  const [activeTab, setActiveTab] = useState(0)

  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)

  const sections = isActive
    ? ([
        "fairHeader",
        ...(hasArticles ? ["fairEditorial"] : []),
        ...(hasCollections ? ["fairCollections"] : []),
        ...(hasFollowedArtistArtworks ? ["fairFollowedArtistsRail"] : []),
        ...(hasArtworks && hasExhibitors ? ["fairTabsAndFilter", "fairTabChildContent"] : []),
      ] as SectionT[])
    : (["fairHeader", ...(hasArticles ? ["fairEditorial"] : []), "notActive"] as SectionT[])

  const stickyIndex = sections.indexOf("fairTabsAndFilter")

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

  const handleSharePress = async () => {
    try {
      const url = getShareURL(`/fair/${fair.slug}?utm_content=fair-share`)
      const message = `View ${fair.name} on Artsy`

      await RNShare.open({
        title: fair.name || "",
        message: message + "\n" + url,
        failOnCancel: true,
      })
      showToast("Copied to Clipboard", "middle", { Icon: ShareIcon })
    } catch (error) {
      if (typeof error === "string" && error.includes("User did not share")) {
        console.error("Collection.tsx", error)
      }
    }
  }

  const fairHasExhibitors = extractNodes(fair._exhibitors).length > 0

  const tabs: TabsType = compact([
    fairHasExhibitors && {
      label: "Exhibitors",
    },
    {
      label: "Artworks",
    },
  ])

  return (
    <Screen>
      <Screen.Header
        title={fair.name || ""}
        onBack={goBack}
        rightElements={
          <TouchableOpacity
            onPress={() => {
              handleSharePress()
            }}
          >
            <ShareIcon width={24} height={24} />
          </TouchableOpacity>
        }
      />
      <ProvideScreenTracking
        info={{
          context_screen: Schema.PageNames.FairPage,
          context_screen_owner_type: Schema.OwnerEntityTypes.Fair,
          context_screen_owner_id: fair.internalID,
          context_screen_owner_slug: fair.slug,
        }}
      >
        <ArtworkFiltersStoreProvider>
          <Screen.FlatList
            data={sections}
            ItemSeparatorComponent={() => <Spacer y={4} />}
            ListFooterComponent={<Spacer y={4} />}
            keyExtractor={(_item, index) => String(index)}
            stickyHeaderIndices={[stickyIndex]}
            scrollEventThrottle={100}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }): null | any => {
              switch (item) {
                case "fairHeader": {
                  return (
                    <Flex>
                      <FairHeaderFragmentContainer fair={fair} />
                    </Flex>
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
                    <Box backgroundColor="white">
                      {tabs.length === 2 && (
                        <NavigationalTabs
                          onTabPress={(_, index) => {
                            trackTappedNavigationTab(index as number)
                            setActiveTab(index)
                          }}
                          activeTab={activeTab}
                          tabs={tabs}
                        />
                      )}

                      {tabToShow?.label === "Artworks" && (
                        <Flex mb={-4}>
                          <HeaderArtworksFilter
                            onPress={openFilterArtworksModal}
                            hideArtworksCount
                          />
                          <Separator borderColor="black30" />
                        </Flex>
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
      </ProvideScreenTracking>
    </Screen>
  )
}

export const FairFragmentContainer = createFragmentContainer(Fair, {
  fair: graphql`
    fragment Fair_fair on Fair {
      internalID
      slug
      name
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
      # Used to figure out if we should render the exhibitors tab
      _exhibitors: showsConnection(first: 1, sort: FEATURED_ASC) {
        edges {
          node {
            id
            counts {
              artworks
            }
            ...FairExhibitorRail_show
          }
        }
      }
      ...FairFollowedArtistsRail_fair
    }
  `,
})

export const FairQueryRenderer: React.FC<FairQueryRendererProps> = ({ fairID }) => {
  return (
    <QueryRenderer<FairQuery>
      environment={getRelayEnvironment()}
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
    <Flex flexDirection="row" justifyContent="space-between" alignItems="center" px={2}>
      <Flex>
        <Spacer y={2} />
        {/* Fair name */}
        <PlaceholderText width={220} />
        {/* Fair info */}
        <PlaceholderText width={190} />
        <PlaceholderText width={190} />
      </Flex>
    </Flex>
    <Spacer y={2} />
    <Separator />
    <Spacer y={2} />
    {/* masonry grid */}
    <PlaceholderGrid />
  </Flex>
)
