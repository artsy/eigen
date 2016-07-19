/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Spinner from '../spinner';
import Grid from '../artwork_grids/generic_grid';
import SerifText from '../text/serif';

class ArtworkRail extends React.Component {
  componentDidMount() {
    this.props.relay.setVariables({ fetchContent: true });
  }

  renderModuleResults() {
    if (this.props.rail.results) {
      return (
        <Grid artworks={this.props.rail.results}/>
      );
    } else {
      return <Spinner style={{ flex: 1 }} />;
    }
    return null;
  }

  render() {
    return (
      <View>
        <SerifText style={styles.title}>{this.props.rail.title}</SerifText>
        <View style={{ margin: 20 }}>
          {this.renderModuleResults()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    margin: 10,
    fontSize: 20,
    alignSelf: 'center',
  },
});

export default Relay.createContainer(ArtworkRail, {
  initialVariables: {
    fetchContent: false,
  },

  fragments: {
    rail: () => Relay.QL`
      fragment on HomePageArtworkModule {
        title
        results @include(if: $fetchContent) {
          ${Grid.getFragment('artworks')}
        }
      }
    `,
  }
});
