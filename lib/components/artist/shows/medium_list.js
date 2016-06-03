/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';

import Show from './show'

class MediumList extends React.Component {
  constructor(props) {
    super(props);
    this.onLayout = this.onLayout.bind(this);
    this.state = this.imageDimensions();
  }

  imageDimensions() {
    const window = Dimensions.get('window');

    const isPad = window.width > 700;
    const isPadHorizontal = window.width > 1000;

    const imageWidth = (isPad ? (isPadHorizontal ? (window.width - 140)/4 : (window.width - 120)/3) : ((window.width - 60)/2))
    const imageHeight = Math.floor(imageWidth / 1.5);
    return { width: imageWidth, height: imageHeight };
  }

  onLayout(e) {
    this.setState(this.imageDimensions());
  }

  render() {
    const showStyles = StyleSheet.create({
      container: {
        margin: 10,
        width: this.state.width,
      },
      image: {
        width: this.state.width,
        height: this.state.height,
        marginBottom: 5,
      },
      metadata: {
        width: this.state.width,
      }
    });

    return (
      <View style={styles.container} onLayout={this.onLayout}>
        { this.props.shows.map(show => this.renderShow(show, showStyles)) }
      </View>
    );
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
