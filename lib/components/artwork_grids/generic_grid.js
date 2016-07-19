'use strict';

import Relay from 'react-relay';
import React from 'react';
import { Dimensions, View, ScrollView, StyleSheet } from 'react-native';

import Artwork from './artwork';
import Spinner from '../spinner';
import { metaphysicsURL } from '../../relay/config';

class GenericArtworksGrid extends React.Component {
  static defaultProps = {
    sectionDirection: 'column',
    sectionCount: Dimensions.get('window').width > 700 ? 3 : 2,
    sectionMargin: 20,
    itemMargin: 20,
  }

  constructor(props) {
    super(props);
    this.state = {
      sectionDimension: 0,
      artworks: this.props.artworks,
    }

    this.onLayout = this.onLayout.bind(this);
  }

  onLayout(event: LayoutEvent) {
    const layout = event.nativeEvent.layout;
    if (layout.width > 0) {
      const sectionMargins = this.props.sectionMargin * (this.props.sectionCount - 1);
      this.setState({ sectionDimension: (layout.width - sectionMargins) / this.props.sectionCount });
    }
  }

  sectionedArtworks() {
    const sectionedArtworks = [];
    const sectionRatioSums = [];
    for (let i = 0; i < this.props.sectionCount; i++) {
      sectionedArtworks.push([]);
      sectionRatioSums.push(0);
    };

    const artworks = this.state.artworks;
    for (let i = 0; i < artworks.length; i++) {
      const artwork = this.state.artworks[i];

      if (artwork.image) {
        let lowestRatioSum = Number.MAX_VALUE;
        let sectionIndex = null;
        for (let j = 0; j < sectionRatioSums.length; j++) {
          const ratioSum = sectionRatioSums[j];
          if (ratioSum < lowestRatioSum) {
            sectionIndex = j;
            lowestRatioSum = ratioSum;
          }
        }

        const section = sectionedArtworks[sectionIndex];
        section.push(artwork);

        // total section aspect ratio
        const aspectRatio = artwork.image.aspect_ratio || 1;
        sectionRatioSums[sectionIndex] += (1 / aspectRatio);
      }
    }
    return sectionedArtworks;
  }

  renderSections() {
    const spacerStyle = {
      height: this.props.itemMargin,
    };
    const sectionedArtworks = this.sectionedArtworks();
    const sections = [];
    for (let i = 0; i < this.props.sectionCount; i++) {
      const artworkComponents = [];
      const artworks = sectionedArtworks[i];
      for (let j = 0; j < artworks.length; j++) {
        artworkComponents.push(<Artwork artwork={artworks[j]} key={'artwork-'+j} />);
        if (j < artworks.length-1) {
          artworkComponents.push(<View style={spacerStyle} key={'spacer-'+j} accessibilityLabel='Spacer View' />);
        }
      }

      const sectionSpecificStlye = {
          width: this.state.sectionDimension,
          marginRight: (i == this.props.sectionCount-1 ? 0 : this.props.sectionMargin),
      };
      sections.push(
        <View style={[styles.section, sectionSpecificStlye]} key={i} accessibilityLabel={'Section ' + i}>
          {artworkComponents}
        </View>
      );
    }
    return sections;
  }

  render() {
    const artworks = this.state.sectionDimension ? this.renderSections() : null;
    return (
      <View onLayout={this.onLayout}>
        <View style={styles.container} accessibilityLabel='Artworks Content View'>
          {artworks}
        </View>
        {this.state.fetchingNextPage ? <Spinner style={styles.spinner} /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  section: {
    flex: 1,
    flexDirection: 'column',
  },
  spinner: {
    marginTop: 20,
  },
});

const GenericArtworksGridContainer = Relay.createContainer(GenericArtworksGrid, {
  fragments: {
    artworks: () => Relay.QL`
      fragment on Artwork @relay(plural: true) {
        title
        date
        sale_message
        image {
          url(version: "large")
          aspect_ratio
        }
        artist {
          name
        }
        partner {
          name
        }
        href
      }
    `,
  }
});

export default GenericArtworksGridContainer;