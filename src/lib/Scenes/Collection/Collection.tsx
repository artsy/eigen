import { CollectionQuery } from "__generated__/CollectionQuery.graphql"
import { AnimatedArtworkFilterButton, FilterModalMode, FilterModalNavigator } from "lib/Components/FilterModal"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Box, Spacer, Theme } from "palette"
import React, { Component, createRef } from "react"
import { Dimensions, FlatList, View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { Collection_collection } from "../../../__generated__/Collection_collection.graphql"
import { CollectionArtworksFragmentContainer as CollectionArtworks } from "../../../lib/Scenes/Collection/Screens/CollectionArtworks"
import { CollectionHeaderContainer as CollectionHeader } from "../../../lib/Scenes/Collection/Screens/CollectionHeader"
import { Schema, screenTrack } from "../../../lib/utils/track"
import { ArtworkFilterContext, ArtworkFilterGlobalStateProvider } from "../../utils/ArtworkFilter/ArtworkFiltersStore"
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
    viewAreaCoveragePercentThreshold: 30, // The percentage of the artworks component should be in the screen before toggling the filter button
  }
  private flatList = createRef<FlatList<any>>()

  onViewableItemsChanged = ({ viewableItems }: ViewableItems) => {
    const artworksItem = (viewableItems! ?? []).find((viewableItem: ViewToken) => {
      return viewableItem?.item === "collectionArtworks"
    })
    this.setState((_prevState) => ({ isArtworkGridVisible: artworksItem?.isViewable ?? false }))
  }

  handleFilterArtworksModal() {
    this.setState((_prevState) => {
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

    const sections = ["collectionFeaturedArtists", "collectionHubsRails", "collectionArtworks"]

    return (
      <ArtworkFilterGlobalStateProvider>
        <ArtworkFilterContext.Consumer>
          {() => {
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
                    ItemSeparatorComponent={() => <Spacer mb="2" />}
                    renderItem={({ item }): null | any => {
                      switch (item) {
                        case "collectionFeaturedArtists":
                          return (
                            <Box px="2">
                              <CollectionFeaturedArtists collection={collection} />
                            </Box>
                          )
                        case "collectionHubsRails":
                          return isDepartment ? (
                            <CollectionHubsRails linkedCollections={linkedCollections} {...this.props} />
                          ) : null
                        case "collectionArtworks":
                          return (
                            <Box px="2">
                              <CollectionArtworks collection={collection} scrollToTop={() => this.scrollToTop()} />
                              <FilterModalNavigator
                                {...this.props}
                                isFilterArtworksModalVisible={this.state.isFilterArtworksModalVisible}
                                id={collection.id}
                                slug={collection.slug}
                                mode={FilterModalMode.Collection}
                                exitModal={this.handleFilterArtworksModal.bind(this)}
                                closeModal={this.closeFilterArtworksModal.bind(this)}
                              />
                            </Box>
                          )
                      }
                    }}
                  />
                  <AnimatedArtworkFilterButton
                    isVisible={isArtworkGridVisible}
                    onPress={this.openFilterArtworksModal.bind(this)}
                  />
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

export const CollectionQueryRenderer: React.FC<CollectionQueryRendererProps> = ({ collectionID }) => (
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
