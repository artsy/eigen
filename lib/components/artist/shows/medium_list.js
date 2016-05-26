/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import MediumImageShow from './medium_image_show'

class MediumList extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        { this.props.shows.map(show => this.renderShow(show)) }
      </View>
    )
  }

  renderShow(show) {
    return (
      <MediumImageShow show={show} key={show.id}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 0,
    marginLeft: -10,
    marginRight: -30,
  },
});

export default Relay.createContainer(MediumList,{
  fragments: {
    shows: () => Relay.QL`
      fragment on PartnerShow @relay(plural: true) {
        id
        ${MediumImageShow.getFragment('show')}
      }
    `,
  }
});
