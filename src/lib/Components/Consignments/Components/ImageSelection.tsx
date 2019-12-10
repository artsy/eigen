import { Box, color } from "@artsy/palette"
import React from "react"
import { Dimensions, FlatList, Image, TouchableHighlight, TouchableOpacity, View } from "react-native"
import styled from "styled-components/native"

const dimensionsWidth = Dimensions.get("window").width
const isPad = dimensionsWidth > 700
const imageSize = (dimensionsWidth - 60) / 2

const SelectedIndicator = styled.View`
  border-color: white;
  border-radius: 13;
  border-width: 1;
  width: 26;
  height: 26;
  justify-content: center;
  align-items: center;
  margin-right: 20;
`

const Overlay = styled(Box)`
  ${p => p.selected && `border-width: 1; border-color: ${color("black80")}`};
`

export interface ImageData {
  image: {
    uri: string
  }
}

interface ImagePreviewProps {
  data: ImageData
  selected: boolean
  onPressItem: (uri: string) => void
}

interface TakePhotoImageProps {
  onPressNewPhoto: () => void
}

const SelectedIcon = () => (
  <SelectedIndicator style={{ backgroundColor: "white", position: "absolute", bottom: 20, right: 0 }}>
    <Image source={require("../../../../../images/consignments/black-tick.png")} />
  </SelectedIndicator>
)

const TakePhotoImage = (props: TakePhotoImageProps) => (
  <TouchableOpacity
    onPress={props.onPressNewPhoto}
    style={{
      backgroundColor: "white",
      marginBottom: 20,
      borderWidth: 1,
      borderColor: "black",
      height: imageSize,
      width: imageSize,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Image source={require("../../../../../images/consignments/camera-black.png")} />
  </TouchableOpacity>
)

const ImageForURI = (props: ImagePreviewProps) => (
  <View
    style={{
      position: "relative",
      height: imageSize,
      width: imageSize,
      marginBottom: 20,
    }}
  >
    <Overlay
      selected={props.selected}
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 2,
        height: imageSize,
        width: imageSize,
      }}
    />
    <TouchableHighlight
      onPress={() => props.onPressItem(props.data.image.uri)}
      style={{
        opacity: props.selected ? 0.5 : 1.0,
      }}
    >
      <Image source={{ uri: props.data.image.uri }} style={{ height: imageSize, width: imageSize }} />
    </TouchableHighlight>
    {props.selected ? <SelectedIcon /> : null}
  </View>
)

interface Props {
  data: ImageData[]
  selected?: string[]
  onPressNewPhoto?: () => void
  onUpdateSelectedStates?: (selection: string[]) => void
}

interface State {
  selected: string[]
}

const TakePhotoID = "take_photo"
const BlankImageID = "blank"

export default class ImageSelection extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      selected: props.selected ? props.selected : [],
    }
  }

  onPressItem = (id: string) => {
    const selected = this.state.selected
    const selectedAlready = selected.includes(id)
    const refreshCallback = () => {
      if (this.props.onUpdateSelectedStates) {
        this.props.onUpdateSelectedStates(this.state.selected)
      }
    }
    if (selectedAlready) {
      this.setState({ selected: selected.filter(i => i !== id) }, refreshCallback)
    } else {
      this.setState({ selected: [id, ...selected] }, refreshCallback)
    }
  }

  render() {
    const data = isPad ? [TakePhotoID, ...this.props.data] : [TakePhotoID, ...this.props.data, BlankImageID]
    return (
      <FlatList
        data={data}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", paddingLeft: 20, paddingRight: 20 }}
        keyExtractor={item => {
          if (typeof item === "string") {
            return item
          } else {
            return item.image.uri
          }
        }}
        renderItem={({ item }) => {
          if (typeof item === "string") {
            if (item === TakePhotoID) {
              return <TakePhotoImage onPressNewPhoto={this.props.onPressNewPhoto} />
            } else if (item === BlankImageID) {
              return <View style={{ width: imageSize, height: imageSize, marginBottom: 20 }} />
            }
          } else {
            return (
              <ImageForURI
                key={item.image.uri}
                selected={!!this.state.selected.includes(item.image.uri)}
                data={item}
                onPressItem={this.onPressItem}
              />
            )
          }
        }}
      />
    )
  }
}
