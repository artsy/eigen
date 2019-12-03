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

import Spinner from "../Spinner"
import Artwork from "./ArtworkGridItem"

import { isCloseToBottom } from "lib/utils/isCloseToBottom"

import { PAGE_SIZE } from "lib/data/constants"

import { Box, space } from "@artsy/palette"
import { InfiniteScrollArtworksGrid_connection } from "__generated__/InfiniteScrollArtworksGrid_connection.graphql"
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

  /** A callback that is called once all artworks have been queried. */
  // TODO: Should not be necessary now that we have a loadMore callback
  onComplete?: () => void

  /** A component to render at the top of all items */
  HeaderComponent?: React.ComponentType<any> | React.ReactElement<any>

  /** Pass true if artworks should have a Box wrapper with gutter padding */
  shouldAddPadding?: boolean
}

interface PrivateProps {
  connection: InfiniteScrollArtworksGrid_connection
  loadMore: RelayPaginationProp["loadMore"]
}

interface State {
  sectionDimension: number
  completed: boolean
  fetchingNextPage: boolean
}

class InfiniteScrollArtworksGrid extends React.Component<Props & PrivateProps, State> {
  static defaultProps = {
    sectionDirection: "column",
    sectionCount: Dimensions.get("window").width > 700 ? 3 : 2,
    sectionMargin: 20,
    itemMargin: 20,
    shouldAddPadding: false,
  }

  state = {
    sectionDimension: 0,
    completed: false,
    fetchingNextPage: false,
  }

  fetchNextPage = () => {
    if (this.state.fetchingNextPage || this.state.completed) {
      return
    }
    this.setState({ fetchingNextPage: true })
    this.props.loadMore(PAGE_SIZE, error => {
      if (error) {
        // FIXME: Handle error
        console.error("InfiniteScrollGrid.tsx", error.message)
      }
      this.setState({ fetchingNextPage: false })
      if (!this.props.connection.pageInfo.hasNextPage) {
        if (this.props.onComplete) {
          this.props.onComplete()
        }
        this.setState({ completed: true })
      }
    })
  }

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

  onLayout = (event: LayoutChangeEvent) => {
    const layout = event.nativeEvent.layout
    const { shouldAddPadding } = this.props
    if (layout.width > 0) {
      // This is the sum of all margins in between sections, so do not count to the right of last column.
      const sectionMargins = this.props.sectionMargin * (this.props.sectionCount - 1)
      const artworkPadding = shouldAddPadding ? space(4) : 0
      this.setState({
        sectionDimension: (layout.width - sectionMargins) / this.props.sectionCount - artworkPadding,
      })
    }
  }

  sectionedArtworks() {
    const sectionRatioSums: number[] = []
    const artworks = this.props.connection.edges.map(({ node }) => node)
    const sectionedArtworks: Array<typeof artworks> = []

    for (let i = 0; i < this.props.sectionCount; i++) {
      sectionedArtworks.push([])
      sectionRatioSums.push(0)
    }
    artworks.forEach(artwork => {
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

    const artworks = this.props.connection.edges
    const sectionedArtworks = this.sectionedArtworks()
    const sections: JSX.Element[] = []
    for (let i = 0; i < this.props.sectionCount; i++) {
      const artworkComponents: JSX.Element[] = []
      for (let j = 0; j < sectionedArtworks[i].length; j++) {
        const artwork = sectionedArtworks[i][j]
        artworkComponents.push(<Artwork artwork={artwork} key={"artwork-" + j + "-" + artwork.id} />)
        // Setting a marginBottom on the artwork component didn’t work, so using a spacer view instead.
        if (j < artworks.length - 1) {
          artworkComponents.push(
            <View style={spacerStyle} key={"spacer-" + j + "-" + artwork.id} accessibilityLabel="Spacer View" />
          )
        }
      }

      const sectionSpecificStyle = {
        width: this.state.sectionDimension,
        marginRight: i === this.props.sectionCount - 1 ? 0 : this.props.sectionMargin,
      }

      sections.push(
        <View style={[styles.section, sectionSpecificStyle]} key={i} accessibilityLabel={"Section " + i}>
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

    // @ts-ignore
    return React.isValidElement(HeaderComponent) ? HeaderComponent : <HeaderComponent />
  }

  render() {
    const artworks = this.state.sectionDimension ? this.renderSections() : null
    const { shouldAddPadding } = this.props
    const boxPadding = shouldAddPadding ? 2 : 0
    return (
      <ScrollView
        onScroll={isCloseToBottom(this.fetchNextPage)}
        scrollEventThrottle={50}
        onLayout={this.onLayout}
        scrollsToTop={false}
        accessibilityLabel="Artworks ScrollView"
      >
        {this.renderHeader()}
        <Box px={boxPadding}>
          <View style={styles.container} accessibilityLabel="Artworks Content View">
            {artworks}
          </View>
        </Box>
        {this.state.fetchingNextPage && (
          <Box my={2}>
            <Spinner />
          </Box>
        )}
      </ScrollView>
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
