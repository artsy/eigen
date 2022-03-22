import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { LayoutAnimation, ViewProps } from "react-native"
import Text from "../Components/TextInput"
import Toggle from "../Components/Toggle"
import { ConsignmentSetup } from "../index"

import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Flex, Sans, Spacer } from "palette"
import { BottomAlignedButton } from "../Components/BottomAlignedButton"
import { Form, Row } from "../Components/FormElements"

interface Props extends ConsignmentSetup, ViewProps {
  navigator: NavigatorIOS
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
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    this.props.updateWithEdition(this.state)
    this.props.navigator.pop()
  }

  updateEdition = () => {
    // React Native's Typings are wrong here, I want to pass in
    // no arguments.
    const animate = LayoutAnimation.easeInEaseOut as any
    animate()

    this.setState({
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      editionInfo: this.state.editionInfo ? null : {},
    })
  }

  updateSigned = () => this.setState({ signed: !this.state.signed })
  updateCert = () => this.setState({ certificateOfAuth: !this.state.certificateOfAuth })

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  updateEditionSize = (text) =>
    this.setState({ editionInfo: { ...this.state.editionInfo, size: text } })
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  updateEditionNumber = (text) =>
    this.setState({ editionInfo: { ...this.state.editionInfo, number: text } })

  render() {
    return (
      <BottomAlignedButton onPress={this.doneTapped} buttonText="Done">
        <FancyModalHeader onLeftButtonPress={this.doneTapped}>
          Edition & Authenticity
        </FancyModalHeader>
        <Flex style={{ flex: 1 }} p={1}>
          <Form>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              flexDirection="row"
              flexWrap="nowrap"
            >
              <Flex style={{ flex: 1 }}>
                <Sans size="4">Is this an edition?</Sans>
              </Flex>
              <Toggle
                selected={!!this.state.editionInfo}
                left="Yes"
                right="No"
                onPress={this.updateEdition}
              />
            </Flex>
            <Spacer mb={2} />
            {this.state.editionInfo ? (
              <>
                <Row>
                  <Text
                    text={{
                      placeholder: "Edition size",
                      keyboardType: "phone-pad",
                      onChangeText: this.updateEditionSize,
                      value: this.state.editionInfo && this.state.editionInfo.size,
                    }}
                  />
                  <Spacer mr={2} />
                  <Text
                    text={{
                      placeholder: "Edition number",
                      onChangeText: this.updateEditionNumber,
                      value: this.state.editionInfo && this.state.editionInfo.number,
                    }}
                  />
                </Row>
                <Spacer mb={2} />
              </>
            ) : null}
            <Flex
              justifyContent="space-between"
              alignItems="center"
              flexDirection="row"
              flexWrap="nowrap"
            >
              <Flex style={{ flex: 1 }}>
                <Sans size="4">Is this work signed?</Sans>
              </Flex>
              <Toggle
                selected={this.state.signed! /* STRICTNESS_MIGRATION */}
                left="Yes"
                right="No"
                onPress={this.updateSigned}
              />
            </Flex>
            <Spacer mb={2} />
            <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
              <Flex style={{ flex: 1 }}>
                <Sans size="4">Do you have a certificate of authenticity?</Sans>
              </Flex>
              <Spacer mr={2} />
              <Toggle
                selected={this.state.certificateOfAuth! /* STRICTNESS_MIGRATION */}
                left="Yes"
                right="No"
                onPress={this.updateCert}
              />
            </Flex>
          </Form>
        </Flex>
      </BottomAlignedButton>
    )
  }
}
