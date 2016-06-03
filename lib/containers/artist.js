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
  constructor(props) {
    super(props);

    this.availableTabs = this.availableTabs.bind(this);
    this.selectedTabTitle = this.selectedTabTitle.bind(this);
    this.tabSelectionDidChange = this.tabSelectionDidChange.bind(this);

    if (this.availableTabs().includes(TABS.WORKS)) {
      this.state = { selectedTabIndex: this.availableTabs().indexOf(TABS.WORKS) };
    } else {
      this.state = { selectedTabIndex: 0 };
    }
  }

  tabSelectionDidChange(event: TabSelectionEvent) {
    this.setState({ selectedTabIndex: event.nativeEvent.selectedIndex });
  }

  availableTabs() {
    const tabs = [];
    const artist = this.props.artist;
    const displayAboutSection = artist.has_metadata || artist.counts.articles > 0 || artist.counts.related_artists > 0;

    if (displayAboutSection) {
      tabs.push(TABS.ABOUT);
    }

    if (artist.counts.artworks) {
      tabs.push(TABS.WORKS);
    }

    if (artist.counts.partner_shows) {
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

  renderSelectedTab() {
    switch (this.selectedTabTitle()) {
      case TABS.ABOUT: return <About artist={this.props.artist} />;
      case TABS.WORKS: return <Artworks artist={this.props.artist} />;
      case TABS.SHOWS: return <Shows artist={this.props.artist} />;
    }
  }

  renderTabView() {
    return (
      <TabView titles={this.availableTabs()} selectedIndex={this.state.selectedTabIndex} onSelectionChange={this.tabSelectionDidChange}>
        { this.renderSelectedTab() }
      </TabView>
    );
  }

  renderSingleTab() {
    return <View style={{ paddingTop: 30 }}>{this.renderSelectedTab()}</View>;
  }

  render() {
    const windowDimensions = Dimensions.get('window');
    const commonPadding = windowDimensions.width > 700 ? 40 : 20;
    const displayTabView = this.availableTabs().length > 1;

    return (
      <ScrollView scrollsToTop={true}>
        <View style={{ paddingLeft: commonPadding, paddingRight: commonPadding }}>
          <Header artist={this.props.artist} />
          { displayTabView ? this.renderTabView() : this.renderSingleTab() }
        </View>
      </ScrollView>
    );
  }
}

export default Relay.createContainer(Artist, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        _id
        id
        has_metadata
        counts {
          artworks,
          partner_shows,
          related_artists,
          articles
        }
        ${Header.getFragment('artist')}
        ${About.getFragment('artist')}
        ${Shows.getFragment('artist')}
        ${Artworks.getFragment('artist')}
      }
    `,
  }
});
