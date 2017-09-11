import * as React from "react"
import {
  ButtonProperties,
  Dimensions,
  FlatList,
  Image,
  ListView,
  ListViewDataSource,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
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

const TakePhotoImage = (props: TakePhotoImageProps) =>
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

const TakePhotoID = "take_photo"
const BlankImageID = "blank"

export default class ImageSelection extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      selected: new Map(),
      dataSource: this.dataSourceFromData(props.data, isPad),
    }
  }

  // Whenever props changes we need to be able to set a new version of the datasource
  // see: https://github.com/facebook/react-native/issues/4104
  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({
        dataSource: this.dataSourceFromData(nextProps.data, isPad),
      })
    }
  }

  // Standardized way to create a datasource
  dataSourceFromData = (data, isLargeWidth) => {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    const rows = isLargeWidth ? [TakePhotoID, ...data] : [TakePhotoID, ...data, BlankImageID]
    return ds.cloneWithRows(rows)
  }

  onPressItem = (id: string) => {
    this.setState(state => {
      const selected = new Map(state.selected)
      selected.set(id, !selected.get(id))

      // This is probably inefficient, but it works.
      const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
      const dataSource = this.dataSourceFromData(this.props.data, isPad)
      return { selected, dataSource }
    })
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
          selected={!!this.state.selected.get(d.image.uri)}
          data={d}
          onPressItem={this.onPressItem}
        />
      )
    }
  }

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
    justifyContent: "center",
  },
  row: {
    height: 158,
    width: 158,
  },
})
