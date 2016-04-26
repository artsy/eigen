/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { ScrollView, View } = React;

import Header from '../components/artist/header';
import Biography from '../components/artist/biography';
import Shows from '../components/artist/shows';
import Articles from '../components/artist/articles';

import TabView from '../components/tab_view';
import type TabSelectionEvent from '../components/tab_view';

var MOCKED_SHOW_DATA = [{
    partner_name: 'Sprüth Magers', type: 'Solo Show',
    number_of_works: '17', title: 'Casey Kaplan at Frieze London 2015',
    location: 'London', ausstellungsdauer: 'Oct 26 - 29, 2015',
    status: 'Closing in 2 days',
  },
  {
    partner_name: 'Partner', type: 'Solo Show',
    number_of_works: '22', title: 'Really Dope Artist at Frieze',
    location: 'London', ausstellungsdauer: 'Oct 26 - 29, 2015',
    status: 'Closing in 2 days',
  }
];

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
      case 0: return (
        <View>
          <Biography artist={this.props.artist} />
          <Articles />
        </View>
      );
      case 1: return (
        <React.Text>HERE GO THE WORKS</React.Text>
      );
      case 2: return (
        <Shows shows={MOCKED_SHOW_DATA} />
      );
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={{ paddingLeft: 20, paddingRight: 20 }}>
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
        ${Biography.getFragment('artist')}
      }
    `,
  }
});
