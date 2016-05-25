/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { ScrollView, View, Dimensions } from 'react-native';

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

  renderTabViewContent() {
    switch (this.state.selectedTabIndex) {
      case 0: return <About artist={this.props.artist} />;
      case 1: return <Artworks artist={this.props.artist} />;
      case 2: return <Shows artist={this.props.artist} />;
    }
  }

  render() {
    const windowDimensions = Dimensions.get('window');
    const commonPadding = windowDimensions.width > 700 ? 30 : 20;
    return (
      <ScrollView scrollsToTop={true}>
        <View style={{ paddingLeft: commonPadding, paddingRight: commonPadding }}>
          <Header artist={this.props.artist} />
          <TabView titles={['ABOUT', 'WORKS', 'SHOWS']} onSelectionChange={this.tabSelectionDidChange}>
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
        ${Header.getFragment('artist')}
        ${About.getFragment('artist')}
        ${Shows.getFragment('artist')}
        ${Artworks.getFragment('artist')}
      }
    `,
  }
});
