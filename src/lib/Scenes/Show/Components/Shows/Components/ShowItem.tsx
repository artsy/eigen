import { Flex } from "@artsy/palette"
import { Shows_show } from "__generated__/Shows_show.graphql"
import { WhiteButton } from "lib/Components/Buttons"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import { Colors } from "lib/data/colors"
import { element } from "prop-types"
import React from "react"
import { Text } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

const DEFAULT_ARTWORK_URL = "https://d32dm0rphc51dk.cloudfront.net/ADYdY8P1kg9vKA9ffrb4pg/larger.jpg"

const ImageView = styled(OpaqueImageView)`
  height: 200;
  width: 100%;
`
const ButtonBorderBlack = styled(WhiteButton)`
  border-color: ${Colors.Black};
`
interface State {
  savedShows: any[]
}

interface Props {
  show: Shows_show
}

export class ShowItem extends React.Component<Props, State> {
  state = {
    savedShows: [],
  }
  saveShow(node) {
    const {
      node: { id: id },
    } = node
    const savedShows = this.state.savedShows
    savedShows.push(id)
    this.setState({
      savedShows,
    })
  }
  getImageURL(node) {
    const {
      node: {
        images: [image],
      },
    } = node

    return !image ? DEFAULT_ARTWORK_URL : image.url
  }
  getGalleryDetails(node) {
    const {
      node: {
        location: { address: address },
        location: { address_2: address2 },
        location: { postal_code: postalCode },
        location: { state: state },
        name: showName,
        partner: { name: galleryName },
      },
    } = node

    let fields = [showName, galleryName, address, address2, state, postalCode]
    return (fields = fields.filter(field => !!field).map(text => <Text>{text}</Text>))
  }
  render() {
    if (!this.props.show) {
      return null
    }
    const {
      show: {
        nearbyShows: { edges },
      },
    } = this.props

    return edges.map((node, el) => (
      <Flex key={el}>
        <Flex mb={15} mt={15}>
          <ImageView imageURL={this.getImageURL(node)} />
        </Flex>
        <Flex flexDirection={"row"}>
          <Flex width={"70%"}>{this.getGalleryDetails(node)}</Flex>
          <Flex width={"30%"}>
            <ButtonBorderBlack
              text="Save"
              onPress={() => {
                this.saveShow(node)
              }}
            />
          </Flex>
        </Flex>
      </Flex>
    ))
  }
}

export const ShowItemContainer = createFragmentContainer(
  ShowItem,
  graphql`
    fragment ShowItem_show on Show {
      nearbyShows(first: 20) {
        edges {
          node {
            id
            name
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
            location {
              address
              address_2
              state
              postal_code
            }
          }
        }
      }
    }
  `
)
