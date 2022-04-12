import { Flex, Separator, Text } from "palette"
import React from "react"
import { Image, StyleProp, TouchableOpacity, ViewStyle } from "react-native"
import styled from "styled-components/native"
import { ConsignmentSetup } from "../../SubmitArtwork/UploadPhotos/utils/index"

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
    <Image source={require("../../../../../images/consignments/plus.webp")} />
  </ImageBG>
)

const DoneButton = () => (
  <ImageBG style={{ backgroundColor: "white" }}>
    <Image source={require("../../../../../images/consignments/black-tick.webp")} />
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

const TodoButton: React.FC<{ label: string; isComplete: boolean; onPress?(): void }> = ({
  label,
  isComplete,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Flex flexDirection="row" justifyContent="space-between" py={2} alignItems="center">
        <Text variant="md">{label}</Text>
        {isComplete ? DoneButton() : ToDoButton()}
      </Flex>
    </TouchableOpacity>
  )
}

export default class ConsignmentTODO extends React.Component<TODOProps> {
  canSubmitMetadata(props: TODOProps) {
    return (
      props.metadata &&
      props.metadata.category &&
      props.metadata.title &&
      props.metadata.year &&
      props.metadata.medium &&
      props.metadata.height &&
      props.metadata.width
    )
  }
  render() {
    return (
      <Flex p="2">
        <Separator />
        <TodoButton
          label="Artist/Designer name"
          onPress={this.props.goToArtist}
          isComplete={!!this.props.artist}
        />
        <Separator />
        <TodoButton
          label="Photos"
          onPress={this.props.goToPhotos}
          isComplete={!!this.props.photos && this.props.photos.length > 0}
        />
        <Separator />
        <TodoButton
          label="Work details"
          onPress={this.props.goToMetadata}
          isComplete={!!this.canSubmitMetadata(this.props)}
        />
        <Separator />
        <TodoButton
          label="Edition & Authenticity"
          onPress={this.props.goToEdition}
          isComplete={!!this.props.editionScreenViewed}
        />
        <Separator />
        <TodoButton
          label="Location"
          onPress={this.props.goToLocation}
          isComplete={!!this.props.location}
        />
        <Separator />
        <TodoButton
          label="Provenance"
          onPress={this.props.goToProvenance}
          isComplete={!!this.props.provenance}
        />
        <Separator />
      </Flex>
    )
  }
}
