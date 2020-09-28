import { Fair2_fair } from "__generated__/Fair2_fair.graphql"
import { Fair2Query } from "__generated__/Fair2Query.graphql"
import { AnimatedArtworkFilterButton } from "lib/Components/FilterModal"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { ArtworkFilterContext, ArtworkFilterGlobalStateProvider } from "lib/utils/ArtworkFiltersStore"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Box, Separator, Spacer, Theme } from "palette"
import React, { useRef, useState } from "react"
import { FlatList, ViewToken } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { Fair2ArtworksFragmentContainer } from "./Components/Fair2Artworks"
import { Fair2CollectionsFragmentContainer } from "./Components/Fair2Collections"
import { Fair2EditorialFragmentContainer } from "./Components/Fair2Editorial"
import { Fair2ExhibitorsFragmentContainer } from "./Components/Fair2Exhibitors"
import { Fair2HeaderFragmentContainer } from "./Components/Fair2Header"
import { TabChildContent, Tabs, TabsType } from "./Components/SimpleTabs"

interface Fair2QueryRendererProps {
  fairID: string
}

interface Fair2Props {
  fair: Fair2_fair
}

interface ViewableItems {
  viewableItems?: ViewToken[]
}

export const Fair2: React.FC<Fair2Props> = ({ fair }) => {
  const hasArticles = !!fair.articles?.edges?.length
  const hasCollections = !!fair.marketingCollections.length
  const hasArtworks = !!(fair.counts?.artworks ?? 0 > 0)
  const hasExhibitors = !!(fair.counts?.partnerShows ?? 0 > 0)

  const [activeTab, setActiveTab] = useState(0)
  const tabs: TabsType = [
    {
      label: "Exhibitors",
      component: <Fair2ExhibitorsFragmentContainer fair={fair} />,
    },
    {
      label: "Artworks",
      component: (
        <Box px="15px">
          <Fair2ArtworksFragmentContainer fair={fair} />
        </Box>
      ),
    },
  ]

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
                      return <TabChildContent activeTab={activeTab} tabs={tabs} />
                    }
                  }
                }}
              />
              <AnimatedArtworkFilterButton
                isVisible={isArtworksGridVisible && tabs[activeTab] && tabs[activeTab].label === "Artworks"}
                count={context.state.appliedFilters.length}
                onPress={handleFilterArtworksModal}
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
