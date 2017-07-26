import * as React from "react"

import Button from "../../Buttons/FlatWhite"
import DoneButton from "../Components/BottomAlignedButton"

import Circle from "../Components/CircleImage"
import ConsignmentBG from "../Components/ConsignmentBG"

import ImageSelection, { ImageData } from "../Components/ImageSelection"
import { BodyText as P } from "../Typography"

import { CameraRoll, GetPhotosReturnType, NavigatorIOS, Route, ScrollView, View, ViewProperties } from "react-native"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  route: Route
}

interface State {
  cameraImages: ImageData[]
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
    }

    CameraRoll.getPhotos({ first: 5, assetType: "Photos" }).then(photos => {
      this.setState(() => {
        return {
          cameraImages: photos.edges.map(e => e.node),
        }
      })
    })
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
