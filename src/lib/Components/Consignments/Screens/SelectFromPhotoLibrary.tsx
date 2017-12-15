import React from "react"

import DoneButton from "../Components/BottomAlignedButton"
import ConsignmentBG from "../Components/ConsignmentBG"

import ImageSelection, { ImageData } from "../Components/ImageSelection"
import { BodyText as P } from "../Typography"

import triggerCamera from "../../../NativeModules/triggerCamera"

import { CameraRoll, Dimensions, NavigatorIOS, Route, ScrollView, View, ViewProperties } from "react-native"
import { ConsignmentSetup } from "../index"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  route: Route
  setup: ConsignmentSetup
  updateWithPhotos: (photos: string[]) => void
}

interface State {
  cameraImages: ImageData[]
  lastCursor: string
  loadingMore: boolean
  noMorePhotos: boolean
  selection: Set<string>
}

const doneButtonStyles = {
  backgroundColor: "black",
  marginBottom: 20,
  paddingTop: 18,
  height: 56,
}

export default class SelectFromPhotoLibrary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const hasPhotos = props.setup && props.setup.photos
    this.state = {
      cameraImages: [],
      loadingMore: false,
      lastCursor: "",
      noMorePhotos: false,
      selection: new Set(hasPhotos ? props.setup.photos.map(p => p.file) : []),
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
      // groupTypes: "all",
      assetType: "Photos",
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

    CameraRoll.getPhotos(fetchParams).then(data => {
      if (data && data.edges[0] && data.edges[0].node) {
        const photo = data.edges[0].node

        // Update selection
        this.state.selection.add(photo.image.uri)
        this.setState({
          selection: this.state.selection,
          // An item in cameraImage is a subset of the photo that we pass in,
          // so we `as any` to avoid a compiler error
          cameraImages: data.edges.map(e => e.node).concat(this.state.cameraImages as any),
        })
      } else {
        console.log("CameraRoll: Did not receive a photo from call to getPhotos")
      }
    })
  }

  appendAssets(data) {
    const assets = data.edges

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
    this.props.updateWithPhotos([...this.state.selection.values()])
    this.props.navigator.pop()
  }

  onPressNewPhoto = () => {
    triggerCamera(this).then(photo => {
      if (photo) {
        this.state.selection.add(photo.uri)
        this.setState({ selection: this.state.selection })
      }
    })
  }

  onNewSelectionState = (_state: Set<string>) => this.setState({ selection: this.state.selection })

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
              <ImageSelection
                data={this.state.cameraImages}
                onPressNewPhoto={this.onPressNewPhoto}
                onUpdateSelectedStates={this.onNewSelectionState}
                selected={this.state.selection}
              />
            </View>
          </ScrollView>
        </DoneButton>
      </ConsignmentBG>
    )
  }
}
