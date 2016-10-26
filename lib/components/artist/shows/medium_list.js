/* @flow */
'use strict'

import Relay from 'react-relay'
import React from 'react'
import { View, StyleSheet } from 'react-native'

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
    const imageWidth = (isPad ? ((width - 60) / 3) : (width - 40))
    const imageHeight = Math.floor(imageWidth / 1.4)
    return { width: imageWidth, height: imageHeight }
  }

  onLayout= (event: LayoutEvent) => {
    const layout = event.nativeEvent.layout
    this.setState(this.imageDimensions(layout))
  }

  render() {
    const showStyles = StyleSheet.create({
      container: {
        margin: 10,
        marginBottom: 30,
        width: this.state.width,
      },
      image:{
        width: this.state.width,
        height: this.state.height
      },
      metadata: {
        width: this.state.width,
      }
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
    marginTop: 12,
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
