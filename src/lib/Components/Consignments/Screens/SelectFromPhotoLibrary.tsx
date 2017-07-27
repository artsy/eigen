import * as React from "react"

import Button from "../../Buttons/FlatWhite"
import DoneButton from "../Components/BottomAlignedButton"

import Circle from "../Components/CircleImage"
import ConsignmentBG from "../Components/ConsignmentBG"

import ImageSelection, { ImageData } from "../Components/ImageSelection"
import { BodyText as P } from "../Typography"

import {
  CameraRoll,
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

const uri1 = "https://d32dm0rphc51dk.cloudfront.net/Vq62IJMLbG1TuUjs-2fZCg/large.jpg"
const uri2 = "https://d32dm0rphc51dk.cloudfront.net/WAlGHmjlxTn3USMllNt4rA/large.jpg"

export default class Welcome extends React.Component<Props, State> {
  constructor() {
    super()
    this.state = {
      cameraImages: [],
      loadingMore: false,
      lastCursor: "",
      noMorePhotos: false,
    }

    // if (CameraRoll) {
    //   CameraRoll.getPhotos({ first: 5, assetType: "Photos" }).then(photos => {
    //     this.setState(() => {
    //       return {
    //         cameraImages: photos.edges.map(e => e.node),
    //       }
    //     })
    //   })
    // }
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
    const fetchParams: GetPhotosParamType = {
      first: 35,
      groupTypes: "SavedPhotos",
      assetType: "Photos",
      after: null,
    }

    if (this.state.lastCursor) {
      fetchParams.after = this.state.lastCursor
    }

    CameraRoll.getPhotos(fetchParams)
      .then(data => {
        this.appendAssets(data)
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

    if (assets.length > 0) {
      console.log(assets)
      // nextState.lastCursor = data.page_info.end_cursor
      // nextState.assets = this.state.assets.concat(assets)
      // nextState.dataSource = this.state.dataSource.cloneWithRows(_.chunk(nextState.assets, 3))
    }

    this.setState(nextState)
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
    console.log("OK")
  }

  render() {
    return (
      <ConsignmentBG>
        <DoneButton onPress={this.doneTapped} bodyStyle={doneButtonStyles} buttonText="DONE">
          <ScrollView style={{ flex: 1 }}>
            <View style={{ paddingTop: 40, alignItems: "center" }}>
              <P>We suggest adding a few photos of the work including the front and back as well as the signature.</P>
              <ImageSelection data={this.state.cameraImages} onPressNewPhoto={this.onPressNewPhoto} />
            </View>
          </ScrollView>
        </DoneButton>
      </ConsignmentBG>
    )
  }
}
