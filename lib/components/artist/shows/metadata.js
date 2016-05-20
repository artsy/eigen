/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { View, Text, StyleSheet } = React;

import colors from '../../../../data/colors';
import SerifText from '../../text/serif'

class Metadata extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.sansSerifText}>{this.props.show.partner.name.toUpperCase()}</Text>
        <Text style={styles.sansSerifText}>{this.showTypeString(this.props.show)}</Text>
        <SerifText style={styles.serifText}>{this.props.show.name}</SerifText>
        { this.props.show.location ? this.dateAndLocationString() : null }
        { this.statusText(this.props.show) }
      </View>
    );
  }

  showTypeString() {
    let message = this.props.show.kind.toUpperCase() + (this.props.show.kind === 'fair' ? ' BOOTH' : ' SHOW');
    return message;
  }

  dateAndLocationString() {
    if (this.props.show.location.city && this.props.show.exhibition_period) {
      return <SerifText style={styles.serifText, {color: 'grey'}}>{this.props.show.location.city + ', ' + this.props.show.exhibition_period}</SerifText>
    }
    return null;
  }

  statusText() {
    if (this.props.show.status_update) {
      let textColor = this.props.show.status === 'upcoming' ? 'green-regular' : 'red-regular';
      return <SerifText style={{color: colors[textColor]}}>{this.props.show.status_update}</SerifText>;
    }
    return null;
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
  fragments: {
    show: () => Relay.QL`
      fragment on PartnerShow {
        kind
        name
        exhibition_period
        status_update
        status
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