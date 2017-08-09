import * as React from "react"

import { LayoutAnimation, NavigatorIOS, Route, ScrollView, View, ViewProperties } from "react-native"
import ConsignmentBG from "../Components/ConsignmentBG"
import { BodyText, LargeHeadline, Subtitle } from "../Typography"

import { ArtistResult, ConsignmentSetup } from "../"
import TODO from "../Components/ArtworkConsignmentTodo"
import Text from "../Components/TextInput"
import Toggle from "../Components/Toggle"
import Artist from "./Artist"
import Provenance from "./Provenance"
import SelectFromPhotoLibrary from "./SelectFromPhotoLibrary"
import Welcome from "./Welcome"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  route: Route // this gets set by NavigatorIOS
  setup: ConsignmentSetup
}

export default class FinalSubmissionQuestions extends React.Component<Props, ConsignmentSetup> {
  constructor(props) {
    super(props)
    this.state = props.setup
  }

  submitWork = () => {
    // OK
  }

  updateEdition = () => {
    // React Native's Typings are wrong here, I want to pass in
    // no arguments.
    const animate = LayoutAnimation.easeInEaseOut as any
    animate()

    this.setState({
      editionInfo: this.state.editionInfo ? null : {},
    })
  }

  updateSigned = () => this.setState({ signed: this.state.signed ? false : true })
  updateCert = () => this.setState({ certificateOfAuth: this.state.certificateOfAuth ? false : true })

  render() {
    const title = "Answer a few questions about the work"

    return (
      <ConsignmentBG>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ paddingTop: 40 }}>
            <LargeHeadline>
              {title}
            </LargeHeadline>
          </View>
          <View style={{ padding: 10 }}>
            <View style={{ flexDirection: "row", paddingVertical: 6, alignItems: "center" }}>
              <BodyText style={{ paddingLeft: 10, flex: 1, textAlign: "left" }}>Is this an edition?</BodyText>
              <Toggle selected={!!this.state.editionInfo} left="NO" right="YES" onPress={this.updateEdition} />
            </View>

            {this.state.editionInfo
              ? <View style={{ flexDirection: "row", paddingVertical: 6 }}>
                  <Text text={{ placeholder: "Edition Size" }} style={{ margin: 10 }} />
                  <Text text={{ placeholder: "Edition Number" }} style={{ margin: 10 }} />
                </View>
              : null}

            <View style={{ flexDirection: "row", paddingVertical: 6, alignItems: "center" }}>
              <BodyText style={{ paddingLeft: 10, flex: 1, textAlign: "left" }}>Is this work signed?</BodyText>
              <Toggle selected={this.state.signed} left="NO" right="YES" onPress={this.updateSigned} />
            </View>

            <View style={{ flexDirection: "row", paddingVertical: 6, alignItems: "center" }}>
              <BodyText style={{ paddingLeft: 10, flex: 1, textAlign: "left" }}>
                Do you have a certificate of authenticity?
              </BodyText>
              <Toggle selected={this.state.certificateOfAuth} left="NO" right="YES" onPress={this.updateCert} />
            </View>
          </View>
        </ScrollView>
      </ConsignmentBG>
    )
  }
}
