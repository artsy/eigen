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
      height: 158,
      width: 158,
      justifyContent: "center",
      padding: 5,
      margin: 10,
      alignItems: "center",
    }}
  >
    <Image source={require("../../../../../images/consignments/hammer.png")} style={{ height: 158, width: 158 }} />
  </TouchableHighlight>

const ImageForURI = (props: ImagePreviewProps) =>
  <TouchableHighlight
    onPress={() => props.onPressItem(props.data.image.uri)}
    style={{
      backgroundColor: colors["gray-regular"],
      height: 158,
      width: 158,
      borderColor: props.selected ? "white" : null,
      borderWidth: 2,
    }}
  >
    <Image source={{ uri: props.data.image.uri }} style={{ height: 158, width: 158 }} />
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
      return { selected }
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
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  row: {
    justifyContent: "center",
    padding: 5,
    margin: 10,
    width: 100,
    height: 100,
    backgroundColor: "#F6F6F6",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#CCC",
  },
  thumb: {
    width: 64,
    height: 64,
  },
  text: {
    flex: 1,
    marginTop: 5,
    fontWeight: "bold",
  },
})
