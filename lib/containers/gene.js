/* @flow */
'use strict'

import Relay from 'react-relay'
import React from 'react'
import { Text, View, Dimensions } from 'react-native'

import ParallaxScrollView from 'react-native-parallax-scroll-view'

import Events from '../native_modules/events'

import About from '../components/gene/about'
import Header from '../components/gene/header'
import Artworks from '../components/gene/artworks'

import SwitchView from '../components/switch_view'
import type SwitchEvent from '../components/events'

const TABS = {
  WORKS: 'WORKS',
  ABOUT: 'ABOUT',
}

class Gene extends React.Component {

  state: {
    selectedTabIndex: number,
  };

  componentWillMount() {
    this.state = { selectedTabIndex: 0 }
  }

  switchSelectionDidChange = (event: SwitchEvent) => {
    this.setState({ selectedTabIndex: event.nativeEvent.selectedIndex })
  }

  availableTabs = () => {
    return [TABS.WORKS, TABS.ABOUT]
  }

  selectedTabTitle = () => {
    return this.availableTabs()[this.state.selectedTabIndex]
  }

  // This is *not* called on the initial render, thus it will only post events for when the user actually taps a tab.
  componentDidUpdate(previousProps, previousState) {
    Events.postEvent(this, {
      name: 'Tapped gene view tab',
      tab: this.selectedTabTitle().toLowerCase(),
      gene_id: this.props.gene._id,
      gene_slug: this.props.gene.id,
    })
  }

  renderAboutSection = () => {
    switch (this.selectedTabTitle()) {
      // case TABS.WORKS: return <Artworks gene={this.props.gene} />
      case TABS.ABOUT: return <About gene={this.props.gene} />
      case TABS.WORKS: return <Artworks gene={this.props.gene} />
    }
  }

// Note: Foreground = the header, which gets replaced
// Sticky = the view shown when scrolled down a lot

  // When Works is active:
  //  Foreground is title, refine selector
  //  Sticky Header is title, follow, switch
  //  PScrollView's children is the Artworks component

  // When About is active:
  //  Sticky Header is just gene title
  //  PScrollView's children is the About component

  renderForeground = () => {
    const windowDimensions = Dimensions.get('window')
    const commonPadding = windowDimensions.width > 700 ? 40 : 20
    return (
      <View style={{ backgroundColor: "red", paddingLeft: commonPadding, paddingRight: commonPadding }}>
      <Header gene={this.props.gene} shortForm={false} />
      </View>
    )
  }

  renderStickyHeader = () => {
    const windowDimensions = Dimensions.get('window')
    const commonPadding = windowDimensions.width > 700 ? 40 : 20
    return (
      <View style={{ backgroundColor:'blue', paddingLeft: commonPadding, paddingRight: commonPadding }}>
        <Header gene={this.props.gene} shortForm={true} />
        <Text>Sticky</Text>
      </View>
    )
  }

  render() {
    return (
      <ParallaxScrollView
        scrollsToTop={true}
        parallaxHeaderHeight={120}
        fadeOutForeground={false}
        backgroundSpeed={1}
        backgroundColor="white"
        contentBackgroundColor="white"
        renderForeground={this.renderForeground}
        stickyHeaderHeight={100}
        renderStickyHeader={this.renderStickyHeader}>

          <SwitchView titles={this.availableTabs()} selectedIndex={this.state.selectedTabIndex} onSelectionChange={this.switchSelectionDidChange}/ >
          { this.renderAboutSection() }
          <Text>Hello world</Text>

      </ParallaxScrollView>
    )
  }
}


export default Relay.createContainer(Gene, {
  fragments: {
    gene: () => Relay.QL`
      fragment on Gene {
        _id
        id
        ${Header.getFragment('gene')}
        ${About.getFragment('gene')}
      }
    `,
  }
})
