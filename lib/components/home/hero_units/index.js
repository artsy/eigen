// @flow
'use strict'

import React from 'react'
import Relay from 'react-relay'
import { ScrollView, View } from 'react-native'

import Headline from '../../text/headline'
import OpaqueImageView from '../../opaque_image_view'
import type { LayoutEvent } from '../../../system/events'

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

  render() {
    const { width, margin } = this.state

    let scrollView = null
    if (width && margin) {
      let content = []
      const imageWidth = width - (margin * 2)
      this.props.hero_units.forEach((hero_unit, index) => {
        content.push(
          <View key={hero_unit.__id} style={{ marginLeft: 5, marginRight: 5, width: imageWidth, height: 160, justifyContent: 'center', backgroundColor: 'black' }}>
            <OpaqueImageView imageURL={width > 700 ? hero_unit.wide_image_url : hero_unit.narrow_image_url}
                                style={{ position: 'absolute', top: 0, width: imageWidth, height: 160 }} />
            <View style={{ marginLeft: margin, backgroundColor: 'transparent' }}>
              <Headline style={{ color: 'white', fontSize: 12 }}>{hero_unit.heading}</Headline>
              <Headline style={{ color: 'white', fontSize: 20 }}>{hero_unit.title}</Headline>
            </View>
          </View>
        )
      })
      scrollView = (
        <ScrollView style={{ overflow: 'visible', marginLeft: margin - 5, marginRight: margin - 5 }}
                    horizontal={true}
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}>
          {content}
        </ScrollView>
      )
    }

    return <View onLayout={this.handleLayout}>{scrollView}</View>
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
