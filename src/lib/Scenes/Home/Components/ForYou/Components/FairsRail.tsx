import React, { Component } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import { Dimensions, TouchableHighlight, View } from "react-native"

import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { SectionTitle } from "lib/Components/SectionTitle"
import Switchboard from "lib/NativeModules/SwitchBoard"

import { Flex } from "@artsy/palette"
import { FairsRail_fairs_module } from "__generated__/FairsRail_fairs_module.graphql"

interface Props {
  fairs_module: FairsRail_fairs_module
}

export class FairsRail extends Component<Props, null> {
  renderFairs() {
    if (!this.props.fairs_module.results.length) {
      return
    }

    const isPad = Dimensions.get("window").width > 700
    const iconDimension = isPad ? 120 : 90
    const borderRadius = iconDimension / 2

    const circleIconStyle = {
      height: iconDimension,
      width: iconDimension,
      borderRadius,
      marginRight: 7,
    }

    const icons = this.props.fairs_module.results.map(fair => {
      if (!fair.profile) {
        return null
      }

      const selectionHandler = () => {
        Switchboard.presentNavigationViewController(this, `${fair.slug}?entity=fair`)
      }

      return (
        <TouchableHighlight style={circleIconStyle} onPress={selectionHandler} key={fair.id}>
          <TouchableWrapper>
            <ImageView style={circleIconStyle} imageURL={fair.mobileImage.url} placeholderBackgroundColor="white" />
          </TouchableWrapper>
        </TouchableHighlight>
      )
    })

    return (
      <IconCarousel horizontal={true} showsHorizontalScrollIndicator={false}>
        {icons}
      </IconCarousel>
    )
  }

  render() {
    return (
      <View>
        <Flex pl="2" pr="2">
          <SectionTitle title="Recommended Art Fairs" />
        </Flex>
        {this.renderFairs()}
      </View>
    )
  }
}

export default createFragmentContainer(FairsRail, {
  fairs_module: graphql`
    fragment FairsRail_fairs_module on HomePageFairsModule {
      results {
        id
        slug
        profile {
          slug
        }
        mobileImage {
          url
        }
      }
    }
  `,
})

const IconCarousel = styled.ScrollView`
  flex-direction: row;
  overflow: visible;
  margin-left: 16;
  margin-right: 16;
`

const TouchableWrapper = styled.View`
  margin-left: 4;
  margin-right: 4;
`
