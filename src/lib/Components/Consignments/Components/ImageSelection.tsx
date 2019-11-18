import React from "react"
import {
  Dimensions,
  Image,
  ListView,
  ListViewDataSource,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native"

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
  selected?: Set<string>
  onPressNewPhoto?: () => void
  onUpdateSelectedStates?: (selectionSet: Set<string>) => void
}

interface State {
  selected: Set<string>
  dataSource: ListViewDataSource
}

const TakePhotoID = "take_photo"
const BlankImageID = "blank"

export default class ImageSelection extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      selected: props.selected ? props.selected : new Set(),
      dataSource: this.dataSourceFromData(props.data, isPad),
    }
  }

  // Whenever props changes we need to be able to set a new version of the datasource
  // see: https://github.com/facebook/react-native/issues/4104
  UNSAFE_componentWillReceiveProps(nextProps) {
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
    this.setState(_state => {
      const selected = this.state.selected
      const selectedAlready = selected.has(id)
      if (selectedAlready) {
        selected.delete(id)
      } else {
        selected.add(id)
      }

      if (this.props.onUpdateSelectedStates) {
        this.props.onUpdateSelectedStates(selected)
      }

      // This is probably inefficient, but it works.
      const dataSource = this.dataSourceFromData(this.props.data, isPad)
      return { dataSource }
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
          selected={!!this.state.selected.has(d.image.uri)}
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
