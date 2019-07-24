import React from "react"
import styled from "styled-components/native"

import { TouchableWithoutFeedback } from "react-native"

import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { Colors } from "lib/data/colors"
import fonts from "lib/data/fonts"
import Switchboard from "lib/NativeModules/SwitchBoard"

const Container = styled.View`
  margin: 9px 20px 0;
  height: 70px;
`

const Content = styled.View`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
`

const Label = styled.Text`
  font-family: ${fonts["avant-garde-regular"]};
  font-size: 12px;
  letter-spacing: 0.5;
  color: black;
  margin: 6px 10px 2px;
  flex: 1;
`

const ImageView = styled(OpaqueImageView)`
  height: 50px;
  width: 50px;
`

const ImageContainer = styled.View`
  height: 50px;
  width: 50px;
  overflow: hidden;
`

const Separator = styled.View`
  height: 1;
  width: 100%;
  background-color: ${Colors.GrayRegular};
  margin-top: 9px;
`

interface Props {
  href: string
  name: string
  image: {
    url: string | null
  }
  square_image?: boolean | undefined
}

export default class SavedArtistRow extends React.Component<Props, null> {
  handleTap() {
    Switchboard.presentNavigationViewController(this, this.props.href)
  }

  render() {
    const item = this.props
    const imageURL = item.image && item.image.url

    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
        <Container>
          <Content>
            <ImageContainer style={{ borderRadius: item.square_image ? 0 : 25 }}>
              <ImageView imageURL={imageURL} />
            </ImageContainer>
            <Label>{item.name.toUpperCase()}</Label>
          </Content>
          <Separator />
        </Container>
      </TouchableWithoutFeedback>
    )
  }
}
