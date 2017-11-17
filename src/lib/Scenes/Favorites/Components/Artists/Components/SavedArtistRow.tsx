import React from "react"
import styled from "styled-components/native"

import { Text, TouchableWithoutFeedback, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import OpaqueImageView from "lib/Components/OpaqueImageView"
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
  border-radius: 25px;
  overflow: hidden;
`

const Separator = styled.View`
  height: 1;
  width: 100%;
  background-color: ${Colors.GrayRegular};
  margin-top: 9px;
`

class SavedArtistRow extends React.Component<RelayProps, null> {
  handleTap() {
    Switchboard.presentNavigationViewController(this, this.props.artist.href)
  }

  render() {
    const artist = this.props.artist
    const imageURL = artist.image && artist.image.url

    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
        <Container>
          <Content>
            <ImageContainer>
              <ImageView imageURL={imageURL} />
            </ImageContainer>
            <Label>
              {artist.name.toUpperCase()}
            </Label>
          </Content>
          <Separator />
        </Container>
      </TouchableWithoutFeedback>
    )
  }
}

export default createFragmentContainer(SavedArtistRow, {
  artist: graphql`
    fragment SavedArtistRow_artist on Artist {
      href
      name
      image {
        url(version: "large")
      }
    }
  `,
})

interface RelayProps {
  artist: {
    href: string | null
    name: string | null
    image: {
      url: string | null
    } | null
  }
}
