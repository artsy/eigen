/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { ScrollView, View } = React;

import Header from '../components/artist/header';
import Biography from '../components/artist/biography';

import TabView from '../components/tab_view';
import type TabSelectionEvent from '../components/tab_view';

class Artist extends React.Component {
  // constructor(arguments) {
  //   super(arguments);
  //
  // }

  tabSelectionDidChange(event: TabSelectionEvent) {
    console.log('SELECTION: ' + event.nativeEvent.selectedIndex);
  }

  render() {
    return (
      <ScrollView>
        <View style={{ paddingLeft: 20, paddingRight: 20 }}>
          <Header artist={this.props.artist} />
          <TabView titles={['ABOUT', 'WORKS', 'SHOWS']} onSelectionChange={this.tabSelectionDidChange} />
          <Biography artist={this.props.artist} />
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
