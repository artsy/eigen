import React from "react"
import { LayoutAnimation, Route, ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import Text from "../Components/TextInput"
import Toggle from "../Components/Toggle"
import { ConsignmentSetup } from "../index"

import { Flex, Serif, Spacer, Theme } from "@artsy/palette"
import { BottomAlignedButton } from "../Components/BottomAlignedButton"
import { Form, Row } from "../Components/FormElements"

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
      <Theme>
        <BottomAlignedButton onPress={this.doneTapped} buttonText="Done">
          <Flex style={{ flex: 1 }} p={1}>
            <Form>
              <Flex justifyContent="space-between" alignItems="center" flexDirection="row" flexWrap="nowrap">
                <Flex style={{ flex: 1 }}>
                  <Serif size="5">Is this an edition?</Serif>
                </Flex>
                <Toggle selected={!!this.state.editionInfo} left="Yes" right="No" onPress={this.updateEdition} />
              </Flex>
              <Spacer mb={2} />
              {this.state.editionInfo ? (
                <>
                  <Row>
                    <Text
                      text={{
                        placeholder: "Edition Size",
                        keyboardType: "phone-pad",
                        onChangeText: this.updateEditionSize,
                        value: this.state.editionInfo && this.state.editionInfo.size,
                      }}
                    />
                    <Spacer mr={2} />
                    <Text
                      text={{
                        placeholder: "Edition Number",
                        onChangeText: this.updateEditionNumber,
                        value: this.state.editionInfo && this.state.editionInfo.number,
                      }}
                    />
                  </Row>
                  <Spacer mb={2} />
                </>
              ) : null}
              <Flex justifyContent="space-between" alignItems="center" flexDirection="row" flexWrap="nowrap">
                <Flex style={{ flex: 1 }}>
                  <Serif size="5">Is this work signed?</Serif>
                </Flex>
                <Toggle selected={this.state.signed} left="Yes" right="No" onPress={this.updateSigned} />
              </Flex>
              <Spacer mb={2} />
              <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
                <Flex style={{ flex: 1 }}>
                  <Serif size="5">Do you have a certificate of authenticity?</Serif>
                </Flex>
                <Spacer mr={2} />
                <Toggle selected={this.state.certificateOfAuth} left="Yes" right="No" onPress={this.updateCert} />
              </Flex>
            </Form>
          </Flex>
        </BottomAlignedButton>
      </Theme>
    )
  }
}
