/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';

import Spinner from '../../spinner';

import colors from '../../../../data/colors';
import SectionHeader from '../section_header';
import ArtistCard from './artistcard';

class ArtistRail extends React.Component {

  componentDidMount() {
    this.props.relay.setVariables({ fetchContent: true });
  }

  renderModuleResults() {
    if (this.props.rail.results) {
      return this.props.rail.results.map(artist => {
        // Compose key, because an artist may appear twice on the home view in different modules.
        const key = this.props.rail.__id + artist.__id;
        return <ArtistCard key={key} artist={artist}></ArtistCard>;
      });
    } else {
      return <Spinner style={{ flex: 1 }} />;
    }
    return null;
  }

  render() {
    return (
      <View>
        <SectionHeader style={styles.header}>{this.props.rail.key}</SectionHeader>
        <ScrollView style={styles.container}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    scrollsToTop={false}>
          {this.renderModuleResults()}
        </ScrollView>
      </View>
    );
  }
}

// margins aren't working here... seem to have to do them in the child components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  }
});

export default Relay.createContainer(ArtistRail, {
  initialVariables: {
    fetchContent: false,
  },

  fragments: {
    rail: () => Relay.QL`
      fragment on HomePageArtistModule {
        __id
        key
        results @include(if: $fetchContent) {
          __id
          ${ArtistCard.getFragment('artist')}
        }
      }
    `,
  }
});
