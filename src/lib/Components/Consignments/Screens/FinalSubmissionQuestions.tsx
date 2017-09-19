import * as React from "react"

import { LayoutAnimation, NavigatorIOS, Route, ScrollView, View, ViewProperties } from "react-native"
import Button from "../../Buttons/FlatWhite"
import ConsignmentBG from "../Components/ConsignmentBG"
import { BodyText, LargeHeadline, Subtitle } from "../Typography"

import { ConsignmentSetup, SearchResult } from "../"
import Spinner from "../../Spinner"
import TODO from "../Components/ArtworkConsignmentTodo"
import { Form, Label, Row } from "../Components/FormElements"
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

const Loader = (p, c) => <Spinner style={{ flex: 1 }} />

export default class FinalSubmissionQuestions extends React.Component<Props, ConsignmentSetup> {
  constructor(props) {
    super(props)
    this.state = props.setup
  }

  submitWork = () => {
    this.props.navigator.push({
      component: Loader,
    })
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

  updateSigned = () => this.setState({ signed: !this.state.signed })
  updateCert = () => this.setState({ certificateOfAuth: !this.state.certificateOfAuth })

  render() {
    return (
      <ConsignmentBG>
        <Form title="Answer a few questions about the work">
          <Row>
            <Label>Is this an edition?</Label>
            <Toggle selected={!!this.state.editionInfo} left="YES" right="NO" onPress={this.updateEdition} />
          </Row>

          {this.state.editionInfo
            ? <Row>
                <Text text={{ placeholder: "Edition Size", keyboardType: "phone-pad" }} style={{ margin: 10 }} />
                <Text text={{ placeholder: "Edition Number" }} style={{ margin: 10 }} />
              </Row>
            : null}

          <Row>
            <Label>Is this work signed?</Label>
            <Toggle selected={this.state.signed} left="YES" right="NO" onPress={this.updateSigned} />
          </Row>

          <Row>
            <Label>Do you have a certificate of authenticity?</Label>
            <Toggle selected={this.state.certificateOfAuth} left="YES" right="NO" onPress={this.updateCert} />
          </Row>
          <Row style={{ justifyContent: "center" }}>
            <View style={{ height: 43, width: 320, marginTop: 20 }}>
              <Button text="SUBMIT TO ARTSY" onPress={this.submitWork} style={{ flex: 1 }} />
            </View>
          </Row>
        </Form>
      </ConsignmentBG>
    )
  }
}
