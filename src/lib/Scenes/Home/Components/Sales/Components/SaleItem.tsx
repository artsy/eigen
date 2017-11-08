import moment from "moment"
import * as React from "react"
import styled from "styled-components/native"

import { Dimensions, Text, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import fonts from "../../../../../../data/fonts"
import OpaqueImageView from "../../../../../Components/OpaqueImageView"
import Serif from "../../../../../Components/Text/Serif"
import { liveDate, timedDate } from "../formatDate"

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
  border-radius: 2px;
  padding: 1px 4px;
  margin-left: 3px;
`

const BadgeText = styled.Text`
  font-size: 7px;
  font-family: ${fonts["avant-garde-regular"]};
  letter-spacing: 1.5;
  align-self: center;
`

const Metadata = styled.Text`
  color: white;
  letter-spacing: 1.5;
  font-family: ${fonts["avant-garde-regular"]};
  font-size: 10px;
`

export class SaleItem extends React.Component<RelayProps, null> {
  get containerWidth(): number {
    const screenSize = Dimensions.get("window")
    const isIPad = screenSize.width > 700
    const numColumns = isIPad ? 4 : 2
    const gutterSize = isIPad ? 100 : 60
    return (screenSize.width - gutterSize) / numColumns
  }

  render() {
    const item = this.props.sale
    const timestamp = (item.live_start_at ? liveDate(item) : timedDate(item)).toUpperCase()
    const imageURL = (item.cover_image || { cropped: { url: "" } }).cropped.url
    const containerWidth = this.containerWidth

    const Container = styled.View`
      width: ${containerWidth}px;
      height: ${containerWidth * 1.24}px;
      position: relative;
      margin: 5px;
    `

    return (
      <Container>
        <Image imageURL={imageURL} skipGemini={true} />
        <Content>
          <Header>
            <Title numberOfLines={2}>
              {item.name}
            </Title>
            {item.live_start_at &&
              <Badge>
                <BadgeText>LIVE</BadgeText>
              </Badge>}
          </Header>
          <Footer>
            <Metadata>
              {timestamp}
            </Metadata>
          </Footer>
        </Content>
      </Container>
    )
  }
}

export default createFragmentContainer(SaleItem, {
  sale: graphql`
    fragment SaleItem_sale on Sale {
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

interface RelayProps {
  sale: {
    id: string
    name: string
    is_open: boolean
    is_live_open: boolean
    start_at: string | null
    end_at: string | null
    registration_ends_at: string | null
    live_start_at: string | null
    cover_image: {
      cropped: {
        url: string | null
      } | null
    }
  } | null
}
