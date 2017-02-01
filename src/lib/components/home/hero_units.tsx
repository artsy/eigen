// @flow
'use strict'

import React from 'react'
import Relay from 'react-relay'
import { ScrollView, View, TouchableHighlight } from 'react-native'

import Headline from '../text/headline'
import OpaqueImageView from '../opaque_image_view'
import SwitchBoard from '../../native_modules/switch_board'

import { LayoutEvent } from '../../system/events'

class HeroUnits extends React.Component {
  state: {
    width: ?number,
    height: ?number,
    margin: ?number,
    fontSize: number
  }

  constructor(props) {
    super(props)
    this.state = {
      width: null,
      height: null,
      margin: null,
      fontSize: 0,
    }
  }

  handleLayout = (event: LayoutEvent) => {
    const { nativeEvent: { layout: { width } } } = event
    const margin = width > 700 ? 40 : 20
    const height = width > 700 ? 300 : 160
    const fontSize = width > 700 ? 30 : 20
    this.setState({ width, height, margin, fontSize })
  }

  handlePress = (hero_unit) => {
    SwitchBoard.presentNavigationViewController(this, hero_unit.href)
  }

  renderHeroUnit(hero_unit, margin, width, height) {
    return (
      <TouchableHighlight key={hero_unit.__id}
                          onPress={() => this.handlePress(hero_unit)}
                          underlayColor="black"
                          style={{ marginLeft: 5, marginRight: 5, marginTop: 20, width, height }}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <OpaqueImageView imageURL={width > 600 ? hero_unit.wide_image_url : hero_unit.narrow_image_url}
                              style={{ position: 'absolute', top: 0, width, height }} />
          <View style={{ position: 'absolute', top: 0, width, height, backgroundColor: 'black', opacity: 0.3 }} />
          <View style={{ marginLeft: margin, backgroundColor: 'transparent' }}>
            <Headline style={{ color: 'white', fontSize: 12 }}>{hero_unit.heading}</Headline>
            <Headline style={{ color: 'white', fontSize: this.state.fontSize }}>{hero_unit.title}</Headline>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  renderHeroUnits() {
    const { width, height, margin } = this.state
    if (width && height && margin) {
      const imageWidth = width - (margin * 2)
      return (
        <ScrollView style={{ overflow: 'visible', marginLeft: margin - 5, marginRight: margin - 5 }}
                    horizontal={true}
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}>
          {this.props.hero_units.map(hero_unit => this.renderHeroUnit(hero_unit, margin, imageWidth, height))}
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

interface IRelayProps {
  hero_units: Array<{
    __id: string,
    href: string | null,
    title: string | null,
    heading: string | null,
    narrow_image_url: string | null,
    wide_image_url: string | null,
  } | null> | null,
}
