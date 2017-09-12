import * as React from "react"

import * as _ from "lodash"

import Button from "../../Buttons/FlatWhite"
import DoneButton from "../Components/BottomAlignedButton"

import Circle from "../Components/CircleImage"
import ConsignmentBG from "../Components/ConsignmentBG"

import ImageSelection, { ImageData } from "../Components/ImageSelection"
import { BodyText as P } from "../Typography"

import triggerCamera from "../../../NativeModules/triggerCamera"

import {
  CameraRoll,
  Dimensions,
  GetPhotosParamType,
  GetPhotosReturnType,
  NavigatorIOS,
  Route,
  ScrollView,
  View,
  ViewProperties,
} from "react-native"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  route: Route
}

interface State {
  cameraImages: ImageData[]
  lastCursor: string
  loadingMore: boolean
  noMorePhotos: boolean
}

const doneButtonStyles = {
  backgroundColor: "black",
  marginBottom: 20,
  paddingTop: 18,
  height: 56,
}

export default class SelectFromPhotoLibrary extends React.Component<Props, State> {
  constructor() {
    super()
    this.state = {
      cameraImages: [],
      loadingMore: false,
      lastCursor: "",
      noMorePhotos: false,
    }
  }

  componentDidMount() {
    this.tryPhotoLoad()
  }

  tryPhotoLoad() {
    if (!this.state.loadingMore) {
      this.setState({ loadingMore: true }, () => {
        this.loadPhotos()
      })
    }
  }

  loadPhotos() {
    // TODO: Need to update the RN 0.48 types on DT
    // const fetchParams: GetPhotosParamType = {
    const fetchParams: any = {
      first: 20,
      groupTypes: "all",
      assetType: "photos",
    }

    if (this.state.lastCursor) {
      fetchParams.after = this.state.lastCursor
    }

    // This isn't optimal, but CameraRoll isn't provided in
    // the React Native mock from Jest. This means that it
    // can't be tested, and it will be undefined.
    const inTesting = typeof jest !== "undefined"
    if (inTesting) {
      return
    }
    console.log(fetchParams)
    CameraRoll.getPhotos(fetchParams)
      .then(data => {
        this.appendAssets(data)
        console.log(data)
      })
      .catch(e => {
        console.log(e)
      })
  }

  appendAssets(data) {
    const assets = data.edges
    const nextState = {
      loadingMore: false,
      noMorePhotos: !data.page_info.has_next_page,
    }

    if (assets.length === 0) {
      this.setState({
        loadingMore: false,
        noMorePhotos: !data.page_info.has_next_page,
      })
    } else {
      this.setState({
        loadingMore: false,
        noMorePhotos: !data.page_info.has_next_page,
        lastCursor: data.page_info.end_cursor,
        cameraImages: this.state.cameraImages.concat(assets.map(a => a.node)),
      })
    }
  }

  onScroll(e) {
    const windowHeight = Dimensions.get("window").height
    const height = e.nativeEvent.contentSize.height
    const offset = e.nativeEvent.contentOffset.y

    if (windowHeight + offset >= height) {
      this.tryPhotoLoad()
    }
  }

  endReached() {
    if (!this.state.noMorePhotos) {
      this.tryPhotoLoad()
    }
  }

  doneTapped = () => {
    this.props.navigator.pop()
  }

  onPressNewPhoto = () => {
    triggerCamera(this).then(photo => {
      if (photo) {
        console.log("Cancelled")
      } else {
        console.log("Got photo back")
        console.log(photo)
      }
    })
  }

  render() {
    return (
      <ConsignmentBG>
        <DoneButton onPress={this.doneTapped} bodyStyle={doneButtonStyles} buttonText="DONE">
          <ScrollView
            style={{ flex: 1 }}
            scrollsToTop={true}
            onScroll={this.onScroll.bind(this)}
            scrollEventThrottle={50}
          >
            <View style={{ paddingTop: 40 }}>
              <P>We suggest adding a few photos of the work including the front and back as well as the signature.</P>
              <ImageSelection data={this.state.cameraImages} onPressNewPhoto={this.onPressNewPhoto} />
            </View>
          </ScrollView>
        </DoneButton>
      </ConsignmentBG>
    )
  }
}
