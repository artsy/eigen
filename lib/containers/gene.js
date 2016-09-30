/* @flow */
'use strict'

import Relay from 'react-relay'
import React from 'react'
import { Text, ScrollView, View, Dimensions } from 'react-native'

import Events from '../native_modules/events'

import About from '../components/gene/about'
import Header from '../components/gene/header'

import TabView from '../components/tab_view'
import type TabSelectionEvent from '../components/events'

const TABS = {
  WORKS: 'WORKS',
  ABOUT: 'ABOUT',
}

class Gene extends React.Component {

  state: {
    selectedTabIndex: number,
  };

  componentWillMount() {
    this.state = { selectedTabIndex: 1 }
  }

  tabSelectionDidChange = (event: TabSelectionEvent) => {
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

  renderSelectedTab = () => {
    switch (this.selectedTabTitle()) {
      // case TABS.ABOUT: return <About gene={this.props.gene} />
      // case TABS.WORKS: return <Artworks gene={this.props.gene} />
      case TABS.ABOUT: return <About gene={this.props.gene} />
      case TABS.WORKS: return <Text/>
    }
  }

  renderTabView() {
    return (
      <TabView titles={this.availableTabs()} selectedIndex={this.state.selectedTabIndex} onSelectionChange={this.tabSelectionDidChange}>
        { this.renderSelectedTab() }
      </TabView>
    )
  }

  render() {
    const windowDimensions = Dimensions.get('window')
    const commonPadding = windowDimensions.width > 700 ? 40 : 20

    return (
      <ScrollView scrollsToTop={true}>
        <View style={{ paddingLeft: commonPadding, paddingRight: commonPadding }}>
          <Header gene={this.props.gene} />
          { this.renderTabView() }
        </View>
      </ScrollView>
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
        ${About.getFragment('artist')}
      }
    `,
  }
})
