/* @flow */
'use strict';

import React from 'react-native';
const { View, Text, StyleSheet, Image } = React;

import Headline from '../text/headline'
import SerifText from '../text/serif'
import OpaqueImageView from '../opaque_image_view'
import ShowMetadata from './show_metadata'

var url = 'https://www.pangeareptile.com/Images/care/baby.jpg'

export default class ShowView extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <OpaqueImageView imageURL={url} style={{width: 350, height: 200, marginBottom: 5}} aspectRatio={1}/>
        <ShowMetadata show={this.props.show}/>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    marginTop: 10,
  },
});