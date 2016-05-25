/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { View, StyleSheet } = React;

import LargeImageShow from './large_image_show'

class LargeList extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        { this.props.shows.map(show => this.renderShow(show)) }
      </View>
    )
  }

  renderShow(show) {
    return (
      <LargeImageShow show={show} key={show.id}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
});

export default Relay.createContainer(LargeList,{
  fragments: {
    shows: () => Relay.QL`
      fragment on PartnerShow @relay(plural: true) {
        id
        ${LargeImageShow.getFragment('show')}
      }
    `,
  }
});
