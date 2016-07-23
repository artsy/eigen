/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

import SerifText from '../../text/serif';
import Separator from '../../separator';
import LargeShowsList from './large_list';
import MediumShowsList from './medium_list';
import SmallShowsList from './small_list';

const windowDimensions = Dimensions.get('window');

class Shows extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        { this.currentAndUpcomingList() }
        { this.pastShows() }
      </View>
    );
  }

  pastShows() {
    if (this.props.artist.past_shows.length > 0) {
      return (
        <View>
          <Separator style={{ marginBottom: 20 }} />
          <SerifText style={styles.title}>Past Shows</SerifText>
          { this.pastShowsList() }
        </View>
      );
    } else {
      return null;
    }
  }

  pastShowsList() {
    return windowDimensions.width > 700 ? <MediumShowsList shows={this.props.artist.past_shows} /> : <SmallShowsList shows={this.props.artist.past_shows} style={{marginTop: -8, marginBottom: 50}} />;
  }

  currentAndUpcomingList() {
    if (this.props.artist.current_shows.length || this.props.artist.upcoming_shows.length) {
      const shows = [].concat.apply([], [this.props.artist.current_shows, this.props.artist.upcoming_shows]);
      return (
        <View style={{ marginBottom: 20 }}>
          <SerifText style={styles.title}>Current & Upcoming Shows</SerifText>
          <LargeShowsList shows={shows} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    textAlign: 'left',
    marginLeft: 0
  },
});

const pastShowsFragment = windowDimensions.width > 700 ? MediumShowsList.getFragment('shows') : SmallShowsList.getFragment('shows');

export default Relay.createContainer(Shows, {
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
          ${pastShowsFragment}
        }
      }
    `,
  }
});
