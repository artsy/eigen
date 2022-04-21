// 1. Get first layout pass of grid view so we have a total width and calculate the column width (componentDidMount?).
// 2. Possibly do artwork column layout now, as we can do so based just on the aspect ratio, assuming the text height
//    won't be too different between artworks.
// 3. Get artwork heights by either:
//    - calculating the item size upfront with aspect ratio and a static height for the text labels.
//    - leting the artwork component do a layout pass and calculate its own height based on the column width.
// 4. Update height of grid to encompass all items.

import { ScreenOwnerType } from "@artsy/cohesion"
import { InfiniteScrollArtworksGrid_connection } from "__generated__/InfiniteScrollArtworksGrid_connection.graphql"
import { InfiniteScrollArtworksGrid_myCollectionConnection } from "__generated__/InfiniteScrollArtworksGrid_myCollectionConnection.graphql"
import { PAGE_SIZE } from "app/Components/constants"
import { MyCollectionArtworkGridItemFragmentContainer } from "app/Scenes/MyCollection/Screens/ArtworkList/MyCollectionArtworkGridItem"
import { extractNodes } from "app/utils/extractNodes"
import { isCloseToBottom } from "app/utils/isCloseToBottom"
import { Box, Button, Flex, Spinner } from "palette"
import React from "react"
import {
  ActivityIndicator,
  Dimensions,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native"
import { createFragmentContainer, RelayPaginationProp } from "react-relay"
import { graphql } from "relay-runtime"
import ParentAwareScrollView from "../ParentAwareScrollView"
import Artwork, { ArtworkProps } from "./ArtworkGridItem"

/**
 * TODO:
 * - currently all the code assumes column layout
 *   - do no invert aspect ratios in row layout
 * - deal with edge-cases when calculating in which section an artwork should go
 *   - see ARMasonryCollectionViewLayout for details on how to deal with last works sticking out
 *   - the calculation currently only takes into account the size of the image, not if e.g. the sale message is present
 */

export interface Props {
  /** The direction for the grid, currently only 'column' is supported . */
  sectionDirection?: string

  /** The arity of the number of sections (e.g. columns) to show */
  sectionCount?: number

  /** The inset margin for the whole grid */
  sectionMargin?: number

  /** The per-item margin */
  itemMargin?: number

  /** A component to render at the top of all items */
  HeaderComponent?: React.ComponentType<any> | React.ReactElement<any>

  /** A component to render at the bottom of all items */
  FooterComponent?: React.ComponentType<any> | React.ReactElement<any>

  /** Pass true if artworks should have a Box wrapper with gutter padding */
  shouldAddPadding?: boolean

  /** Defaults to true, pass false to enable fetching more artworks via pressing "Show More" button instead of on scroll */
  autoFetch?: boolean

  /** Number of items to fetch in pagination request. Default is 10 */
  pageSize?: number

  /** Parent screen where the grid is located. For analytics purposes. */
  contextScreenOwnerType?: ScreenOwnerType

  /** Id of the parent screen's entity where the grid is located. For analytics purposes. */
  contextScreenOwnerId?: string

  /** Slug of the parent screen's entity where the grid is located. For analytics purposes. */
  contextScreenOwnerSlug?: string

  /** Search query of the parent screen's entity where the grid is located. For analytics purposes. */
  contextScreenQuery?: string

  /** Name of the parent screen's entity where the grid is located. For analytics purposes. */
  contextScreen?: string

  /** An array of child indices determining which children get docked to the top of the screen when scrolling.  */
  stickyHeaderIndices?: number[]

  // Hide urgency tags (3 Days left, 1 hour left)
  hideUrgencyTags?: boolean

  // Hide Partner name
  hidePartner?: boolean

  itemComponentProps?: Partial<ArtworkProps>

  /** Show Lot Label  */
  showLotLabel?: boolean

  /** To avoid layout jank, supply the width of the grid ahead of time. */
  width?: number

  /** Allows to use MyCollectionArtworkGridItem */
  isMyCollection?: boolean

  /** Whether to use `ParentAwareScrollView` or `ScrollView`
   * (defaults to true on android, undefined on iOS )
   */
  useParentAwareScrollView?: boolean

  /** Wether to show a loading spinner (defaults to false) */
  showLoadingSpinner?: boolean

  /** Whether to add the tapped artwork to recent searches */
  updateRecentSearchesOnTap?: boolean

  localSortAndFilterArtworks?: (artworks: any[]) => any[]
}

interface PrivateProps {
  connection:
    | InfiniteScrollArtworksGrid_connection
    | InfiniteScrollArtworksGrid_myCollectionConnection
  loadMore: RelayPaginationProp["loadMore"]
  hasMore: RelayPaginationProp["hasMore"]
  isLoading?: RelayPaginationProp["isLoading"]
}

interface MapperProps extends Omit<PrivateProps, "connection"> {
  connection?: InfiniteScrollArtworksGrid_connection
  myCollectionConnection?: InfiniteScrollArtworksGrid_myCollectionConnection
}

const InfiniteScrollArtworksGridMapper: React.FC<MapperProps & Omit<Props, "isMyCollection">> = ({
  connection,
  myCollectionConnection,
  loadMore,
  hasMore,
  ...otherProps
}) => {
  const theConnectionProp = !!connection ? connection : myCollectionConnection
  type TheConnectionType<T> = T extends InfiniteScrollArtworksGrid_connection
    ? InfiniteScrollArtworksGrid_connection
    : InfiniteScrollArtworksGrid_myCollectionConnection
  const isMyCollection = !!myCollectionConnection && !connection

  if (!theConnectionProp) {
    throw new Error("No connection prop supplied to InfiniteScrollArtworksGrid")
  }
  return (
    <InfiniteScrollArtworksGrid
      loadMore={loadMore}
      hasMore={hasMore}
      connection={theConnectionProp as TheConnectionType<typeof theConnectionProp>}
      isMyCollection={isMyCollection}
      {...otherProps}
    />
  )
}

interface State {
  sectionDimension: number
  isLoading: boolean
}

export const DEFAULT_SECTION_MARGIN = 20
export const DEFAULT_ITEM_MARGIN = 20
class InfiniteScrollArtworksGrid extends React.Component<Props & PrivateProps, State> {
  static defaultProps = {
    sectionDirection: "column",
    sectionCount: Dimensions.get("window").width > 700 ? 3 : 2,
    sectionMargin: DEFAULT_SECTION_MARGIN,
    itemMargin: DEFAULT_ITEM_MARGIN,
    shouldAddPadding: false,
    autoFetch: true,
    pageSize: PAGE_SIZE,
    hidePartner: false,
    isMyCollection: false,
    useParentAwareScrollView: Platform.OS === "android",
    showLoadingSpinner: false,
    updateRecentSearchesOnTap: false,
  }

  state = {
    sectionDimension: this.getSectionDimension(this.props.width),
    isLoading: false,
  }

  fetchNextPage = () => {
    if (!this.props.hasMore() || this.state.isLoading || this.props.isLoading?.()) {
      return
    }

    this.setState({ isLoading: true })

    this.props.loadMore(this.props.pageSize!, (error) => {
      this.setState({ isLoading: false })
      if (error) {
        // FIXME: Handle error
        console.error("InfiniteScrollGrid.tsx", error.message)
      }
    })
  }

  // tslint:disable-next-line:member-ordering
  handleFetchNextPageOnScroll = isCloseToBottom(this.fetchNextPage)

  /** A simplified version of the Relay debugging logs for infinite scrolls */
  debugLog(query: string, response?: any, error?: any) {
    // tslint:disable:no-console
    if (__DEV__ && originalXMLHttpRequest !== undefined) {
      const groupName = "Infinite scroll request"
      const c: any = console
      c.groupCollapsed(groupName, "color:" + (response ? "black" : "red") + ";")
      console.log("Query:\n", query)
      if (response) {
        console.log("Response:\n", response)
      }
      console.groupEnd()
      if (error) {
        console.error("Error:\n", error)
      }
    }
    // tslint:enable:no-console
  }

  getSectionDimension(width: number | null | undefined) {
    // Setting the dimension to 1 for tests to avoid adjusting the screen width
    if (__TEST__) {
      return 1
    }

    if (width) {
      // This is the sum of all margins in between sections, so do not count to the right of last column.
      const sectionMargins = this.props.sectionMargin! * (this.props.sectionCount! - 1)
      const { shouldAddPadding } = this.props
      const artworkPadding = shouldAddPadding ? 40 : 0

      return (width - sectionMargins) / (this.props.sectionCount! - artworkPadding)
    }
    return 0
  }

  onLayout = (event: LayoutChangeEvent) => {
    this.setState({
      sectionDimension: this.getSectionDimension(event.nativeEvent.layout.width),
    })
  }

  sectionedArtworks() {
    const sectionRatioSums: number[] = []
    const artworks = extractNodes(this.props.connection)
    const sectionedArtworks: Array<typeof artworks> = []

    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    for (let i = 0; i < this.props.sectionCount; i++) {
      sectionedArtworks.push([])
      sectionRatioSums.push(0)
    }

    const preprocessedArtworks =
      (this.props.localSortAndFilterArtworks?.(artworks) as typeof artworks) ?? artworks

    preprocessedArtworks.forEach((artwork) => {
      // There are artworks without images and other ‘issues’. Like Force we’re just going to reject those for now.
      // See: https://github.com/artsy/eigen/issues/1667
      //
      // Exception: Allow artworks without images for MyCollection
      if (artwork.image || this.props.isMyCollection) {
        // Find section with lowest *inverted* aspect ratio sum, which is the shortest column.
        let lowestRatioSum = Number.MAX_VALUE // Start higher, so we always find a
        let sectionIndex: number | null = null
        for (let j = 0; j < sectionRatioSums.length; j++) {
          const ratioSum = sectionRatioSums[j]
          if (ratioSum < lowestRatioSum) {
            sectionIndex = j
            lowestRatioSum = ratioSum
          }
        }

        if (sectionIndex != null) {
          const section = sectionedArtworks[sectionIndex]
          section.push(artwork)

          // Keep track of total section aspect ratio
          const aspectRatio = artwork.image?.aspectRatio || 1 // Ensure we never divide by null/0
          // Invert the aspect ratio so that a lower value means a shorter section.
          sectionRatioSums[sectionIndex] += 1 / aspectRatio
        }
      }
    })

    return sectionedArtworks
  }

  renderSections() {
    const spacerStyle = {
      height: this.props.itemMargin,
    }

    const artworks = extractNodes(this.props.connection)
    const sectionedArtworks = this.sectionedArtworks()
    const sections: JSX.Element[] = []
    const columnCount = this.props.sectionCount ?? 0
    for (let column = 0; column < columnCount; column++) {
      const artworkComponents: JSX.Element[] = []
      for (let row = 0; row < sectionedArtworks[column].length; row++) {
        const artwork = sectionedArtworks[column][row]
        const itemIndex = row * columnCount + column
        const ItemComponent = this.props.isMyCollection
          ? MyCollectionArtworkGridItemFragmentContainer
          : Artwork

        artworkComponents.push(
          <ItemComponent
            contextScreenOwnerType={this.props.contextScreenOwnerType}
            contextScreenOwnerId={this.props.contextScreenOwnerId}
            contextScreenOwnerSlug={this.props.contextScreenOwnerSlug}
            contextScreenQuery={this.props.contextScreenQuery}
            contextScreen={this.props.contextScreen}
            artwork={artwork as any} // FIXME: Types are messed up here
            key={"artwork-" + itemIndex + "-" + artwork.id}
            hideUrgencyTags={this.props.hideUrgencyTags}
            hidePartner={this.props.hidePartner}
            showLotLabel={this.props.showLotLabel}
            itemIndex={itemIndex}
            updateRecentSearchesOnTap={this.props.updateRecentSearchesOnTap}
            {...this.props.itemComponentProps}
          />
        )
        // Setting a marginBottom on the artwork component didn’t work, so using a spacer view instead.
        if (row < artworks.length - 1) {
          artworkComponents.push(
            <View
              style={spacerStyle}
              key={"spacer-" + row + "-" + artwork.id}
              accessibilityLabel="Spacer View"
            />
          )
        }
      }

      const sectionSpecificStyle = {
        width: this.state.sectionDimension,
        marginRight: column === columnCount - 1 ? 0 : this.props.sectionMargin,
      }

      sections.push(
        <View
          style={[styles.section, sectionSpecificStyle]}
          key={column}
          accessibilityLabel={"Section " + column}
        >
          {artworkComponents}
        </View>
      )
    }
    return sections
  }

  renderHeader() {
    const HeaderComponent = this.props.HeaderComponent
    if (!HeaderComponent) {
      return null
    }

    return React.isValidElement(HeaderComponent) ? HeaderComponent : <HeaderComponent />
  }

  renderFooter() {
    const FooterComponent = this.props.FooterComponent
    if (!FooterComponent) {
      return null
    }

    return React.isValidElement(FooterComponent) ? FooterComponent : <FooterComponent />
  }

  render() {
    const artworks = this.state.sectionDimension ? this.renderSections() : null
    const { shouldAddPadding, hasMore, stickyHeaderIndices, useParentAwareScrollView } = this.props
    const boxPadding = shouldAddPadding ? 2 : 0

    const ScrollViewWrapper = !!useParentAwareScrollView ? ParentAwareScrollView : ScrollView

    return (
      <>
        <ScrollViewWrapper
          onScroll={(ev) => {
            if (this.props.autoFetch) {
              this.handleFetchNextPageOnScroll(ev)
            }
          }}
          scrollEventThrottle={50}
          onLayout={this.onLayout}
          scrollsToTop={false}
          accessibilityLabel="Artworks ScrollView"
          stickyHeaderIndices={stickyHeaderIndices}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
          {this.renderHeader()}
          <Box px={boxPadding}>
            <View style={styles.container} accessibilityLabel="Artworks Content View">
              {artworks}
            </View>
          </Box>

          {!this.props.autoFetch && !!hasMore() && (
            <Button
              mt={5}
              mb={3}
              variant="fillGray"
              size="large"
              block
              onPress={this.fetchNextPage}
              loading={this.state.isLoading}
            >
              Show more
            </Button>
          )}
          {!!this.props.showLoadingSpinner && !!this.state.isLoading && (
            <Flex mt={2} mb={4} flexDirection="row" justifyContent="center">
              <Spinner />
            </Flex>
          )}
        </ScrollViewWrapper>

        {this.state.isLoading && hasMore() && (
          <Flex
            alignItems="center"
            justifyContent="center"
            p="3"
            pb="9"
            style={{ opacity: this.state.isLoading && hasMore() ? 1 : 0 }}
          >
            {!!this.props.autoFetch && (
              <ActivityIndicator color={Platform.OS === "android" ? "black" : undefined} />
            )}
          </Flex>
        )}

        {this.renderFooter()}
      </>
    )
  }
}

interface Styles {
  container: ViewStyle
  section: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: "row",
  },
  section: {
    flex: 1,
    flexDirection: "column",
  },
})

export const InfiniteScrollArtworksGridContainer = createFragmentContainer(
  InfiniteScrollArtworksGridMapper,
  {
    connection: graphql`
      fragment InfiniteScrollArtworksGrid_connection on ArtworkConnectionInterface
      @argumentDefinitions(skipMyCollection: { type: "Boolean", defaultValue: true }) {
        pageInfo {
          hasNextPage
          startCursor
          endCursor
        }
        edges {
          node {
            slug
            id
            image {
              aspectRatio
            }
            ...ArtworkGridItem_artwork
            ...MyCollectionArtworkGridItem_artwork @skip(if: $skipMyCollection)
          }
        }
      }
    `,
  }
)

/** Same as InfiniteScrollArtworksGridContainer but for MyCollection Artworks */
export const InfiniteScrollMyCollectionArtworksGridContainer = createFragmentContainer(
  InfiniteScrollArtworksGridMapper,
  {
    myCollectionConnection: graphql`
      fragment InfiniteScrollArtworksGrid_myCollectionConnection on MyCollectionConnection
      @argumentDefinitions(skipArtworkGridItem: { type: "Boolean", defaultValue: true }) {
        pageInfo {
          hasNextPage
          startCursor
          endCursor
        }
        edges {
          node {
            title
            slug
            id
            image {
              aspectRatio
            }
            artistNames
            medium
            artist {
              internalID
              name
            }
            pricePaid {
              minor
            }
            sizeBucket
            width
            height
            date
            ...MyCollectionArtworks_filterProps @relay(mask: false)
            ...ArtworkGridItem_artwork @skip(if: $skipArtworkGridItem)
            ...MyCollectionArtworkGridItem_artwork
          }
        }
      }
    `,
  }
)
