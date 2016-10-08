// @flow
'use strict'

import React from 'react'
import Relay from 'react-relay'
import { ScrollView } from 'react-native'

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

    let content = []
    if (width && margin) {
      const imageWidth = width - (margin * 2)
      this.props.hero_units.forEach((hero_unit, index) => {
        content.push(
          <OpaqueImageView imageURL={width > 700 ? hero_unit.wide_image_url : hero_unit.narrow_image_url}
                              style={{ width: imageWidth, height: 160, marginLeft: margin, marginRight: margin }}>
          </OpaqueImageView>
        )
      })
    }

    return (
      <ScrollView onLayout={this.handleLayout}
                     style={{ overflow: 'visible', height: 160, flex: 1 }}
                horizontal={true}
             pagingEnabled={true}
             showsHorizontalScrollIndicator={false}>
        {content}
      </ScrollView>
    )
  }
}

export default Relay.createContainer(HeroUnits, {
  fragments: {
    hero_units: () => Relay.QL`
      fragment on HomePageHeroUnit @relay(plural: true) {
        href
        title
        heading
        narrow_image_url: background_image_url(version: NARROW)
        wide_image_url: background_image_url(version: WIDE)
      }
    `,
  }
})
