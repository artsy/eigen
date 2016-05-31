/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { ScrollView, View, Dimensions } from 'react-native';

import Events from '../modules/events';

import Header from '../components/artist/header';
import About from '../components/artist/about';
import Shows from '../components/artist/shows';
import Artworks from '../components/artist/artworks';

import TabView from '../components/tab_view';
import type TabSelectionEvent from '../components/tab_view';

const TABS = {
  ABOUT: 'ABOUT',
  WORKS: 'WORKS',
  SHOWS: 'SHOWS'
};

class Artist extends React.Component {
  constructor() {
    super();
    this.state = { selectedTabIndex: 1 };

    this.availableTabs = this.availableTabs.bind(this);
    this.selectedTabTitle = this.selectedTabTitle.bind(this);
    this.tabSelectionDidChange = this.tabSelectionDidChange.bind(this);
    this.renderTabViewContent = this.renderTabViewContent.bind(this);
  }

  tabSelectionDidChange(event: TabSelectionEvent) {
    this.setState({ selectedTabIndex: event.nativeEvent.selectedIndex });
  }

  availableTabs() {
    const tabs = [TABS.ABOUT];
    if (this.props.artist.counts.artworks) {
      tabs.push(TABS.WORKS);
    }
    // TODO Replace this with a count that we get back from metaphysics.
    if (this.props.artist.partner_shows.length) {
      tabs.push(TABS.SHOWS);
    }
    return tabs;
  }

  selectedTabTitle() {
    return this.availableTabs()[this.state.selectedTabIndex];
  }

  // This is *not* called on the initial render, thus it will only post events for when the user actually taps a tab.
  componentDidUpdate(previousProps, previousState) {
    Events.postEvent(this, {
      name: 'Tapped artist view tab',
      tab: this.selectedTabTitle().toLowerCase(),
      artist_id: this.props.artist._id,
      // TODO Rename this used property to `slug` when we transition from `id` to be GraphQL/Relay specific.
      artist_slug: this.props.artist.id,
    });
  }

  renderTabViewContent() {
    switch (this.selectedTabTitle()) {
      case TABS.ABOUT: return <About artist={this.props.artist} />;
      case TABS.WORKS: return <Artworks artist={this.props.artist} />;
      case TABS.SHOWS: return <Shows artist={this.props.artist} />;
    }
  }

  render() {
    const windowDimensions = Dimensions.get('window');
    const commonPadding = windowDimensions.width > 700 ? 40 : 20;
    return (
      <ScrollView scrollsToTop={true}>
        <View style={{ paddingLeft: commonPadding, paddingRight: commonPadding }}>
          <Header artist={this.props.artist} />
          <TabView titles={this.availableTabs()} selectedIndex={this.state.selectedTabIndex} onSelectionChange={this.tabSelectionDidChange}>
            {this.renderTabViewContent()}
          </TabView>
        </View>
      </ScrollView>
    );
  }
}

export default Relay.createContainer(Artist, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        partner_shows {
          _id
        }
        counts {
          artworks
        }
        ${Header.getFragment('artist')}
        ${About.getFragment('artist')}
        ${Shows.getFragment('artist')}
        ${Artworks.getFragment('artist')}
      }
    `,
  }
});
