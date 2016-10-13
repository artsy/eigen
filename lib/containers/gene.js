/* @flow */
'use strict'

import Relay from 'react-relay'
import React from 'react'
import { ScrollView, View, Dimensions } from 'react-native'

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

// The title of the gene when scrolled, with margins
const HeaderHeight = 64

  /**
   *  There are 3 different major views inside this componentDidUpdate
   *
   *   - Foreground [title, follow, switch]
   *   - Sticky Refine [work counter, refine]
   *   - Section inside tab [artworks || about + related artists]
   *
   *   Nuance:
   *
   *   - The foreground switches between the "foreground" and "sticky header"
   *     the foreground being the title, buttons and switch, the header being
   *     just the title. It only does this for Artworks, not about.
   *
   *   - The sticky refine, when scrolled up _gains_ a 64px margin
   *     this is so it can reach all the way of the screen, and fit
   *     the sticky header's mini title inside it.
   *
   *   - We use a fork of react-native-parallax-scroll-view which has access
   *     to change the style component of the header, as well as a well-ordered
   *     API for inserting a component into the tree. This is used so that the
   *     sticky refine section will _always_ be at a specific index, making sure
   *     the `stickyHeaderIndices` is always at the right index.
   *
   */

class Gene extends React.Component {

  state: {
    selectedTabIndex: number,
  };

  componentWillMount() {
    this.state = { selectedTabIndex: 0, showingStickyHeader: 1 }
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

  get commonPadding(): number {
    const windowDimensions = Dimensions.get('window')
    return windowDimensions.width > 700 ? 40 : 20
  }

  get showingArtworksSection(): bool {
    return this.selectedTabTitle() === TABS.WORKS
  }

  foregroundHeight(): ?number {
    return 200
  }

  // Top of the Component
  renderForeground = () => {
    return (
      <View style={{ backgroundColor:'white', paddingLeft: this.commonPadding, paddingRight: this.commonPadding }}>
          <Header gene={this.props.gene} shortForm={false} />
          <SwitchView style={{ marginTop:30 }}
            titles={this.availableTabs()}
            selectedIndex={this.state.selectedTabIndex}
            onSelectionChange={this.switchSelectionDidChange}/ >
      </View>
    )
  }

  // Callback from the parallax that we have transistioned into the small title mode
  onChangeHeaderVisibility = (sticky) => {
    if (this.state.showingStickyHeader !== sticky) {
      // Set the state so we can change the margins on the refine section
      this.setState({ showingStickyHeader: sticky })
    }
  }

  // No sticky header if you're in the about section
  stickyHeaderHeight(): ?number {
    if (!this.showingArtworksSection) { return null }
    return HeaderHeight
  }

  // Title of the Gene
  renderStickyHeader = () => {
    if (!this.showingArtworksSection) { return null }
    const commonPadding = this.commonPadding
    return (
      <View style={{ paddingLeft: commonPadding, paddingRight: commonPadding, backgroundColor: 'white' }}>
        <Header gene={this.props.gene} shortForm={true} />
      </View>
    )
  }

  // Count of the works, and the refine button - sticks to the top of screen when scrolling
  renderStickyRefineSection = () => {
    if (!this.showingArtworksSection) { return null }
    const topMargin = this.state.showingStickyHeader ? 0 : HeaderHeight

    return (<View style={{ backgroundColor: 'white'}}>
        <Separator style={{marginTop:topMargin}} />
        <View style={{flexDirection: 'row', justifyContent: 'space-between', height: 32, marginTop:8, marginBottom:8, paddingLeft: this.commonPadding, paddingRight: this.commonPadding}} >
          <SerifText>1,xxx, works</SerifText>
          <WhiteButton text="REFINE" style={{ marginTop:8, height: 20, width: 90}}/>
        </View>
        <Separator/>
      </View>)
  }

  render() {
    const stickyTopMargin = this.state.showingStickyHeader ?  0 : -HeaderHeight

    return (
      <ParallaxScrollView
        scrollsToTop={true}
        fadeOutForeground={false}
        backgroundScrollSpeed={1}

        backgroundColor="white"
        contentBackgroundColor="white"
        renderForeground={this.renderForeground}

        stickyHeaderHeight={this.stickyHeaderHeight()}
        renderStickyHeader={this.renderStickyHeader}

        onChangeHeaderVisibility={this.onChangeHeaderVisibility}

        stickyHeaderIndices={[1]}
        renderBodyComponentHeader={this.renderStickyRefineSection}

        parallaxHeaderHeight={this.foregroundHeight()}
        parallaxHeaderContainerStyles={{marginBottom:stickyTopMargin}}
        >

        <View style={{ marginTop:20, paddingLeft: this.commonPadding, paddingRight: this.commonPadding }}>
            { this.renderSectionForTab() }
        </View>

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
