import React from "react"
import { Image, StyleProp, TouchableHighlight, TouchableHighlightProperties, ViewStyle } from "react-native"

import fonts from "lib/data/fonts"
import styled from "styled-components/native"

import { ConsignmentSetup } from "../index"

const Title = styled.Text`
  color: white;
  font-family: "${fonts["avant-garde-regular"]}";
  flex: 2;
`
const Background = styled.View`
  background-color: black;
  flex: 1;
  padding-top: 20;
  padding-bottom: 20;
  padding-left: 20;
  padding-right: 20;
`
const Separator = styled.View`
  background-color: #444444;
  height: 1;
`

const ButtonView = styled.View`
  flex-direction: row;
  align-items: center;
  height: 60;
`

const ImageBG = styled.View`
  border-color: white;
  border-radius: 13;
  border-width: 1;
  width: 26;
  height: 26;
  justify-content: center;
  align-items: center;
  margin-right: 20;
`

const ToDoButton = () => (
  <ImageBG>
    <Image source={require("../../../../../images/consignments/plus.png")} />
  </ImageBG>
)

const DoneButton = () => (
  <ImageBG style={{ backgroundColor: "white" }}>
    <Image source={require("../../../../../images/consignments/black-tick.png")} />
  </ImageBG>
)

const Button: React.SFC<TouchableHighlightProperties> = ({ children, ...props }) => (
  <TouchableHighlight {...props}>
    <ButtonView>{children}</ButtonView>
  </TouchableHighlight>
)

interface TODOProps extends ConsignmentSetup {
  goToArtist?: () => void
  goToPhotos?: () => void
  goToMetadata?: () => void
  goToEdition?: () => void
  goToLocation?: () => void
  goToProvenance?: () => void
  style?: StyleProp<ViewStyle>
}

const render = (props: TODOProps, canSubmitMetadata: boolean) => (
  <Background style={props.style}>
    <Separator />
    <Button onPress={props.goToArtist}>
      <Title>ARTIST/DESIGNER NAME</Title>
      {props.artist ? DoneButton() : ToDoButton()}
    </Button>

    <Separator />
    <Button onPress={props.goToPhotos}>
      <Title>PHOTOS</Title>
      {props.photos ? DoneButton() : ToDoButton()}
    </Button>

    <Separator />
    <Button onPress={props.goToMetadata}>
      <Title>WORK DETAILS</Title>
      {canSubmitMetadata ? DoneButton() : ToDoButton()}
    </Button>

    <Separator />
    <Button onPress={props.goToEdition}>
      <Title>EDITION & AUTHENTICITY</Title>
      {props.editionScreenViewed ? DoneButton() : ToDoButton()}
    </Button>

    <Separator />
    <Button onPress={props.goToLocation}>
      <Title>LOCATION</Title>
      {props.location ? DoneButton() : ToDoButton()}
    </Button>

    <Separator />
    <Button onPress={props.goToProvenance}>
      <Title>PROVENANCE</Title>
      {props.provenance ? DoneButton() : ToDoButton()}
    </Button>

    <Separator />
  </Background>
)

export default class ConsignmentTODO extends React.Component<TODOProps, null> {
  canSubmitMetadata = props =>
    props.metadata &&
    props.metadata.category &&
    props.metadata.title &&
    props.metadata.year &&
    props.metadata.medium &&
    props.metadata.height &&
    props.metadata.width

  render() {
    return render(this.props, this.canSubmitMetadata(this.props))
  }
}
