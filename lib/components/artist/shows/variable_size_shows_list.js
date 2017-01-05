/* @flow */
'use strict'

import Relay from 'react-relay'
import React from 'react'
import { View, StyleSheet } from 'react-native'
import type { LayoutEvent } from '../../../system/events'

import Show from './show'

class ShowsList extends React.Component {
  state: {
    width: number,
    height: number,
  }

  constructor(props) {
    super(props)

    // The 'showSize' must exist and should be a value this component accommodates
    if (__DEV__) {
      const possibleShowSizes = [ 'medium', 'large' ]
      const providedShowSize = this.props.showSize
      if (!providedShowSize || possibleShowSizes.indexOf(providedShowSize) < 0) {
        console.error('[ShowsList] Invalid prop `showSize` of value `' + providedShowSize +
                          '` supplied; expected one of [' + possibleShowSizes.toString() + ']')
      }
    }

    this.state = {
      width: 1,
      height: 1,
    }
  }

  imageDimensions(layout) {
    const width = layout.width
    const isPad = width > 700
    const showSize = this.props.showSize

    const marginSpace = 20 * this.numberOfColumns(isPad)
    const imageWidth = isPad ? ((width - marginSpace) / this.numberOfColumns(isPad)) : (width - 20)

    const aspectRatio = (showSize === 'large') ? 1.6 : 1.4
    const imageHeight = Math.floor(imageWidth / aspectRatio)
    return { width: imageWidth, height: imageHeight }
  }

  numberOfColumns = (isPad: boolean) => {
    if (isPad) {
      return (this.props.showSize === 'large') ? 2 : 3
    }

    return 1
  }

  onLayout= (event: LayoutEvent) => {
    const layout = event.nativeEvent.layout
    this.setState(this.imageDimensions(layout))
  }

  render() {
    const showSize = this.props.showSize
    const showStyles = StyleSheet.create({
      container: {
        margin: 10,
        marginBottom: (showSize === 'medium') ? 30 : 10,
        width: this.state.width,
      },
      image:{
        width: this.state.width,
        height: this.state.height,
      },
    })

    return (
      <View style={styles.container} onLayout={this.onLayout}>
        { this.props.shows.map(show => this.renderShow(show, showStyles)) }
      </View>
    )
  }

  renderShow(show, showStyles) {
    return <Show show={show} styles={showStyles} key={show.__id} />
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginLeft: -10,
    marginRight: -10,
  }
})

export default Relay.createContainer(ShowsList,{
  fragments: {
    shows: () => Relay.QL`
      fragment on PartnerShow @relay(plural: true) {
        __id
        ${Show.getFragment('show')}
      }
    `,
  }
})
