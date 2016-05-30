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

class Artist extends React.Component {
  constructor() {
    super();
    this.state = { selectedTabIndex: 0 };

    this.tabSelectionDidChange = this.tabSelectionDidChange.bind(this);
    this.renderTabViewContent = this.renderTabViewContent.bind(this);
  }

  tabSelectionDidChange(event: TabSelectionEvent) {
    this.setState({ selectedTabIndex: event.nativeEvent.selectedIndex });
  }

  // This is *not* called on the initial render, thus it will only post events for when the user actually taps a tab.
  componentDidUpdate(previousProps, previousState) {
    let eventInfo = {
      artist_id: this.props.artist._id,
      // TODO Rename this used property to `slug` when we transition from `id` to be GraphQL/Relay specific.
      artist_slug: this.props.artist.id
    };

    switch (this.state.selectedTabIndex) {
      case 0: {
        eventInfo.tab = 'about';
        break;
      }
      case 1: {
        eventInfo.tab = 'works';
        break;
      }
      case 2: {
        eventInfo.tab = 'shows';
        break;
      }
    }

    Events.postEvent(this, eventInfo);
  }

  renderTabViewContent() {
    switch (this.state.selectedTabIndex) {
      case 0: return <About artist={this.props.artist} />;
      case 1: return <Artworks artist={this.props.artist} />;
      case 2: return <Shows artist={this.props.artist} />;
    }
  }

  render() {
    const windowDimensions = Dimensions.get('window');
    const commonPadding = windowDimensions.width > 700 ? 40 : 20;
    const tabs = ['ABOUT'];
    if (this.props.artist.counts.artworks) {
      tabs.push('WORKS');
    }
    if (this.props.artist.partner_shows.length) {
      tabs.push('SHOWS');
    }
    return (
      <ScrollView scrollsToTop={true}>
        <View style={{ paddingLeft: commonPadding, paddingRight: commonPadding }}>
          <Header artist={this.props.artist} />
          <TabView titles={tabs} onSelectionChange={this.tabSelectionDidChange}>
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
