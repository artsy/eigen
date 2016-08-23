/* @flow */
'use strict'

import Relay from 'react-relay'
import React from 'react'
import { View, StyleSheet, TouchableHighlight, LayoutAnimation, Text, Image, Dimensions } from 'react-native'

import Spinner from '../../spinner'
import Grid from '../../artwork_grids/generic_grid'
import Header from './artwork_rail_header'
import Separator from '../../separator'
import colors from '../../../../data/colors'
import SwitchBoard from '../../../modules/switch_board'
import fragments from './relay_fragments'

const isPad = Dimensions.get('window').width > 700

class ArtworkRail extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      expanded: false,
      hasAdditionalContent: true,
      gridHeight: 0,
    }
  }

  componentDidMount() {
    this.props.relay.setVariables({ fetchContent: true })
  }

  expand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({ expanded: true })
  }

  renderExpansionButton() {
    if (!this.state.expanded) {
      return (
        <TouchableHighlight style={styles.expansionButton} onPress={this.expand} underlayColor={'white'}>
            <Image style={{height: 8, width: 15, alignSelf: 'center'}} source={require('../../../../images/chevron.png')} />
        </TouchableHighlight>
      )
    }
    return null
  }

  renderViewAllButton() {
    if (this.state.expanded) {
      return (
        <TouchableHighlight style={styles.viewAllButton} onPress={this.handleViewAll} underlayColor={'gray'}>
          <Text style={styles.viewAllText}>VIEW ALL</Text>
        </TouchableHighlight>
      )
    }
    return null
  }

  handleViewAll = () => {
    const context = this.props.rail.context
    if (!context) { return }

    let url = null
    switch (context.__typename) {
      case 'HomePageModuleContextFollowArtists':
        url = 'me/notifications'
        break
      case 'HomePageModuleContextRelatedArtist':
        url = context.artist.href
        break
      case 'HomePageModuleContextGene':
      case 'HomePageModuleContextFair':
      case 'HomePageModuleContextSale':
        url = context.href
        break
    }

    if (url) { SwitchBoard.presentNavigationViewController(this, url) }
  }


  onGridLayout(event) {
    this.setState({ gridHeight: event.nativeEvent.layout.height })
  }

  expandable() {
    return this.props.rail.results.length > (isPad ? 3 : 6)
  }

  mainContainerHeight() {
    if (this.expandable()) {
      const initialRailHeight = isPad ? 460 : 530
      return this.state.expanded ? this.state.gridHeight + 101 : initialRailHeight
    } else {
      return this.state.gridHeight + 31
    }
  }

  gridContainerHeight() {
    if (this.expandable()) {
      const initialInternalViewHeight = isPad ? 420 : 500
      return this.state.expanded ? this.state.gridHeight : initialInternalViewHeight
    } else {
      this.state.gridHeight
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

  renderModuleResults() {
    if (this.props.rail.results && this.props.rail.results.length) {
      return (
        <View style={[styles.container, { height: this.mainContainerHeight() }]}>
          { this.renderGrid() }
          { this.renderViewAllButton() }
          <Separator style={{marginTop: this.expandable() ? 0 : 30 }}/>
          { this.expandable() && this.renderExpansionButton() }
        </View>
      )
    } else if (this.props.rail.results) {
      // temporary; for those pesky empty rails on staging
      return null
    } else {
      return <Spinner style={{ flex: 1 }} />
    }
  }

  render() {
    const sideMargin = isPad ? 40 : 20
    return (
      <View>
        <Header rail={this.props.rail}/>
        <View style={{ marginLeft: sideMargin, marginRight: sideMargin }}>
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
        context {
          __typename
          ${fragments.relatedArtistFragment}
          ${fragments.geneFragment}
          ${fragments.auctionFragment}
          ${fragments.fairFragment}
        }
        results @include(if: $fetchContent) {
          ${Grid.getFragment('artworks')}
        }
      }
    `,
  }
})
