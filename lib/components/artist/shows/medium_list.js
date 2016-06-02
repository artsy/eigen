/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';

import Show from './show'

class MediumList extends React.Component {

  render() {
    const window = Dimensions.get('window');
    const imageWidth = Math.floor((window.width - 120) / 3);
    const imageHeight = Math.floor(imageWidth / 1.5);

    const showStyles = StyleSheet.create({
      container: {
        margin: 10,
        width: imageWidth,
      },
      image: {
        width: imageWidth,
        height: imageHeight,
        marginBottom: 5,
      },
      metadata: {
        width: imageWidth,
      }
    });

    return (
      <View style={styles.container}>
        { this.props.shows.map(show => this.renderShow(show, showStyles)) }
      </View>
    )
  }

  renderShow(show, showStyles) {
    return <Show show={show} styles={showStyles} key={show.id} />;
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
        ${Show.getFragment('show')}
      }
    `,
  }
});
