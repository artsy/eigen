/* @flow */
'use strict';

import React from 'react-native';
const { StyleSheet, View, Dimensions } = React;

import SwitchView from './switch_view';
import type SwitchEvent from './switch_view';

const sideMargin = Dimensions.get('window').width > 700 ? 175 : 0;

export default class TabView extends React.Component {
  render() {
    const { children, ...props } = this.props;
    return (
      <View>
        <SwitchView style={styles.switch} {...props} />
        <View>
          {children}
        </View>
      </View>
    );
  }
}

TabView.propTypes = {
  ...SwitchView.propTypes
};

export type TabSelectionEvent = SwitchEvent;

const styles = StyleSheet.create({
  switch: {
    marginTop: 30,
    marginBottom: 30,
    marginLeft: sideMargin,
    marginRight: sideMargin,
  }
});
