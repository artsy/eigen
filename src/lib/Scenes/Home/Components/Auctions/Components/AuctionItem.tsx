import * as React from "react"
import styled from "styled-components/native"

import { Text, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import OpaqueImageView from "../../../../../Components/OpaqueImageView"
import Serif from "../../../../../Components/Text/Serif"

const Container = styled.View`
  width: 158px;
  height: 196px;
  position: relative;
`

const Image = styled(OpaqueImageView)`
  position: absolute;
  top: 0;
  left: 0;
  width: 158px;
  height: 196px;
`

class AuctionItem extends React.Component<any, any> {
  render() {
    const item = this.props.auction
    console.log(this.props)
    return (
      <Container>
        <Image imageURL={item.cover_image.cropped.url} />
        <Serif>
          {item.name}
        </Serif>
      </Container>
    )
  }
}

export default createFragmentContainer(AuctionItem, {
  auction: graphql`
    fragment AuctionItem_auction on Sale {
      id
      name
      is_open
      is_live_open
      start_at
      registration_ends_at
      live_start_at
      cover_image {
        cropped(width: 180, height: 130, version: "medium") {
          url
        }
      }
    }
  `,
})
