// @flow
'use strict'

import React from 'react'
import Relay from 'react-relay'
import { ScrollView, View } from 'react-native'

import Headline from '../text/headline'
import OpaqueImageView from '../opaque_image_view'
import type { LayoutEvent } from '../../system/events'

class HeroUnits extends React.Component {
  state: {
    width: ?number,
    margin: ?number,
  }

  constructor(props) {
    super(props)
    this.state = {
      width: null,
      margin: null,
    }
  }

  handleLayout = (event: LayoutEvent) => {
    const { nativeEvent: { layout: { width } } } = event
    const margin = width > 700 ? 40 : 20
    this.setState({ width, margin })
  }

  renderHeroUnit(hero_unit, margin, width) {
    return (
      <View key={hero_unit.__id} style={{ marginLeft: 5, marginRight: 5, width, height: 160, justifyContent: 'center', backgroundColor: 'black' }}>
        <OpaqueImageView imageURL={width > 600 ? hero_unit.wide_image_url : hero_unit.narrow_image_url}
                            style={{ position: 'absolute', top: 0, width, height: 160 }} />
        <View style={{ position: 'absolute', top: 0, width, height: 160, backgroundColor: 'black', opacity: 0.3 }} />
        <View style={{ marginLeft: margin, backgroundColor: 'transparent' }}>
          <Headline style={{ color: 'white', fontSize: 12 }}>{hero_unit.heading}</Headline>
          <Headline style={{ color: 'white', fontSize: 20 }}>{hero_unit.title}</Headline>
        </View>
      </View>
    )
  }

  renderHeroUnits() {
    const { width, margin } = this.state
    if (width && margin) {
      const imageWidth = width - (margin * 2)
      return (
        <ScrollView style={{ overflow: 'visible', marginLeft: margin - 5, marginRight: margin - 5 }}
                    horizontal={true}
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}>
          {this.props.hero_units.map(hero_unit => this.renderHeroUnit(hero_unit, margin, imageWidth))}
        </ScrollView>
      )
    }
  }

  render() {
    return <View onLayout={this.handleLayout}>{this.renderHeroUnits()}</View>
  }
}

export default Relay.createContainer(HeroUnits, {
  fragments: {
    hero_units: () => Relay.QL`
      fragment on HomePageHeroUnit @relay(plural: true) {
        __id
        href
        title
        heading
        narrow_image_url: background_image_url(version: NARROW)
        wide_image_url: background_image_url(version: WIDE)
      }
    `,
  }
})
