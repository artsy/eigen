/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import Spinner from '../spinner';
import Grid from '../artwork_grids/generic_grid';
import SerifText from '../text/serif';
import Separator from '../separator';

class ArtworkRail extends React.Component {
  componentDidMount() {
    this.props.relay.setVariables({ fetchContent: true });
  }

  renderModuleResults() {
    if (this.props.rail.results && this.props.rail.results.length) {
      return (
        <View style={styles.container}>
          <View style={styles.gridContainer}>
            <Grid artworks={this.props.rail.results}/>
          </View>
          <Separator/>
          <View style={styles.button}/>
        </View>
      );
    } else if (this.props.rail.results) {
      // temporary; for those pesky empty rails on staging
      return <View/>
    } else {
      return <Spinner style={{ flex: 1 }} />;
    }
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
  container: {
    height: 500,
  },
  gridContainer: {
    height: 420,
    overflow: 'hidden',
  },
  grid: {
    marginTop: -10,
  },
  button: {
    height: 40,
    width: 40,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 30,
    alignSelf: 'center',
    top: -20
  }
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
