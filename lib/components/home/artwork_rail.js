/* @flow */
'use strict'

import Relay from 'react-relay'
import React from 'react'
import { View, StyleSheet, TouchableHighlight, LayoutAnimation, Text, Image, Dimensions } from 'react-native'

import Spinner from '../spinner'
import Grid from '../artwork_grids/generic_grid'
import SerifText from '../text/serif'
import Separator from '../separator'
import colors from '../../../data/colors'

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

  onPress() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({ expanded: true })
  }

  renderExpansionButton() {
    if (!this.state.expanded) {
      return (
        <TouchableHighlight style={styles.expansionButton} onPress={this.onPress.bind(this) } underlayColor={'white'}>
            <Image style={{height: 8, width: 15, alignSelf: 'center'}} source={require('../../../images/chevron.png')} />
        </TouchableHighlight>
      )
    }
    return null
  }

  renderViewAllButton() {
    if (this.state.expanded) {
      return (
        <TouchableHighlight style={styles.viewAllButton} onPress={this.onViewAllPress.bind(this)} underlayColor={'gray'}>
          <Text style={styles.viewAllText}>VIEW ALL</Text>
        </TouchableHighlight>
      )
    }
    return null
  }

  onViewAllPress() {
    // pop new view controller
  }

  onGridLayout(event) {
    this.setState({ gridHeight: event.nativeEvent.layout.height })
  }

  expandable() {
    return this.props.rail.results.length > 3
  }

  mainContainerHeight() {
    if (this.expandable()) {
      const initialRailHeight = isPad ? 500 : 580
      return this.state.expanded ? this.state.gridHeight + 150 : initialRailHeight
    } else {
      return this.state.gridHeight + 31
    }
  }

  gridContainerHeight() {
    if (this.expandable()) {
      const initialInternalViewHeight = isPad ? 420 : 500
      return this.state.expanded ? this.state.gridHeight + 100 : initialInternalViewHeight
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
        { this.state.hasAdditionalContent && this.renderViewAllButton() }
      </View>
    );
  }

  renderModuleResults() {
    if (this.props.rail.results && this.props.rail.results.length) {
      return (
        <View style={[styles.container, { height: this.mainContainerHeight() }]}>
          { this.renderGrid() }
          <Separator/>
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
        <SerifText numberOfLines={2} style={styles.title}>{this.props.rail.title}</SerifText>
        <View style={{ marginLeft: sideMargin, marginRight: sideMargin }}>
          { this.renderModuleResults() }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    margin: isPad ? 40 : 20,
    marginBottom: isPad ? 30 : 20,
    marginTop: isPad ? 50 : 40,
    fontSize: isPad ? 30 : 26,
    alignSelf: 'center',
    textAlign: 'center',
  },
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
        title
        results @include(if: $fetchContent) {
          ${Grid.getFragment('artworks')}
        }
      }
    `,
  }
})
