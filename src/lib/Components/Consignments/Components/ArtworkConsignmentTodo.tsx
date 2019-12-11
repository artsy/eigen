import { Flex, Sans, Separator } from "@artsy/palette"
import React from "react"
import { Image, StyleProp, TouchableOpacity, ViewStyle } from "react-native"
import styled from "styled-components/native"
import { ConsignmentSetup } from "../index"

const Background = styled.View`
  flex: 1;
  padding-top: 20;
  padding-bottom: 20;
  padding-left: 20;
  padding-right: 20;
`

const ImageBG = styled.View`
  border-color: black;
  border-radius: 13;
  border-width: 1;
  width: 26;
  height: 26;
  justify-content: center;
  align-items: center;
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
    <TouchableOpacity onPress={props.goToArtist}>
      <Flex flexDirection="row" justifyContent="space-between" py={2}>
        <Sans size="4">Artist/Designer name</Sans>
        {props.artist ? DoneButton() : ToDoButton()}
      </Flex>
    </TouchableOpacity>

    <Separator />
    <TouchableOpacity onPress={props.goToPhotos}>
      <Flex flexDirection="row" justifyContent="space-between" py={2}>
        <Sans size="4">Photos</Sans>
        {props.photos ? DoneButton() : ToDoButton()}
      </Flex>
    </TouchableOpacity>

    <Separator />
    <TouchableOpacity onPress={props.goToMetadata}>
      <Flex flexDirection="row" justifyContent="space-between" py={2}>
        <Sans size="4">Work details</Sans>
        {canSubmitMetadata ? DoneButton() : ToDoButton()}
      </Flex>
    </TouchableOpacity>

    <Separator />
    <TouchableOpacity onPress={props.goToEdition}>
      <Flex flexDirection="row" justifyContent="space-between" py={2}>
        <Sans size="4">Edition & Authenticity</Sans>
        {props.editionScreenViewed ? DoneButton() : ToDoButton()}
      </Flex>
    </TouchableOpacity>

    <Separator />
    <TouchableOpacity onPress={props.goToLocation}>
      <Flex flexDirection="row" justifyContent="space-between" py={2}>
        <Sans size="4">Location</Sans>
        {props.location ? DoneButton() : ToDoButton()}
      </Flex>
    </TouchableOpacity>

    <Separator />
    <TouchableOpacity onPress={props.goToProvenance}>
      <Flex flexDirection="row" justifyContent="space-between" py={2}>
        <Sans size="4">Provenance</Sans>
        {props.provenance ? DoneButton() : ToDoButton()}
      </Flex>
    </TouchableOpacity>

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
