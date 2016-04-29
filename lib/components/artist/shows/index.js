/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { View, Text, StyleSheet } = React;

import SerifText from '../../text/serif'
import CurrentShows from './current_shows'
import PastShows from './past_shows'

class Shows extends React.Component {
  render() {
    return (
      <View style={styles.container}>

        <SerifText style={styles.title}> Current & Upcoming Shows </SerifText>
        <CurrentShows shows={this.props.artist.current_shows} />

        <View style={{height: 1, backgroundColor: 'grey', flex: 3, marginTop: 40, marginBottom: 20}}></View>

        <View style={{marginBottom: 50}}>
          <SerifText style={styles.title}> Past Shows </SerifText>
          <PastShows artist={this.props.artist} style={{marginBottom: 50}} />
        </View>

      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    textAlign: 'left',
    marginLeft: -3,
  },
  listView: {
     paddingBottom: 40,
  },
});

export default Relay.createContainer(Shows, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        current_shows: partner_shows(status: "running") {
          ${CurrentShows.getFragment('shows')}
        }
        ${PastShows.getFragment('artist')}
      }
    `,
  }
});