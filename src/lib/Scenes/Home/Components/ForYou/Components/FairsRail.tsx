import * as React from "react"
import { createFragmentContainer, graphql, RelayRefetchProp } from "react-relay"
import styled from "styled-components/native"

import { ScrollView, TouchableHighlight } from "react-native"

import ImageView from "lib/Components/OpaqueImageView"
import Separator from "lib/Components/Separator"
import Switchboard from "lib/NativeModules/SwitchBoard"
import SectionTitle from "lib/Scenes/Home/Components/SectionTitle"

const Container = styled.View`
  margin-left: 20;
  margin-bottom: 15;
`

const IconCarousel = styled.ScrollView`
  flex-direction: row;
  margin-top: 10;
`

const IconTapArea = styled.TouchableHighlight`
  height: 80;
  width: 80;
  border-radius: 40;
  marginRight: 7;
`

const TouchableWrapper = styled.View`margin-right: 7;`

const FairIcon = styled(ImageView)`
  height: 80;
  width: 80;
  border-radius: 40;
  marginRight: 7;
`

class FairsRail extends React.Component<RelayProps, any> {
  renderFairs() {
    if (!this.props.fairs_module.results.length) {
      return
    }

    const icons = this.props.fairs_module.results.map(fair => {
      if (!fair.profile) {
        return null
      }

      const selectionHandler = () => {
        Switchboard.presentNavigationViewController(this, fair.profile.href)
      }

      return (
        <IconTapArea onPress={selectionHandler} key={fair.id}>
          <TouchableWrapper>
            <FairIcon imageURL={fair.mobile_image.url} placeholderBackgroundColor={"white"} />
          </TouchableWrapper>
        </IconTapArea>
      )
    })

    return (
      <IconCarousel horizontal={true} showsHorizontalScrollIndicator={false} scrollsToTop={false}>
        {icons}
      </IconCarousel>
    )
  }

  render() {
    return (
      <Container>
        <SectionTitle>Recommended Art Fairs</SectionTitle>
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
interface RelayProps {
  fairs_module: {
    results: Array<{
      id: string
      name: string
      profile: {
        href: string
      } | null
      mobile_image: {
        id: string
        url: string
      } | null
    } | null> | null
  }
}
