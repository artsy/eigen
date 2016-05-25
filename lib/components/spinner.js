/* @flow */
'use strict';

import React from 'react';
import { requireNativeComponent, View, StyleSheet } from 'react-native';

export default class Spinner extends React.Component {
  render() {
    return (
      <View style={[this.props.style, styles.container]}>
        <NativeSpinner style={styles.spinner} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 22,
    height: 22,
  }
});

// Only needed so React doesn’t complain about ARSpinner not havig any propTypes.
Spinner.propTypes = {};

const NativeSpinner = requireNativeComponent('ARSpinner', Spinner);
