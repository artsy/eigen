import React, { Component } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import { Dimensions, TouchableHighlight } from "react-native"

import ImageView from "lib/Components/OpaqueImageView"
import Switchboard from "lib/NativeModules/SwitchBoard"
import SectionTitle from "lib/Scenes/Home/Components/SectionTitle"

import { FairsRail_fairs_module } from "__generated__/FairsRail_fairs_module.graphql"

const Container = styled.View`
  margin-bottom: 15;
`

const Title = styled(SectionTitle)`
  margin-left: 20;
`

const IconCarousel = styled.ScrollView`
  flex-direction: row;
  overflow: visible;
  margin-top: 10;
  margin-left: 16;
  margin-right: 16;
`

const TouchableWrapper = styled.View`
  margin-left: 4;
  margin-right: 4;
`

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
        Switchboard.presentNavigationViewController(this, `${fair.profile.href}?entity=fair`)
      }

      return (
        <TouchableHighlight style={circleIconStyle} onPress={selectionHandler} key={fair.id}>
          <TouchableWrapper>
            <ImageView style={circleIconStyle} imageURL={fair.mobile_image.url} placeholderBackgroundColor="white" />
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
      <Container>
        <Title>
          <SectionTitle>Recommended Art Fairs</SectionTitle>
        </Title>
        {this.renderFairs()}
      </Container>
    )
  }
}

export default createFragmentContainer(
  FairsRail,
  graphql`
    fragment FairsRail_fairs_module on HomePageFairsModule {
      results {
        id
        name
        profile {
          href
        }
        mobile_image {
          id
          url
        }
      }
    }
  `
)
