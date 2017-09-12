import * as React from "react"
import { ButtonProperties, Image, TouchableHighlight, TouchableHighlightProperties } from "react-native"

import styled from "styled-components/native"
import colors from "../../../../data/colors"
import fonts from "../../../../data/fonts"

import { ConsignmentSetup } from "../index"

const Title = styled.Text`
  color: white;
  font-family: "${fonts["avant-garde-regular"]}";
  flex: 1;
`

const Subtitle = styled.Text`
  color: white;
  font-family: "${fonts["garamond-regular"]}";
  padding-top: 6;
  flex: 1;
  text-align: right;
`

const InlineCopy = styled.Text`
  color: white;
  font-family: "${fonts["garamond-regular"]}";
  background-color: transparent;
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
  background-color: ${colors["gray-regular"]};
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

const ImageStyle = styled.Image`
  border-color: white;
  border-width: 1;
  width: 38;
  height: 38;
`

const ImageDarkener = styled.View`
  background-color: rgba(0, 0, 0, 0.5);
  flex: 1;
  width: 38;
  justify-content: center;
  align-items: center;
  padding-top: 2;
`

const ToDoButton = () =>
  <ImageBG>
    <Image source={require("../../../../../images/consignments/plus.png")} />
  </ImageBG>

const DoneButton = () =>
  <ImageBG style={{ backgroundColor: "white" }}>
    <Image source={require("../../../../../images/consignments/black-tick.png")} />
  </ImageBG>

const Button: React.SFC<TouchableHighlightProperties> = ({ children, ...props }) =>
  <TouchableHighlight {...props}>
    <ButtonView>
      {children}
    </ButtonView>
  </TouchableHighlight>

const ImagePreview = images =>
  <ImageStyle source={{ uri: images[0] }}>
    <ImageDarkener>
      <InlineCopy>
        {images.length}
      </InlineCopy>
    </ImageDarkener>
  </ImageStyle>

const locationDisplayString = ({ city, state, country }) => [city, state, country].filter(Boolean).join(", ")

interface TODOProps extends ConsignmentSetup {
  goToArtist?: () => void
  goToPhotos?: () => void
  goToMetadata?: () => void
  goToLocation?: () => void
  goToProvenance?: () => void
}

const render = (props: TODOProps) =>
  <Background>
    <Separator />
    <Button onPress={props.goToArtist}>
      {props.artist ? DoneButton() : ToDoButton()}
      <Title>ARTIST/DESIGNER</Title>
      <Subtitle>
        {props.artist ? props.artist.name : ""}
      </Subtitle>
    </Button>

    <Separator />
    <Button onPress={props.goToPhotos}>
      {props.photos ? DoneButton() : ToDoButton()}
      <Title>PHOTOS</Title>
      {props.photos ? ImagePreview(props.photos) : null}
    </Button>

    <Separator />
    <Button onPress={props.goToMetadata}>
      {props.metadata && props.metadata.category && props.metadata.title && props.metadata.year
        ? DoneButton()
        : ToDoButton()}
      <Title>METADATA</Title>
      <Subtitle>
        {props.metadata ? props.metadata.displayString : ""}
      </Subtitle>
    </Button>

    <Separator />
    <Button onPress={props.goToLocation}>
      {props.location ? DoneButton() : ToDoButton()}
      <Title>LOCATION</Title>
      <Subtitle>
        {props.location ? locationDisplayString(props.location) : ""}
      </Subtitle>
    </Button>

    <Separator />
    <Button onPress={props.goToProvenance}>
      {props.provenance ? DoneButton() : ToDoButton()}
      <Title>PROVENANCE</Title>
      <Subtitle numberOfLines={1}>
        {props.provenance ? props.provenance : ""}
      </Subtitle>
    </Button>

    <Separator />
  </Background>

export default class ConsignmentTODO extends React.Component<TODOProps, null> {
  render() {
    return render(this.props)
  }
}
