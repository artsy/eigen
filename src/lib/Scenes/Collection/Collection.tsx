import { Box, FilterIcon, Sans, Spacer, Theme } from "@artsy/palette"
import { CollectionQuery } from "__generated__/CollectionQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React, { Component, createRef } from "react"
import { Dimensions, FlatList, TouchableWithoutFeedback, View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { Collection_collection } from "../../../__generated__/Collection_collection.graphql"
import {
  FilterArtworkButton,
  FilterArtworkButtonContainer,
  FilterModalNavigator,
} from "../../../lib/Components/FilterModal"
import { CollectionArtworksFragmentContainer as CollectionArtworks } from "../../../lib/Scenes/Collection/Screens/CollectionArtworks"
import { CollectionHeaderContainer as CollectionHeader } from "../../../lib/Scenes/Collection/Screens/CollectionHeader"
import { Schema, screenTrack } from "../../../lib/utils/track"
import { ArtworkFilterContext, ArtworkFilterGlobalStateProvider } from "../../utils/ArtworkFiltersStore"
import { CollectionsHubRailsContainer as CollectionHubsRails } from "./Components/CollectionHubsRails/index"
import { CollectionFeaturedArtistsContainer as CollectionFeaturedArtists } from "./Components/FeaturedArtists"

interface ViewableItems {
  viewableItems?: ViewToken[]
}

interface ViewToken {
  item?: any
  key?: string
  index?: number | null
  isViewable?: boolean
  section?: any
}

interface CollectionProps {
  collection: Collection_collection
}

interface CollectionState {
  isArtworkGridVisible: boolean
  isFilterArtworksModalVisible: boolean
}

@screenTrack((props: CollectionProps) => ({
  context_screen: Schema.PageNames.Collection,
  context_screen_owner_slug: props.collection.slug,
  context_screen_owner_id: props.collection.id,
  context_screen_owner_type: Schema.OwnerEntityTypes.Collection,
}))
export class Collection extends Component<CollectionProps, CollectionState> {
  state = {
    isArtworkGridVisible: false,
    isFilterArtworksModalVisible: false,
  }
  viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 25, // The percentage of the artworks component should be in the screen before toggling the filter button
  }
  private flatList = createRef<FlatList<any>>()

  onViewableItemsChanged = ({ viewableItems }: ViewableItems) => {
    ;(viewableItems! ?? []).map((viewableItem: ViewToken) => {
      const artworksRenderItem = viewableItem?.item ?? ""
      const artworksRenderItemViewable = viewableItem?.isViewable || false

      if (artworksRenderItem === "collectionArtworks" && artworksRenderItemViewable) {
        return this.setState(_prevState => ({ isArtworkGridVisible: true }))
      }

      return this.setState(_prevState => ({ isArtworkGridVisible: false }))
    })
  }

  handleFilterArtworksModal() {
    this.setState(_prevState => {
      return { isFilterArtworksModalVisible: !_prevState.isFilterArtworksModalVisible }
    })
  }

  @screenTrack((props: CollectionProps) => ({
    action_name: "filter",
    context_screen_owner_type: Schema.OwnerEntityTypes.Collection,
    context_screen: Schema.PageNames.Collection,
    context_screen_owner_id: props.collection.id,
    context_screen_owner_slug: props.collection.slug,
    action_type: Schema.ActionTypes.Tap,
  }))
  openFilterArtworksModal() {
    this.handleFilterArtworksModal()
  }

  @screenTrack((props: CollectionProps) => ({
    action_name: "closeFilterWindow",
    context_screen_owner_type: Schema.OwnerEntityTypes.Collection,
    context_screen: Schema.PageNames.Collection,
    context_screen_owner_id: props.collection.id,
    context_screen_owner_slug: props.collection.slug,
    action_type: Schema.ActionTypes.Tap,
  }))
  closeFilterArtworksModal() {
    this.handleFilterArtworksModal()
  }

  scrollToTop() {
    const {
      collection: { isDepartment },
    } = this.props

    this.flatList?.current?.scrollToIndex({ animated: false, index: isDepartment ? 1 : 0 })
  }

  render() {
    const { isArtworkGridVisible } = this.state
    const { collection } = this.props
    const { linkedCollections, isDepartment } = collection

    const sections = ["collectionFeaturedArtists", "collectionHubsRails", "collectionArtworks"] as const

    return (
      <ArtworkFilterGlobalStateProvider>
        <ArtworkFilterContext.Consumer>
          {value => {
            return (
              <Theme>
                <View style={{ flex: 1 }}>
                  <FlatList
                    ref={this.flatList}
                    onViewableItemsChanged={this.onViewableItemsChanged}
                    viewabilityConfig={this.viewabilityConfig}
                    keyExtractor={(_item, index) => String(index)}
                    data={sections}
                    ListHeaderComponent={<CollectionHeader collection={this.props.collection} />}
                    ItemSeparatorComponent={() => <Spacer mb={2} />}
                    renderItem={({ item }): null | any => {
                      switch (item) {
                        case "collectionFeaturedArtists":
                          return (
                            <Box px={2}>
                              <CollectionFeaturedArtists collection={collection} />
                            </Box>
                          )
                        case "collectionHubsRails":
                          return isDepartment ? (
                            <CollectionHubsRails linkedCollections={linkedCollections} {...this.props} />
                          ) : null
                        case "collectionArtworks":
                          return (
                            <Box px={2}>
                              <CollectionArtworks collection={collection} scrollToTop={() => this.scrollToTop()} />
                              <FilterModalNavigator
                                {...this.props}
                                isFilterArtworksModalVisible={this.state.isFilterArtworksModalVisible}
                                id={collection.id}
                                slug={collection.slug}
                                exitModal={this.handleFilterArtworksModal.bind(this)}
                                closeModal={this.closeFilterArtworksModal.bind(this)}
                                trackingScreenName={Schema.PageNames.Collection}
                                trackingOwnerEntity={Schema.OwnerEntityTypes.Collection}
                              />
                            </Box>
                          )
                      }
                    }}
                  />
                  {!!isArtworkGridVisible && (
                    <FilterArtworkButtonContainer>
                      <TouchableWithoutFeedback onPress={this.openFilterArtworksModal.bind(this)}>
                        <FilterArtworkButton px="2">
                          <FilterIcon fill="white100" />
                          <Sans size="3t" pl="1" py="1" color="white100" weight="medium">
                            Filter
                          </Sans>
                          {value.state.appliedFilters.length > 0 && (
                            <>
                              <Sans size="3t" pl={0.5} py="1" color="white100" weight="medium">
                                {"\u2022"}
                              </Sans>
                              <Sans size="3t" pl={0.5} py="1" color="white100" weight="medium">
                                {value.state.appliedFilters.length}
                              </Sans>
                            </>
                          )}
                        </FilterArtworkButton>
                      </TouchableWithoutFeedback>
                    </FilterArtworkButtonContainer>
                  )}
                </View>
              </Theme>
            )
          }}
        </ArtworkFilterContext.Consumer>
      </ArtworkFilterGlobalStateProvider>
    )
  }
}

export const CollectionContainer = createFragmentContainer(Collection, {
  collection: graphql`
    fragment Collection_collection on MarketingCollection
      @argumentDefinitions(screenWidth: { type: "Int", defaultValue: 500 }) {
      id
      slug
      isDepartment
      ...CollectionHeader_collection
      ...CollectionArtworks_collection
      ...FeaturedArtists_collection
      ...CollectionHubsRails_collection

      linkedCollections {
        ...CollectionHubsRails_linkedCollections
      }
    }
  `,
})

interface CollectionQueryRendererProps {
  collectionID: string
}

export const CollectionQueryRenderer: React.SFC<CollectionQueryRendererProps> = ({ collectionID }) => (
  <QueryRenderer<CollectionQuery>
    environment={defaultEnvironment}
    query={graphql`
      query CollectionQuery($collectionID: String!, $screenWidth: Int) {
        collection: marketingCollection(slug: $collectionID) {
          ...Collection_collection @arguments(screenWidth: $screenWidth)
        }
      }
    `}
    variables={{
      collectionID,
      screenWidth: Dimensions.get("screen").width,
    }}
    cacheConfig={{
      // Bypass Relay cache on retries.
      force: true,
    }}
    render={renderWithLoadProgress(CollectionContainer)}
  />
)
