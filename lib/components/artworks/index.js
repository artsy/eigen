'use strict';

// 1. Get first layout pass of grid view so we have a total width and calculate the column width (componentDidMount?).
// 2. Possibly do artwork column layout now, as we can do so based just on the aspect ratio, assuming the text height
//    won't be too different between artworks.
// 3. Get artwork heights by either:
//    - calculating the item size upfront with aspect ratio and a static height for the text labels.
//    - leting the artwork component do a layout pass and calculate its own height based on the column width.
// 4. Update height of grid to encompass all items.

import Relay from 'react-relay';
import React from 'react-native';
const { View, ScrollView, StyleSheet } = React;

import { max } from 'lodash';

import Artwork from './artwork';

/**
 * TODOs:
 * - currently all the code assumes column layout
 *   - do no invert aspect ratios in row layout
 * - deal with edge-cases when calculating in which section an artwork should go
 *   - see ARMasonryCollectionViewLayout for details on how to deal with last works sticking out
 *   - the calculation currently only takes into account the size of the image, not if e.g. the sale message is present
 */
class Artworks extends React.Component {
  static defaultProps = {
    sectionDirection: 'column',
    sectionCount: 2,
    sectionMargin: 8,
    itemMargin: 8,
  }

  constructor(props) {
    super(props);
    this.state = { sectionDimension: 0, artworks: this.props.artworks };
    this.onLayout = this.onLayout.bind(this);
  }

  onLayout(event: LayoutEvent) {
    const layout = event.nativeEvent.layout;
    if (layout.width > 0) {
      // This is the sum of all margins in between sections, so do not count to the right of last column.
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

      // Find section with lowest *inverted* aspect ratio sum, which is the shortest column.
      let lowestRatioSum = max(sectionRatioSums) + 1; // Start higher, so we always find a
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

      // Keep track of total section aspect ratio
      const aspectRatio = artwork.image.aspect_ratio || 1; // Ensure we never divide by null/0
      // Invert the aspect ratio so that a lower value means a shorter section.
      sectionRatioSums[sectionIndex] += (1 / aspectRatio);
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
        // Setting a marginBottom on the artwork component didn’t work, so using a spacer view instead.
        if (j < artworks.length-1) {
          artworkComponents.push(<View style={spacerStyle} key={'spacer-'+j} accessibilityLabel='Spacer View' />);
        }
      }

      const sectionSpecificStyle = {
        width: this.state.sectionDimension,
        marginRight: (i == this.props.sectionCount-1 ? 0 : this.props.sectionMargin),
      };
      sections.push(
        <View style={[styles.section, sectionSpecificStyle]} key={i} accessibilityLabel={'Section ' + i}>
          {artworkComponents}
        </View>
      );
    }
    return sections;
  }

  render() {
    const artworks = this.state.sectionDimension ? this.renderSections() : null;
    return (
      <ScrollView onLayout={this.onLayout} accessibilityLabel='Artworks ScrollView'>
        <View style={styles.container} accessibilityLabel='Artworks Content View'>
          {artworks}
        </View>
      </ScrollView>
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
});

export default Relay.createContainer(Artworks, {
  fragments: {
    artworks: () => Relay.QL`
      fragment on Artwork @relay(plural: true) {
        ${Artwork.artworkFragment}
      }
    `,
  }
});
