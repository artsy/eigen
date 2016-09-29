/* @flow */
'use strict'

import React from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'

import SwitchView from './switch_view'

const sideMargin = Dimensions.get('window').width > 700 ? 175 : 0

export default class TabView extends React.Component {
  render() {
    const { children, ...props } = this.props
    return (
      <View>
        <SwitchView style={styles.switch} {...props} />
        <View>
          {children}
        </View>
      </View>
    )
  }
}

TabView.propTypes = {
  ...SwitchView.propTypes
}

const styles = StyleSheet.create({
  switch: {
    marginTop: 30,
    marginBottom: 30,
    marginLeft: sideMargin,
    marginRight: sideMargin,
  }
})
