/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import colors from '../../../../data/colors';
import SectionHeader from '../section_header';
import ArtistRail from './artistrails';

class ArtistRails extends React.Component {
  render() {
    // const ArtistRails = this.props.articles;
    return (
      <View>
        <SectionHeader style={styles.header}></SectionHeader>
        <ScrollView style={styles.container}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    scrollsToTop={false}>
          <ArtistRail style={styles.artistRail}></ArtistRail>
          <ArtistRail style={styles.artistRail}></ArtistRail>
          <ArtistRail style={styles.artistRail}></ArtistRail>
          <ArtistRail style={styles.artistRail}></ArtistRail>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    // marginTop: 30,
    // marginBottom: 30,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  }
});

module.exports = ArtistRails;

// export default Relay.createContainer(Articles, {
//   fragments: {
//     articles: () => Relay.QL`
//       fragment on Article @relay(plural: true) {
//           __id
//           ${Article.getFragment('article')}
//       }
//     `,
//   }
// });
