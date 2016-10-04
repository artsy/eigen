/* @flow */
'use strict'

import Relay from 'react-relay'
import React from 'react'
import { Text, View, Dimensions } from 'react-native'

import ParallaxScrollView from 'react-native-parallax-scroll-view'

import Events from '../native_modules/events'

import Separator from '../components/separator'
import SerifText from '../components/text/serif'
import WhiteButton from '../components/buttons/flat_white'

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

  renderSectionForTab = () => {
    switch (this.selectedTabTitle()) {
      case TABS.ABOUT: return <About gene={this.props.gene} />
      case TABS.WORKS: return <Artworks gene={this.props.gene} />
    }
  }

  get showingArtworksSection(): bool {
    return this.selectedTabTitle() === TABS.WORKS
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
      <View style={{ paddingLeft: commonPadding, paddingRight: commonPadding }}>
      <Header gene={this.props.gene} shortForm={false} />
      </View>
    )
  }

  stickyHeaderHeight(): ?number {
    if (!this.showingArtworksSection) { return null }
    return 98
  }

  renderStickyHeader = () => {
    if (!this.showingArtworksSection) { return null }
    const windowDimensions = Dimensions.get('window')
    const commonPadding = windowDimensions.width > 700 ? 40 : 20
    return (
      <View style={{ paddingLeft: commonPadding, paddingRight: commonPadding }}>
        <Header gene={this.props.gene} shortForm={true} style={{ backgroundColor: "green" }}/>
        <Separator style={{ marginTop:28 }}/>
        <View style={{flexDirection: 'row', justifyContent: "space-between", height: 30 }} >
          <SerifText style={{ paddingTop:8 }} >1,xxx, works</SerifText>
          <WhiteButton text="REFINE" style={{ height: 20, width: 90 }}/>
        </View>
        <Separator/>
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
        stickyHeaderHeight={this.stickyHeaderHeight()}
        renderStickyHeader={this.renderStickyHeader}>

        <SwitchView titles={this.availableTabs()} selectedIndex={this.state.selectedTabIndex} onSelectionChange={this.switchSelectionDidChange}/ >
        { this.renderSectionForTab() }

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
