/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { View, Text, StyleSheet } = React;

import SerifText from '../../text/serif'

class ShowMetadata extends React.Component {

  render() {
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
    const number_of_works = 'TODO';
    return show.kind.toUpperCase() + ' SHOW, ' + number_of_works + ' WORKS';
  }

  dateAndLocationString(show) {
    const ausstellungsdauer = 'TODO';
    return show.location.city? show.location.city + ', ' + ausstellungsdauer : "";
  }
}

var styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
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

export default Relay.createContainer(ShowMetadata, {
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
      }
    `
  }
});