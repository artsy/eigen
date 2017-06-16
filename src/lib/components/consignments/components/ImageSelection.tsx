import * as React from "react"
import { ButtonProperties, FlatList, Image, Text, TouchableHighlight, View } from "react-native"

import { chunk } from "lodash"

import styled from "styled-components/native"
import colors from "../../../../data/colors"
import fonts from "../../../../data/fonts"

import { ConsignmentSetup } from "../index"

const Photo = styled.TouchableHighlight`
  color: white;
  font-family: "${fonts["avant-garde-regular"]}";
  flex: 1;
`

interface ImageData {
  image: {
    uri: string
  }
}

interface ImagePreviewProps {
  image: ImageData
  selected: boolean
  onPressItem: (uri: string) => void
}

interface TakePhotoImageProps {
  onPressNewPhoto: () => void
}

const TakePhotoImage = (props: TakePhotoImageProps) =>
  <TouchableHighlight
    onPress={props.onPressNewPhoto}
    style={{
      backgroundColor: "white",
      height: 158,
      width: 158,
    }}
  >
    <Image source={{ uri: "" }} style={{ height: 158, width: 158 }} />
  </TouchableHighlight>

const ImageForURI = (props: ImagePreviewProps) =>
  <TouchableHighlight
    onPress={() => props.onPressItem(props.image.image.uri)}
    style={{
      backgroundColor: colors["gray-regular"],
      height: 158,
      width: 158,
      borderColor: props.selected ? "white" : null,
      borderWidth: 2,
    }}
  >
    <Image source={{ uri: props.image.image.uri }} style={{ height: 158, width: 158 }} />
  </TouchableHighlight>

interface ImageViewCoupletProps {
  first: ImageData
  second: ImageData
  firstSelected: boolean
  secondSelected: boolean
  onPressItem: (uri: string) => void
  onPressNewPhoto: () => void
}

const ImageViewCouplet = (props: ImageViewCoupletProps) =>
  <View style={{ flexDirection: "row" }}>
    {props.first
      ? <ImageForURI image={props.first} onPressItem={props.onPressItem} selected={props.firstSelected} />
      : <TakePhotoImage onPressNewPhoto={props.onPressNewPhoto} />}
    {props.second
      ? <ImageForURI image={props.second} onPressItem={props.onPressItem} selected={props.secondSelected} />
      : null}
  </View>

interface Props {
  data: ImageData[]
  onPressNewPhoto?: () => void
}

interface State {
  selected: Map<string, boolean>
  data: ImageData[][] // because it gets chopped into pairs
}

export default class ImageSelection extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      selected: new Map(),
      data: chunk([null, ...props.data], 2),
    }
  }

  keyExtractor = (item, index) => (item[0] ? item[0].image.uri : item[1] ? item[1].image.uri : "")

  onPressItem = (id: string) => {
    this.setState(state => {
      const selected = new Map(state.selected)
      selected.set(id, !selected.get(id))
      return { selected }
    })
  }

  renderItem = ({ item }) =>
    <ImageViewCouplet
      first={item[0]}
      firstSelected={item[0] && !!this.state.selected.get(item[0].image.uri)}
      second={item[1]}
      secondSelected={item[1] && !!this.state.selected.get(item[1].image.uri)}
      onPressItem={this.onPressItem}
      onPressNewPhoto={this.props.onPressNewPhoto}
    />

  render() {
    return (
      <FlatList
        data={this.state.data}
        extraData={this.state}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
      />
    )
  }
}
