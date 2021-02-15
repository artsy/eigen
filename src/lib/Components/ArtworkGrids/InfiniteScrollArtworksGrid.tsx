// 1. Get first layout pass of grid view so we have a total width and calculate the column width (componentDidMount?).
// 2. Possibly do artwork column layout now, as we can do so based just on the aspect ratio, assuming the text height
//    won't be too different between artworks.
// 3. Get artwork heights by either:
//    - calculating the item size upfront with aspect ratio and a static height for the text labels.
//    - leting the artwork component do a layout pass and calculate its own height based on the column width.
// 4. Update height of grid to encompass all items.

import React from "react"
import { Dimensions, LayoutChangeEvent, ScrollView, StyleSheet, View, ViewStyle } from "react-native"
import { createFragmentContainer, RelayPaginationProp } from "react-relay"

import Artwork from "./ArtworkGridItem"

import { isCloseToBottom } from "lib/utils/isCloseToBottom"

import { PAGE_SIZE } from "lib/data/constants"

import { ScreenOwnerType } from "@artsy/cohesion"
import { InfiniteScrollArtworksGrid_connection } from "__generated__/InfiniteScrollArtworksGrid_connection.graphql"
import { extractNodes } from "lib/utils/extractNodes"
import { hideBackButtonOnScroll } from "lib/utils/hideBackButtonOnScroll"
import { Box, Button, space, Theme } from "palette"
import { graphql } from "relay-runtime"

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

  /** An array of child indices determining which children get docked to the top of the screen when scrolling.  */
  stickyHeaderIndices?: number[]

  // Hide urgency tags (3 Days left, 1 hour left)
  hideUrgencyTags?: boolean

  // Hide Partner name
  hidePartner?: boolean

  /** Show Lot Label  */
  showLotLabel?: boolean

  /** Set as true to automatically manage the back button visibility as the user scrolls */
  hideBackButtonOnScroll?: boolean

  /** To avoid layout jank, supply the width of the grid ahead of time. */
  width?: number
}

interface PrivateProps {
  connection: InfiniteScrollArtworksGrid_connection
  loadMore: RelayPaginationProp["loadMore"]
  hasMore: RelayPaginationProp["hasMore"]
}

interface State {
  sectionDimension: number
  isLoading: boolean
}

class InfiniteScrollArtworksGrid extends React.Component<Props & PrivateProps, State> {
  static defaultProps = {
    sectionDirection: "column",
    sectionCount: Dimensions.get("window").width > 700 ? 3 : 2,
    sectionMargin: 20,
    itemMargin: 20,
    shouldAddPadding: false,
    autoFetch: true,
    pageSize: PAGE_SIZE,
    hidePartner: false,
  }

  state = {
    sectionDimension: this.getSectionDimension(this.props.width),
    isLoading: false,
  }

  fetchNextPage = () => {
    if (!this.props.hasMore() || this.state.isLoading) {
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
    if (width) {
      // This is the sum of all margins in between sections, so do not count to the right of last column.
      const sectionMargins = this.props.sectionMargin! * (this.props.sectionCount! - 1)
      const { shouldAddPadding } = this.props
      const artworkPadding = shouldAddPadding ? space(4) : 0

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
    artworks.forEach((artwork) => {
      // There are artworks without images and other ‘issues’. Like Force we’re just going to reject those for now.
      // See: https://github.com/artsy/eigen/issues/1667
      //
      if (artwork.image) {
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
          const aspectRatio = artwork.image.aspectRatio || 1 // Ensure we never divide by null/0
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
        artworkComponents.push(
          <Artwork
            contextScreenOwnerType={this.props.contextScreenOwnerType}
            contextScreenOwnerId={this.props.contextScreenOwnerId}
            contextScreenOwnerSlug={this.props.contextScreenOwnerSlug}
            artwork={artwork}
            key={"artwork-" + itemIndex + "-" + artwork.id}
            hideUrgencyTags={this.props.hideUrgencyTags}
            hidePartner={this.props.hidePartner}
            showLotLabel={this.props.showLotLabel}
            itemIndex={itemIndex}
          />
        )
        // Setting a marginBottom on the artwork component didn’t work, so using a spacer view instead.
        if (row < artworks.length - 1) {
          artworkComponents.push(
            <View style={spacerStyle} key={"spacer-" + row + "-" + artwork.id} accessibilityLabel="Spacer View" />
          )
        }
      }

      const sectionSpecificStyle = {
        width: this.state.sectionDimension,
        marginRight: column === columnCount - 1 ? 0 : this.props.sectionMargin,
      }

      sections.push(
        <View style={[styles.section, sectionSpecificStyle]} key={column} accessibilityLabel={"Section " + column}>
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

  render() {
    const artworks = this.state.sectionDimension ? this.renderSections() : null
    const { shouldAddPadding, autoFetch, hasMore, stickyHeaderIndices } = this.props
    const boxPadding = shouldAddPadding ? "2" : 0

    return (
      <Theme>
        <ScrollView
          onScroll={(ev) => {
            if (this.props.hideBackButtonOnScroll) {
              hideBackButtonOnScroll(ev)
            }
            if (autoFetch) {
              this.handleFetchNextPageOnScroll(ev)
            }
          }}
          scrollEventThrottle={50}
          onLayout={this.onLayout}
          scrollsToTop={false}
          accessibilityLabel="Artworks ScrollView"
          stickyHeaderIndices={stickyHeaderIndices}
        >
          {this.renderHeader()}
          <Box px={boxPadding}>
            <View style={styles.container} accessibilityLabel="Artworks Content View">
              {artworks}
            </View>
          </Box>

          {!autoFetch && !!hasMore() && (
            <Button
              mt="5"
              mb="3"
              variant="secondaryGray"
              size="large"
              block
              onPress={this.fetchNextPage}
              loading={this.state.isLoading}
            >
              Show more
            </Button>
          )}
        </ScrollView>
      </Theme>
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

export const InfiniteScrollArtworksGridContainer = createFragmentContainer(InfiniteScrollArtworksGrid, {
  connection: graphql`
    fragment InfiniteScrollArtworksGrid_connection on ArtworkConnectionInterface {
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
        }
      }
    }
  `,
})
