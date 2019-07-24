import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { LayoutChangeEvent, ScrollView, TouchableHighlight, View, ViewProperties } from "react-native"

import SwitchBoard from "lib/NativeModules/SwitchBoard"
import OpaqueImageView from "../OpaqueImageView/OpaqueImageView"
import Headline from "../Text/Headline"

import { HeroUnits_hero_units } from "__generated__/HeroUnits_hero_units.graphql"

interface Props extends ViewProperties {
  hero_units: HeroUnits_hero_units
}

interface State {
  width?: number
  height?: number
  margin?: number
  fontSize?: number
}

class HeroUnits extends React.Component<Props, State> {
  state = {
    width: null,
    height: null,
    margin: null,
    fontSize: 0,
  }

  handleLayout = (event: LayoutChangeEvent) => {
    const {
      nativeEvent: {
        layout: { width },
      },
    } = event
    const margin = width > 700 ? 40 : 20
    const height = width > 700 ? 300 : 160
    const fontSize = width > 700 ? 30 : 20
    this.setState({ width, height, margin, fontSize })
  }

  handlePress = heroUnit => {
    SwitchBoard.presentNavigationViewController(this, heroUnit.href)
  }

  renderHeroUnit(heroUnit, margin, width, height) {
    return (
      <TouchableHighlight
        key={heroUnit.id}
        onPress={() => this.handlePress(heroUnit)}
        underlayColor="black"
        style={{ marginLeft: 5, marginRight: 5, marginTop: 20, width, height }}
      >
        <View style={{ flex: 1, justifyContent: "center" }}>
          <OpaqueImageView
            imageURL={width > 600 ? heroUnit.wide_image_url : heroUnit.narrow_image_url}
            style={{ position: "absolute", top: 0, width, height }}
          />
          <View style={{ position: "absolute", top: 0, width, height, backgroundColor: "black", opacity: 0.3 }} />
          <View style={{ marginLeft: margin, backgroundColor: "transparent" }}>
            <Headline style={{ color: "white", fontSize: 12 }}>{heroUnit.heading}</Headline>
            <Headline style={{ color: "white", fontSize: this.state.fontSize }}>{heroUnit.title}</Headline>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  renderHeroUnits() {
    const { width, height, margin } = this.state
    if (width && height && margin) {
      const imageWidth = width - margin * 2
      return (
        <ScrollView
          style={{ overflow: "visible", marginLeft: margin - 5, marginRight: margin - 5 }}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
        >
          {(this.props.hero_units || []).map(heroUnit => this.renderHeroUnit(heroUnit, margin, imageWidth, height))}
        </ScrollView>
      )
    }
  }

  render() {
    return <View onLayout={this.handleLayout}>{this.renderHeroUnits()}</View>
  }
}

export default createFragmentContainer(HeroUnits, {
  hero_units: graphql`
    fragment HeroUnits_hero_units on HomePageHeroUnit @relay(plural: true) {
      id
      href
      title
      heading
      narrow_image_url: background_image_url(version: NARROW)
      wide_image_url: background_image_url(version: WIDE)
    }
  `,
})
