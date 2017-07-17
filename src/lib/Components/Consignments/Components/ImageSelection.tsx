import * as React from "react"
import {
  ButtonProperties,
  FlatList,
  Image,
  ListView,
  ListViewDataSource,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native"

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
  data: ImageData
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
      borderWidth: 2,
      borderColor: null,

      height: 158,
      width: 158,
      margin: 4,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Image source={require("../images/camera-black@2x.png")} />
  </TouchableHighlight>

const ImageForURI = (props: ImagePreviewProps) =>
  <TouchableHighlight
    onPress={() => props.onPressItem(props.data.image.uri)}
    style={{
      backgroundColor: colors["gray-regular"],
      height: 158,
      width: 158,
      margin: 4,
      borderColor: props.selected ? "white" : null,
      borderWidth: 2,
    }}
  >
    <Image source={{ uri: props.data.image.uri }} style={{ height: 154, width: 154 }} />
  </TouchableHighlight>

interface Props {
  data: ImageData[]
  onPressNewPhoto?: () => void
}

interface State {
  selected: Map<string, boolean>
  dataSource: ListViewDataSource
}

export default class ImageSelection extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      selected: new Map(),
      dataSource: ds.cloneWithRows([null, ...props.data]),
    }
  }

  onPressItem = (id: string) => {
    this.setState(state => {
      const selected = new Map(state.selected)
      selected.set(id, !selected.get(id))

      // This is probably inefficient, but it works.
      const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
      const dataSource = ds.cloneWithRows([null, ...this.props.data])

      return { selected, dataSource }
    })
  }

  renderRow = (d: ImageData | null) =>
    d
      ? <ImageForURI
          key={d.image.uri}
          selected={!!this.state.selected.get(d.image.uri)}
          data={d}
          onPressItem={this.onPressItem}
        />
      : <TakePhotoImage onPressNewPhoto={this.props.onPressNewPhoto} />

  render() {
    return (
      <ListView contentContainerStyle={styles.list} dataSource={this.state.dataSource} renderRow={this.renderRow} />
    )
  }
}

const styles = StyleSheet.create({
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  row: {
    height: 158,
    width: 158,
  },
})
