/* @flow */
'use strict'

import Relay from 'react-relay'
import React from 'react'
import type { LayoutEvent } from '../../system/events'
import { View, StyleSheet } from 'react-native'

import Show from './show'

class LargeList extends React.Component {
  state: {
    width: number,
    height: number
  }

  constructor(props) {
    super(props)
    this.state = {
      width: 1,
      height: 1,
    }
  }

  imageDimensions(layout) {
    const width = layout.width
    const isPad = width > 700
    const imageWidth = (isPad ? ((width - 40) / 2) : (width - 40))
    const imageHeight = Math.floor(imageWidth / 1.6)
    return { width: imageWidth, height: imageHeight }
  }

  onLayout = (event: LayoutEvent) => {
    const layout = event.nativeEvent.layout
    this.setState(this.imageDimensions(layout))
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
    marginTop: 0,
    marginBottom: 0,
    marginLeft: -10,
    marginRight: -10,
  },
})

export default Relay.createContainer(LargeList,{
  fragments: {
    shows: () => Relay.QL`
      fragment on PartnerShow @relay(plural: true) {
        __id
        ${Show.getFragment('show')}
      }
    `,
  }
})
