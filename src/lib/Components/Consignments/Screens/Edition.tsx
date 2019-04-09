import React from "react"

import ConsignmentBG from "../Components/ConsignmentBG"
import DoneButton from "../Components/DoneButton"

import { LayoutAnimation, Route, ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"

import Text from "../Components/TextInput"
import Toggle from "../Components/Toggle"
import { ConsignmentSetup } from "../index"

import { Form, Label, Row } from "../Components/FormElements"

interface Props extends ConsignmentSetup, ViewProperties {
  navigator: NavigatorIOS
  route: Route
  setup: ConsignmentSetup
  updateWithEdition?: (setup: ConsignmentSetup) => void
}

export default class Edition extends React.Component<Props, ConsignmentSetup> {
  constructor(props: Props) {
    super(props)
    this.state = props.setup
  }

  doneTapped = () => {
    this.setState({ editionScreenViewed: true }, this.updateAndCloseScreen)
  }

  updateAndCloseScreen = () => {
    this.props.updateWithEdition(this.state)
    this.props.navigator.pop()
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

  updateEditionSize = text => this.setState({ editionInfo: { ...this.state.editionInfo, size: text } })
  updateEditionNumber = text => this.setState({ editionInfo: { ...this.state.editionInfo, number: text } })

  render() {
    return (
      <ConsignmentBG>
        <DoneButton onPress={this.doneTapped}>
          <Form>
            <Row>
              <Label>Is this an edition?</Label>
              <Toggle selected={!!this.state.editionInfo} left="YES" right="NO" onPress={this.updateEdition} />
            </Row>

            {this.state.editionInfo ? (
              <Row>
                <Text
                  text={{
                    placeholder: "Edition Size",
                    keyboardType: "phone-pad",
                    onChangeText: this.updateEditionSize,
                    value: this.state.editionInfo && this.state.editionInfo.size,
                  }}
                  style={{ margin: 10 }}
                />
                <Text
                  text={{
                    placeholder: "Edition Number",
                    onChangeText: this.updateEditionNumber,
                    value: this.state.editionInfo && this.state.editionInfo.number,
                  }}
                  style={{ margin: 10 }}
                />
              </Row>
            ) : null}

            <Row>
              <Label>Is this work signed?</Label>
              <Toggle selected={this.state.signed} left="YES" right="NO" onPress={this.updateSigned} />
            </Row>

            <Row>
              <Label>Do you have a certificate of authenticity?</Label>
              <Toggle selected={this.state.certificateOfAuth} left="YES" right="NO" onPress={this.updateCert} />
            </Row>
          </Form>
        </DoneButton>
      </ConsignmentBG>
    )
  }
}
