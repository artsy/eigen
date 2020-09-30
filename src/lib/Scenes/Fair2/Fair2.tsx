import { Fair2_fair } from "__generated__/Fair2_fair.graphql"
import { Fair2Query } from "__generated__/Fair2Query.graphql"
import { AnimatedArtworkFilterButton, FilterModalMode, FilterModalNavigator } from "lib/Components/FilterModal"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { ArtworkFilterContext, ArtworkFilterGlobalStateProvider } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Schema } from "lib/utils/track"
import { Box, Separator, Spacer, Theme } from "palette"
import React, { useRef, useState } from "react"
import { FlatList, ViewToken } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { Fair2ArtworksFragmentContainer } from "./Components/Fair2Artworks"
import { Fair2CollectionsFragmentContainer } from "./Components/Fair2Collections"
import { Fair2EditorialFragmentContainer } from "./Components/Fair2Editorial"
import { Fair2ExhibitorsFragmentContainer } from "./Components/Fair2Exhibitors"
import { Fair2HeaderFragmentContainer } from "./Components/Fair2Header"
import { Tabs, TabsType } from "./Components/SimpleTabs"

interface Fair2QueryRendererProps {
  fairID: string
}

interface Fair2Props {
  fair: Fair2_fair
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

export const Fair2: React.FC<Fair2Props> = ({ fair }) => {
  const hasArticles = !!fair.articles?.edges?.length
  const hasCollections = !!fair.marketingCollections.length
  const hasArtworks = !!(fair.counts?.artworks ?? 0 > 0)
  const hasExhibitors = !!(fair.counts?.partnerShows ?? 0 > 0)

  const tracking = useTracking()
  const [activeTab, setActiveTab] = useState(0)

  const flatListRef = useRef<FlatList>(null)
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)
  const [isArtworksGridVisible, setArtworksGridVisible] = useState(false)

  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 30 })

  const viewableItemsChangedRef = React.useRef(({ viewableItems }: ViewableItems) => {
    const artworksItem = (viewableItems! ?? []).find((viewableItem: ViewToken) => {
      return viewableItem?.item === "fairTabChildContent"
    })
    setArtworksGridVisible(artworksItem?.isViewable ?? false)
  })

  const handleFilterArtworksModal = () => {
    setFilterArtworkModalVisible(!isFilterArtworksModalVisible)
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

  const sections = [
    "fairHeader",
    ...(hasArticles ? ["fairEditorial"] : []),
    ...(hasCollections ? ["fairCollections"] : []),
    ...(hasArtworks && hasExhibitors ? ["fairTabs", "fairTabChildContent"] : []),
  ]

  const tabIndex = sections.indexOf("fairTabs")

  return (
    <ArtworkFilterGlobalStateProvider>
      <ArtworkFilterContext.Consumer>
        {(context) => (
          <Theme>
            <>
              <FlatList
                data={sections}
                ref={flatListRef}
                viewabilityConfig={viewConfigRef.current}
                onViewableItemsChanged={viewableItemsChangedRef.current}
                ItemSeparatorComponent={() => <Spacer mb={3} />}
                keyExtractor={(_item, index) => String(index)}
                stickyHeaderIndices={[tabIndex]}
                renderItem={({ item }): null | any => {
                  switch (item) {
                    case "fairHeader": {
                      return (
                        <>
                          <Fair2HeaderFragmentContainer fair={fair} />
                          <Separator mt={3} />
                        </>
                      )
                    }
                    case "fairEditorial": {
                      return <Fair2EditorialFragmentContainer fair={fair} />
                    }
                    case "fairCollections": {
                      return <Fair2CollectionsFragmentContainer fair={fair} />
                    }
                    case "fairTabs": {
                      return <Tabs setActiveTab={setActiveTab} activeTab={activeTab} tabs={tabs} />
                    }
                    case "fairTabChildContent": {
                      const tabToShow = tabs ? tabs[activeTab] : null

                      if (!tabToShow) {
                        return null
                      }

                      if (tabToShow.label === "Exhibitors") {
                        return <Fair2ExhibitorsFragmentContainer fair={fair} />
                      }

                      if (tabToShow.label === "Artworks") {
                        return (
                          <Box px="15px">
                            <Fair2ArtworksFragmentContainer fair={fair} />
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
                count={context.state.appliedFilters.length}
                onPress={openFilterArtworksModal}
              />
            </>
          </Theme>
        )}
      </ArtworkFilterContext.Consumer>
    </ArtworkFilterGlobalStateProvider>
  )
}

export const Fair2FragmentContainer = createFragmentContainer(Fair2, {
  fair: graphql`
    fragment Fair2_fair on Fair {
      internalID
      slug
      articles: articlesConnection(first: 5, sort: PUBLISHED_AT_DESC) {
        edges {
          __typename
        }
      }
      marketingCollections(size: 4) {
        __typename
      }
      counts {
        artworks
        partnerShows
      }
      ...Fair2Header_fair
      ...Fair2Editorial_fair
      ...Fair2Collections_fair
      ...Fair2Artworks_fair
      ...Fair2Exhibitors_fair
    }
  `,
})

export const Fair2QueryRenderer: React.FC<Fair2QueryRendererProps> = ({ fairID }) => {
  return (
    <QueryRenderer<Fair2Query>
      environment={defaultEnvironment}
      query={graphql`
        query Fair2Query($fairID: String!) {
          fair(id: $fairID) @principalField {
            ...Fair2_fair
          }
        }
      `}
      variables={{ fairID }}
      render={renderWithLoadProgress(Fair2FragmentContainer)}
    />
  )
}
