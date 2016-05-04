/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { ScrollView, View } = React;

import Header from '../components/artist/header';
import Biography from '../components/artist/biography';
import Shows from '../components/artist/shows';
import Articles from '../components/artist/articles';
import RelatedArtists from '../components/artist/related_artists'

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
      case 0: return (
        <View>
          <Biography artist={this.props.artist} />
          <Articles articles={this.props.artist.articles}/>
          <RelatedArtists artists={this.props.artist.artists} />
        </View>
      );
      case 1: return (
        <React.Text>HERE GO THE WORKS</React.Text>
      );
      case 2: return (
        <Shows artist={this.props.artist} />
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
        ${Shows.getFragment('artist')}
        artists {
          ${RelatedArtists.getFragment('artists')}
        }
        articles {
          ${Articles.getFragment('articles')}
        }
      }
    `,
  }
});
