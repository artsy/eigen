import { Flex, Sans, Serif } from "@artsy/palette"
import { ShowItem_show } from "__generated__/ShowItem_show.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { Dimensions, TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

const { width: windowWidth } = Dimensions.get("window")
const ImageView = styled(OpaqueImageView)`
  height: 120;
  width: 100%;
`

interface Props {
  show: ShowItem_show
}

export class ShowItem extends React.Component<Props> {
  get imageURL() {
    const {
      images: [image],
    } = this.props.show

    return (image || { url: "" }).url
  }

  onPress = () => {
    SwitchBoard.presentNavigationViewController(this, `/show/${this.props.show.id}`)
  }

  render() {
    const { show } = this.props

    const {
      name,
      partner: { name: galleryName },
      exhibition_period,
    } = show

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Flex my={15} mr={2} width={windowWidth - 100} height={200}>
          <ImageView imageURL={this.imageURL} />
          <Flex my={2}>
            <Sans size="2" weight="medium" numberOfLines={1} mb={0.5}>
              {name}
            </Sans>
            <Serif size="2" color="black60">
              {galleryName}
            </Serif>
            <Serif size="2" color="black60">
              {exhibition_period}
            </Serif>
          </Flex>
        </Flex>
      </TouchableOpacity>
    )
  }
}

export const ShowItemContainer = createFragmentContainer(
  ShowItem,
  graphql`
    fragment ShowItem_show on Show {
      __id
      id
      name
      exhibition_period
      images {
        url
        aspect_ratio
      }
      partner {
        ... on ExternalPartner {
          name
        }
        ... on Partner {
          name
        }
      }
    }
  `
)
