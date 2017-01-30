import Relay from 'react-relay'
import React from 'react'
import _ from 'lodash'
import { View, StyleSheet, TouchableHighlight, LayoutAnimation, Text, Image, Dimensions } from 'react-native'

import Spinner from '../../spinner'
import Grid from '../../artwork_grids/generic_grid'
import Header from './artwork_rail_header'
import Separator from '../../separator'
import colors from '../../../../data/colors'
import SwitchBoard from '../../../native_modules/switch_board'
import fragments from './relay_fragments'

const isPad = Dimensions.get('window').width > 700

const additionalContentRails = [
  'followed_artists',
  'saved_works',
  'live_auctions',
  'current_fairs',
  'genes',
  'generic_gene',
  'followed_artist',
]

class ArtworkRail extends React.Component {
  state: {
    expanded: boolean,
    gridHeight: number,
    loadFailed: boolean
  }

  constructor(props) {
    super(props)

    this.state = {
      expanded: false,
      gridHeight: 0,
      loadFailed: false,
    }
  }

  componentDidMount() {
    this.props.relay.setVariables({ fetchContent: true }, readyState => {
      if (readyState.error) {
        this.setState({ loadFailed: true })
      }
    })
  }

  expand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({ expanded: true })
  }

  hasAdditionalContent() {
    return additionalContentRails.indexOf(this.props.rail.key) > -1
  }

  handleViewAll = () => {
    const context = this.props.rail.context
    const key = this.props.rail.key

    let url = null
    switch (key) {
      case 'followed_artists':
        url = '/works-for-you'
        break
      case 'followed_artist':
      case 'related_artists':
        url = context && context.artist.href
        break
      case 'saved_works':
        url = '/favorites'
        break
      case 'generic_gene':
        url = this.geneQueryLink(this.props.rail)
        break
      case 'genes':
      case 'current_fairs':
      case 'live_auctions':
        url = context && context.href
        break
    }

    if (url) { SwitchBoard.presentNavigationViewController(this, url) }
  }

  geneQueryLink(rail) {
    if (!rail.context) { return '' }
    // Pull out any params, removing the first removing data ID
    // and any null values, turn that into a query string
    const relatedKeys = Object.keys(_.omit(rail.params, ['__dataID__']))

    return rail.context && rail.context.href + '?' +
      relatedKeys.map(function(key) {
        if (!rail.params[key]) { return }
        return encodeURIComponent(key) + '=' + encodeURIComponent(rail.params[key])
      }).join('&')
  }

  onGridLayout(event) {
    this.setState({ gridHeight: event.nativeEvent.layout.height })
  }

  expandable() {
    return this.props.rail.results.length > (isPad ? 3 : 6)
  }

  mainContainerHeight() {
    // includes height of View All button (if present), the separator, and a 30px margin
    const supplementaryHeight = this.hasAdditionalContent() ? 101 : 30

    if (this.expandable()) {
      const initialRailHeight = isPad ? 410 : 510
      return this.state.expanded ? this.state.gridHeight + supplementaryHeight : initialRailHeight
    } else {
      return this.state.gridHeight + supplementaryHeight
    }
  }

  gridContainerHeight() {
    if (this.expandable()) {
      const initialInternalViewHeight = isPad ? 400 : 500
      return this.state.expanded ? this.state.gridHeight : initialInternalViewHeight
    } else {
      return this.state.gridHeight
    }
  }

  renderGrid() {
    return (
      <View style={[styles.gridContainer, { height: this.gridContainerHeight() }]}>
        <View onLayout={this.onGridLayout.bind(this)}>
          <Grid artworks={this.props.rail.results}/>
        </View>
      </View>
    )
  }

  renderViewAllButton() {
    if (this.expandable() && !this.state.expanded) { return }

    if (this.hasAdditionalContent()) {
      return (
        <TouchableHighlight style={styles.viewAllButton} onPress={this.handleViewAll} underlayColor={'gray'}>
          <Text style={styles.viewAllText}>VIEW ALL</Text>
        </TouchableHighlight>
      )
    }

      // otherwise, use a spacer view
      return <View style={{ height: 30 }} />
    }

  renderExpansionButton() {
    if (this.expandable() && !this.state.expanded) {
      return (
        <TouchableHighlight style={styles.expansionButton} onPress={this.expand} underlayColor={'white'}>
            <Image style={{height: 8, width: 15, alignSelf: 'center', resizeMode: 'center'}} source={require('../../../../images/chevron.png')} />
        </TouchableHighlight>
      )
    }
  }

  renderModuleResults() {
    if (this.props.rail.results && this.props.rail.results.length) {
      return (
        <View style={[styles.container, { height: this.mainContainerHeight() }]}>
          { this.renderGrid() }
          { this.renderViewAllButton() }
          <Separator />
          { this.renderExpansionButton() }
        </View>
      )
    } else {
      return <Spinner style={{ flex: 1 }} />
    }
  }

  render() {
    if (this.state.loadFailed) {
      return null
    }

    const sideMargin = isPad ? 40 : 20
    const style: any = { marginLeft: sideMargin, marginRight: sideMargin }
    if (!this.props.relay.variables.fetchContent) {
      // if there's no content, set minHeight to prevent spinners from all the rails showing
      style.minHeight = 400
    }
    return (
      <View accessibilityLabel="Artwork Rail" style={{ paddingBottom: this.state.expanded ? 0 : 12 }}>
        <Header rail={this.props.rail} handleViewAll={this.handleViewAll}/>
        <View style={style}>
          { this.renderModuleResults() }
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  gridContainer: {
    overflow: 'hidden',
  },
  expansionButton: {
    height: 40,
    width: 40,
    backgroundColor: 'white',
    borderColor: colors['gray-regular'],
    borderWidth: 1,
    borderRadius: 30,
    alignSelf: 'center',
    top: -20,
    justifyContent: 'center'
  },
  viewAllButton: {
    width: 240,
    height: 40,
    backgroundColor: 'black',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 30,
  },
  viewAllText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Avant Garde Gothic ITCW01Dm',
  }
})

export default Relay.createContainer(ArtworkRail, {
  initialVariables: {
    fetchContent: false,
  },

  fragments: {
    rail: () => Relay.QL`
      fragment on HomePageArtworkModule {
        ${Header.getFragment('rail')}
        key
        params {
          medium
          price_range
        }
        context {
          ${fragments.relatedArtistFragment}
          ${fragments.geneFragment}
          ${fragments.auctionFragment}
          ${fragments.fairFragment}
          ${fragments.followedArtistFragment}
        }
        results @include(if: $fetchContent) {
          ${Grid.getFragment('artworks')}
        }
      }
    `,
  }
})
