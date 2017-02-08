/* @flow */
'use strict'

// 1. Get first layout pass of grid view so we have a total width and calculate the column width (componentDidMount?).
// 2. Possibly do artwork column layout now, as we can do so based just on the aspect ratio, assuming the text height
//    won't be too different between artworks.
// 3. Get artwork heights by either:
//    - calculating the item size upfront with aspect ratio and a static height for the text labels.
//    - leting the artwork component do a layout pass and calculate its own height based on the column width.
// 4. Update height of grid to encompass all items.

import Relay from 'react-relay'
import React from 'react'
import { Dimensions, View, ScrollView, StyleSheet } from 'react-native'
import type { LayoutEvent } from '../../system/events'

import Artwork from './artwork'
import Spinner from '../spinner'

import metaphysics from '../../metaphysics'
import {get, isEqual} from 'lodash'

const PageSize = 10
const PageEndThreshold = 1000

/**
 * TODOs:
 * - currently all the code assumes column layout
 *   - do no invert aspect ratios in row layout
 * - deal with edge-cases when calculating in which section an artwork should go
 *   - see ARMasonryCollectionViewLayout for details on how to deal with last works sticking out
 *   - the calculation currently only takes into account the size of the image, not if e.g. the sale message is present
 */

type Props = {
  /** The direction for the grid, currently only 'column' is supported . */
  sectionDirection: string;

  /** The arity of the number of sections (e.g. columns) to show */
  sectionCount: number;

  /** The inset margin for the whole grid */
  sectionMargin: number;

  /** The per-item margin */
  itemMargin: number;

  /** All the artworks for the grid */
  artworks: any[];

  /** A non-optional object for the request state.
   *  When this changes, it will reset the component.
   *  We recommend sending in your query params.
   *  This gets passed back to your request query below.
   * */
  queryState: any;

  /** A callback that is called once all artworks have been queried. */
  onComplete?: () => void;

  /** When you get the results from the GraphQL, this is the keypath from
   * which the artworks can be found, applied via `_.get()`
   * */
  queryArtworksKeypath: string;
}

class InfiniteScrollArtworksGrid extends React.Component {
  _sentEndForContentLength: null | number;
  props: Props

  static defaultProps = {
    sectionDirection: 'column',
    sectionCount: Dimensions.get('window').width > 700 ? 3 : 2,
    sectionMargin: 20,
    itemMargin: 20,
  }

  constructor(props) {
    super(props)
    this.state = {
      sectionDimension: 0,
      completed: false,
      fetchingNextPage: false,
    }
    this._sentEndForContentLength = null
  }

  /** Download new Artworks, and update the internal state accordingly */
  fetchNextPage() {
    if (this.state.fetchingNextPage || this.state.completed) {
      return
    }
    this.setState({ fetchingNextPage: true })
    this.props.relay.setVariables({
      totalSize: this.props.relay.variables.totalSize + PageSize
    }, (readyState) => {
      if (readyState.done) {
        this.setState({ fetchingNextPage: false })
      }
    })
  }

  /** A simplified version of the Relay debugging logs for infinite scrolls */
  debugLog(query: string, response: ?any, error: ?any) {
    if (__DEV__ && global.originalXMLHttpRequest !== undefined) {
      var groupName = '%c[' + this.state.page + '] ' + 'Infinite scroll request'
      console.groupCollapsed(groupName, 'color:' + (response ? 'black' : 'red') + ';')
      console.log('Query:\n', query)
      if (response) {
        console.log('Response:\n', response)
      }
      console.groupEnd()
      if (error) {
        console.error('Error:\n', error)
      }
    }
  }

  onLayout = (event: LayoutEvent) => {
    const layout = event.nativeEvent.layout
    if (layout.width > 0) {
      // This is the sum of all margins in between sections, so do not count to the right of last column.
      const sectionMargins = this.props.sectionMargin * (this.props.sectionCount - 1)
      this.setState({ sectionDimension: (layout.width - sectionMargins) / this.props.sectionCount })
    }
  }

  sectionedArtworks(artworks) {
    const sectionedArtworks = []
    const sectionRatioSums = []
    for (let i = 0; i < this.props.sectionCount; i++) {
      sectionedArtworks.push([])
      sectionRatioSums.push(0)
    }
    for (let i = 0; i < artworks.length; i++) {
      const artwork = artworks[i].node

      // There are artworks without images and other ‘issues’. Like Force we’re just going to reject those for now.
      // See: https://github.com/artsy/eigen/issues/1667
      //
      if (artwork.image) {
        // Find section with lowest *inverted* aspect ratio sum, which is the shortest column.
        let lowestRatioSum = Number.MAX_VALUE // Start higher, so we always find a
        let sectionIndex: ?number = null
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
          const aspectRatio = artwork.image.aspect_ratio || 1 // Ensure we never divide by null/0
          // Invert the aspect ratio so that a lower value means a shorter section.
          sectionRatioSums[sectionIndex] += (1 / aspectRatio)
        }
      }
    }

    return sectionedArtworks
  }

  renderSections(artworks) {
    const spacerStyle = {
      height: this.props.itemMargin,
    }

    const sectionedArtworks = this.sectionedArtworks(artworks)
    const sections = []
    for (let i = 0; i < this.props.sectionCount; i++) {
      const artworkComponents = []
      for (let j = 0; j < sectionedArtworks[i].length; j++) {
        const artwork = sectionedArtworks[i][j]
        artworkComponents.push(
          <Artwork
            artwork={artwork}
            key={'artwork-' + j + '-' + artwork.__id}
          />)
        // Setting a marginBottom on the artwork component didn’t work, so using a spacer view instead.
        if (j < artworks.length - 1) {
          artworkComponents.push(
            <View style={spacerStyle} key={'spacer-' + j + '-' + artwork.__id} accessibilityLabel="Spacer View" />
          )
        }
      }

      const sectionSpecificStyle = {
        width: this.state.sectionDimension,
        marginRight: (i === this.props.sectionCount - 1 ? 0 : this.props.sectionMargin),
      }

      sections.push(
        <View style={[styles.section, sectionSpecificStyle]} key={i} accessibilityLabel={'Section ' + i}>
          {artworkComponents}
        </View>
      )
    }
    return sections
  }

  // Lifted pretty much straight from RN’s ListView.js
  onScroll = (event) => {
    const scrollProperties = event.nativeEvent
    const contentLength = scrollProperties.contentSize.height
    if (contentLength !== this._sentEndForContentLength) {
      const offset = scrollProperties.contentOffset.y
      const visibleLength = scrollProperties.layoutMeasurement.height
      const distanceFromEnd = contentLength - visibleLength - offset
      if (distanceFromEnd < PageEndThreshold) {
        this._sentEndForContentLength = contentLength
        this.fetchNextPage()
      }
    }
  }

  getArtworks() {
    if (!this.props.artist.artworks) {
      return []
    }
    const artworks = this.props.artist.artworks.edges
    return this.renderSections(artworks)
  }

  render() {
    // const artworks = this.state.sectionDimension ? this.renderSections() : null
    const artworks = this.getArtworks()
    return (
      <ScrollView onScroll={this.onScroll}
                  scrollEventThrottle={50}
                  onLayout={this.onLayout}
                  scrollsToTop={false}
                  accessibilityLabel="Artworks ScrollView">
        <View style={styles.container} accessibilityLabel="Artworks Content View">
          {artworks}
        </View>
        {this.state.fetchingNextPage ? <Spinner style={styles.spinner} /> : null}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  section: {
    flex: 1,
    flexDirection: 'column',
  },
  spinner: {
    marginTop: 20,
  },
})

export default Relay.createContainer(InfiniteScrollArtworksGrid, {
  initialVariables: {
    totalSize: PageSize
  },
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        artworks: artworks_connection(sort: partner_updated_at_desc, filter: IS_FOR_SALE, first: $totalSize) {
          edges {
            node {
              image {
                id
              }
              ${Artwork.getFragment('artwork')}
            }
          }
        }
      }
    `,
  },
})
