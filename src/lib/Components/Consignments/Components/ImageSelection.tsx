import React from "react"
import { Dimensions, FlatList, Image, StyleSheet, TouchableHighlight, TouchableOpacity, View } from "react-native"

import styled from "styled-components/native"

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

const isPad = Dimensions.get("window").width > 700

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
  <ImageBG style={{ backgroundColor: "white", position: "absolute", top: 120, left: 120 }}>
    <Image source={require("../../../../../images/consignments/black-tick.png")} />
  </ImageBG>
)

const TakePhotoImage = (props: TakePhotoImageProps) => (
  <TouchableOpacity
    onPress={props.onPressNewPhoto}
    style={{
      backgroundColor: "white",
      borderWidth: 2,
      borderColor: null,

      height: 158,
      width: 158,
      margin: 4,
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
      borderWidth: 2,
      borderColor: props.selected ? "white" : null,
      margin: 4,
      height: 158,
      width: 158,
    }}
  >
    <TouchableHighlight
      onPress={() => props.onPressItem(props.data.image.uri)}
      style={{
        opacity: props.selected ? 0.5 : 1.0,
      }}
    >
      <Image source={{ uri: props.data.image.uri }} style={{ height: 154, width: 154 }} />
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

  renderRow = (d: ImageData & string) => {
    if (d === TakePhotoID) {
      return <TakePhotoImage onPressNewPhoto={this.props.onPressNewPhoto} />
    } else if (d === BlankImageID) {
      return <View style={{ width: 158, height: 158 }} />
    } else {
      return (
        <ImageForURI
          key={d.image.uri}
          selected={!!this.state.selected.includes(d.image.uri)}
          data={d}
          onPressItem={this.onPressItem}
        />
      )
    }
  }

  render() {
    const data = isPad ? [TakePhotoID, ...this.props.data] : [TakePhotoID, ...this.props.data, BlankImageID]
    return (
      <FlatList
        data={data}
        contentContainerStyle={styles.list}
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
              return <View style={{ width: 158, height: 158 }} />
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

const styles = StyleSheet.create({
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  row: {
    height: 158,
    width: 158,
  },
})
