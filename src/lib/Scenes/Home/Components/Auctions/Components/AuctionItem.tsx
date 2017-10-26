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
  margin: 5px;
`

const Image = styled(OpaqueImageView)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const Content = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  padding: 7px 10px;
`

const Title = styled(Serif)`
  color: white;
  width: 65%;
  font-size: 15px;
`

class AuctionItem extends React.Component<any, any> {
  render() {
    const item = this.props.auction
    console.log(this.props)
    return (
      <Container>
        <Image imageURL={item.cover_image.cropped.url} skipGemini={true} />
        <Content>
          <Title numberOfLines={2}>
            {item.name}
          </Title>
        </Content>
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
        cropped(width: 158, height: 196, version: "medium") {
          url
        }
      }
    }
  `,
})
