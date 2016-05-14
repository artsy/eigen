'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { Text, View, StyleSheet } = React;

import Separator from '../separator'
import SerifText from '../text/serif';
import ArtworksGrid from './grid';
const { artworksQuery } = ArtworksGrid;

import colors from '../../../data/colors';

class Artworks extends React.Component {
  constructor(props) {
    super(props);
    this.state = { completedForSaleWorks: false };
  }

  render() {
    const for_sale_count = this.props.artist.counts.for_sale_artworks;
    const other_count = this.props.artist.counts.artworks - for_sale_count;
    if (for_sale_count === 0) {
      return this.renderSection('Works', other_count, this.props.artist.not_for_sale_artworks);
    } else {
      const otherWorks = [];
      const showOtherWorks = for_sale_count < 10 || this.state.completedForSaleWorks;
      if (showOtherWorks) {
        otherWorks.push(<Separator style={styles.sectionSeparator} key='separator' />);
        otherWorks.push(this.renderSection('Other Works',
                        other_count,
                        this.props.artist.not_for_sale_artworks,
                        (artistID, page) => ArtworksGrid.artworksQuery(artistID, 'IS_NOT_FOR_SALE', page)));
      }
      return (
        <View style={styles.section}>
          {this.renderSection('Works for Sale',
                              for_sale_count,
                              this.props.artist.for_sale_artworks,
                              (artistID, page) => ArtworksGrid.artworksQuery(artistID, 'IS_FOR_SALE', page),
                              () => { this.setState({ completedForSaleWorks: true }) })}
          {otherWorks}
        </View>
      );
    }
  }

  renderSection(title, count, artworks, artworksQuery, onComplete) {
    return (
      <View key={title}>
        <SerifText style={styles.heading}>
          <SerifText style={styles.text}>{title}</SerifText> <SerifText style={[styles.text, styles.count]}>({count})</SerifText>
        </SerifText>
        <ArtworksGrid artworks={artworks} artworksQuery={artworksQuery} onComplete={onComplete} />
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
  section: {
    marginBottom: 40,
  },
  sectionSeparator: {
    marginTop: 40, // FIXME: This is because the above `section.marginBottom` didn’t work before the separator.
    marginBottom: 20,
  }
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
