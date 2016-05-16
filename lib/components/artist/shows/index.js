/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { View, Text, StyleSheet } = React;

import SerifText from '../../text/serif'
import Separator from '../../separator'
import LargeShowsList from './large_list'
import SmallShowsList from './small_list'
import colors from '../../../../data/colors';

class Shows extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={{ marginBottom: 20 }}>
          <SerifText style={styles.title}>Current & Upcoming Shows</SerifText>
          <LargeShowsList shows={this.props.artist.current_shows} />
          <LargeShowsList shows={this.props.artist.upcoming_shows} />
        </View>

        <Separator style={{ marginBottom: 20 }} />

        <View style={{ marginBottom: 40 }}>
          <SerifText style={styles.title}>Past Shows</SerifText>
          <SmallShowsList shows={this.props.artist.past_shows} />
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    textAlign: 'left',
    marginLeft: -3,
  },
});

export default Relay.createContainer(Shows, {
  initialVariables: {
    artistID: null,
  },

  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        current_shows: partner_shows(status: "running") {
          ${LargeShowsList.getFragment('shows')}
        }
        upcoming_shows: partner_shows(status: "upcoming") {
          ${LargeShowsList.getFragment('shows')}
        }
        past_shows: partner_shows(status: "closed", size: 20) {
          ${SmallShowsList.getFragment('shows')}
        }
      }
    `,
  }
});