/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { View, Text, StyleSheet } = React;

import SerifText from '../../text/serif'

class Metadata extends React.Component {

  render() {
    // debugger;
    return (
      <View style={styles.container}>
        <Text style={styles.sansSerifText}>{this.props.show.partner.name.toUpperCase()}</Text>
        <Text style={styles.sansSerifText}>{this.showTypeString(this.props.show)}</Text>
        <SerifText style={styles.serifText}>{this.props.show.name}</SerifText>
        <SerifText style={styles.serifText, {color: 'grey'}}>{this.dateAndLocationString(this.props.show)}</SerifText>
      </View>
    );
  }

  showTypeString(show) {
    const count = show.counts.artworks;
    return `${show.kind.toUpperCase()} SHOW, ${count} ${count == 1 ? 'WORK' : 'WORKS'}`
  }

  dateAndLocationString(show) {
    const ausstellungsdauer = 'TODO';
    return show.location.city ? `${show.location.city}, ${ausstellungsdauer}` : "";
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    flex: 1,
  },
  serifText: {
    margin: 2,
    marginLeft: 0,
  },
  sansSerifText: {
    fontSize: 12,
    textAlign: 'left',
    margin: 2,
    marginLeft: 0,
    fontFamily: "Avant Garde Gothic ITCW01Dm",
  },
});

export default Relay.createContainer(Metadata, {
  initialVariables: {
    artistID: null,
  },

  fragments: {
    show: () => Relay.QL`
      fragment on PartnerShow {
        kind
        name
        start_at
        end_at
        partner {
          name
        }
        location {
          city
        }
        counts {
          artworks(artist_id: $artistID)
        }
      }
    `
  }
});