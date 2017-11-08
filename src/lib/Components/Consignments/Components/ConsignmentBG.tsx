import React from "react"
import { Image, LayoutChangeEvent, View, ViewProperties, ViewStyle } from "react-native"

import styled from "styled-components/native"

import SwitchBoard from "../../../NativeModules/SwitchBoard"
import CloseButton from "../Components/CloseButton"

import PropTypes from "prop-types"

// Full screen black
const BG = styled.View`
  background-color: black;
  flex: 1;
`

// Centered max-width of 600px
const ConsignmentContainer = styled.View`
  background-color: black;
  width: 100%;
  height: 100%;
  align-self: center;
`

interface Props extends ViewProperties {
  showCloseButton?: boolean
}

export default class ConsignmentBG extends React.Component<Props> {
  exitModal = () => SwitchBoard.dismissModalViewController(this)

  onLayout = (event: LayoutChangeEvent) => {
    const layout = event.nativeEvent.layout
  }

  render() {
    return (
      <BG key="bg">
        {this.props.showCloseButton ? <CloseButton onPress={this.exitModal} /> : null}
        <ConsignmentContainer>
          {this.props.children}
        </ConsignmentContainer>
      </BG>
    )
  }
}
