import { Flex } from "@artsy/palette"
import { InvertedWhiteBorderedButton } from "lib/Components/Buttons"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import React from "react"
import { Text } from "react-native"
import styled from "styled-components/native"

const DEFAULT_ARTWORK_URL = "https://d32dm0rphc51dk.cloudfront.net/ADYdY8P1kg9vKA9ffrb4pg/larger.jpg"

const ImageView = styled(OpaqueImageView)`
  height: 200;
  width: 100%;
`

interface State {
  savedShows: any[]
}

interface Props {
  data: Array<{
    imageURL: string
    node: any
    images: any[]
    detail: object
  }>
}

export class ShowDetails extends React.Component<Props, State> {
  state = {
    savedShows: [],
  }
  saveShow(showId) {
    const savedShows = this.state.savedShows
    savedShows.push(showId)
    this.setState({
      savedShows,
    })
  }
  getImageURL(images) {
    return images[0] ? images[0].url : DEFAULT_ARTWORK_URL
  }
  getGalleryDetails(detail) {
    const name = detail.name ? detail.name + "\n" : null
    const gallery = detail.partner.name ? detail.partner.name + "\n" : null
    const address = detail.location.address ? detail.location.address + "\n" : null
    const address2 = detail.location.address_2 ? detail.location.address_2 + "\n" : null
    const state = detail.partner.state ? detail.partner.state + "\n" : null
    const post = detail.partner.postal_code ? detail.partner.postal_code + "\n" : null
    let galleryDetail = ""
    if (name) {
      galleryDetail += name
    }
    if (gallery) {
      galleryDetail += gallery
    }
    if (address) {
      galleryDetail += address
    }
    if (address2) {
      galleryDetail += address2
    }
    if (state) {
      galleryDetail += state
    }
    if (post) {
      galleryDetail += post
    }

    return <Text>{galleryDetail}</Text>
  }
  render() {
    if (!this.props.data) {
      return null
    }
    const { data } = this.props
    return data.map((showDetail, el) => (
      <Flex key={el}>
        <Flex mb={15} mt={15}>
          <ImageView imageURL={this.getImageURL(showDetail.node.images)} />
        </Flex>
        <Flex flexDirection={"row"}>
          <Flex width={"70%"}>{this.getGalleryDetails(showDetail.node)}</Flex>
          <Flex width={"30%"}>
            <InvertedWhiteBorderedButton
              text="Save"
              onPress={() => {
                this.saveShow(showDetail.node.id)
              }}
            />
          </Flex>
        </Flex>
      </Flex>
    ))
  }
}
