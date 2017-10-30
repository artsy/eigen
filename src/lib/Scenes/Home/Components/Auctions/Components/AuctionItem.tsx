import moment from "moment"
import * as React from "react"
import styled from "styled-components/native"

import { Text, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import fonts from "../../../../../../data/fonts"
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
`

const Header = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  padding: 10px 10px;
`

const Footer = styled.View`
  padding: 5px;
  bottom: 0;
  position: absolute;
  margin: 5px;
`

const Title = styled(Serif)`
  color: white;
  font-size: 15px;
  flex: 1;
`

const Badge = styled.View`
  background: white;
  color: black;
  border-radius: 2px;
  padding: 1px 4px;
`

const BadgeText = styled.Text`
  font-size: 8px;
  font-family: ${fonts["avant-garde-regular"]};
  letter-spacing: 1.5;
  align-self: center;
`

const TimeLeft = styled.Text`
  color: white;
  letter-spacing: 1.5;
  font-family: ${fonts["avant-garde-regular"]};
  font-size: 10px;
`

class AuctionItem extends React.Component<any, any> {
  render() {
    const item = this.props.auction
    const timestamp = "59 Minutes Left".toUpperCase()
    console.log(this.props)
    return (
      <Container>
        <Image imageURL={item.cover_image.cropped.url} skipGemini={true} />
        <Content>
          <Header>
            <Title numberOfLines={2}>
              {item.name}
            </Title>
            <Badge>
              <BadgeText>LIVE</BadgeText>
            </Badge>
          </Header>
          <Footer>
            <TimeLeft>
              {timestamp}
            </TimeLeft>
          </Footer>
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
      end_at
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
