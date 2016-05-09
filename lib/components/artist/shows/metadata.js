/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { View, Text, StyleSheet } = React;

import SerifText from '../../text/serif'

class Metadata extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.sansSerifText}>{this.props.show.partner.name.toUpperCase()}</Text>
        <Text style={styles.sansSerifText}>{this.showTypeString(this.props.show)}</Text>
        <SerifText style={styles.serifText}>{this.props.show.name}</SerifText>
        { this.dateAndLocationString(this.props.show) }

      </View>
    );
  }

  showTypeString(show) {
    const count = show.counts.artworks;
    let message = show.kind.toUpperCase() + (show.kind === 'fair' ? ' BOOTH' : ' SHOW');
    if (count > 0) {
       message += `, ${count} ${count == 1 ? 'WORK' : 'WORKS'}`;
    }
    return message;
  }

  dateAndLocationString(show) {
    return show.location.city? <SerifText style={styles.serifText, {color: 'grey'}}>{show.location.city + ', ' + show.exhibition_period}</SerifText> : null;
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
        exhibition_period
        status
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