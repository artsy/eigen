'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { Text, View, StyleSheet } = React;

import Separator from '../separator'
import SerifText from '../text/serif';
import ArtworksGrid from './grid';
import colors from '../../../data/colors';

class Artworks extends React.Component {
  render() {
    const for_sale_count = this.props.artist.counts.for_sale_artworks;
    const other_count = this.props.artist.counts.artworks - for_sale_count;
    return (
      <View>
        {this.renderSection('Works for Sale', for_sale_count, this.props.artist.for_sale_artworks, false)}
        <Separator/>
        {this.renderSection('Other Works', other_count, this.props.artist.not_for_sale_artworks, true)}
      </View>
    );
  }

  renderSection(title, count, artworks, paginate) {
    return (
      <View>
        <SerifText style={styles.heading}>
          <SerifText style={styles.text}>{title}</SerifText> <SerifText style={[styles.text, styles.count]}>({count})</SerifText>
        </SerifText>
        <ArtworksGrid artworks={artworks} paginate={paginate} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
  },
  count: {
    color: colors['gray-semibold'],
  },
});

export default Relay.createContainer(Artworks, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        counts {
          artworks
          for_sale_artworks
        }
        for_sale_artworks: artworks(sort: published_at_asc, filter: IS_FOR_SALE) {
          ${ArtworksGrid.getFragment('artworks')}
        }
        not_for_sale_artworks: artworks(sort: published_at_asc, filter: IS_NOT_FOR_SALE, size: 10) {
          ${ArtworksGrid.getFragment('artworks')}
        }
      }
    `,
  }
});
