import React, { Component } from "react"
import { TouchableWithoutFeedback, TouchableWithoutFeedbackProperties } from "react-native"
import styled from "styled-components/native"

import { Flex, FlexProps } from "../Elements/Flex"
import { theme } from "../Elements/Theme"
import { Sans12 } from "../Elements/Typography"
import { Fade } from "./Animation/Fade"

interface CheckboxState {
  checked: boolean
}

interface CheckboxProps extends TouchableWithoutFeedbackProperties, FlexProps {
  checked?: boolean
  disabled?: boolean
  error?: string
}

export class Checkbox extends Component<CheckboxProps, CheckboxState> {
  // The size of the checkbox
  private readonly checkboxSize = 20

  // Default border color
  private readonly defaultBorderColor = "black10"

  // The background color for the checkbox square box when `props.disabled` evaluates to `true`
  private readonly bgColorForDisabledState = "black5"

  // The color for the checkbox square box and the message when `props.error` is present
  private readonly borderColorForErrorState = "red100"

  constructor(props) {
    super(props)

    this.state = {
      checked: props.checked || false,
    }
  }

  onPress = event => {
    if (this.props.onPress) {
      this.props.onPress(event)
    }

    this.setState({
      checked: !this.state.checked,
    })
  }

  render() {
    const { error, disabled, children, ...props } = this.props

    const borderColor = error ? this.borderColorForErrorState : this.defaultBorderColor
    const bg = disabled ? this.bgColorForDisabledState : null

    return (
      <TouchableWithoutFeedback onPress={disabled ? () => null : this.onPress}>
        <Flex flexDirection="column" {...props}>
          <Flex mb={2} alignItems="center" flexDirection="row">
            <SquareBox borderColor={borderColor} bg={bg} width={this.checkboxSize} height={this.checkboxSize}>
              <Fade show={this.state.checked} duration={250}>
                {disabled ? <Disabled size={this.checkboxSize} /> : <Enabled size={this.checkboxSize} />}
              </Fade>
            </SquareBox>

            <Flex>{children}</Flex>
          </Flex>
          {error && <Sans12 color="red100">{error}</Sans12>}
        </Flex>
      </TouchableWithoutFeedback>
    )
  }
}

const SquareBox = props => <Flex justifyContent="center" alignItems="center" mr={3} border="2px solid" {...props} />

interface CheckmarkPropss {
  size: number
}

// This component represents the √ mark in CSS. We are not using styled-system since it's easier to specify raw CSS
// properties with styled-component.
const Enabled = styled.View.attrs<CheckmarkPropss>({})`
  transform: rotate(-45deg);
  top: -25%;
  left: -3%;
  width: ${props => props.size * 0.625};
  height: ${props => props.size * 0.3125};
  border-bottom-color: black;
  border-bottom-width: 2px;
  border-left-color: black;
  border-left-width: 2px;
`

const Disabled = Enabled.extend`
  border-bottom-color: ${theme.colors.black30};
  border-left-color: ${theme.colors.black30};
`
