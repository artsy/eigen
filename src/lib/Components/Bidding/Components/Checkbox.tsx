import React, { Component } from "react"
import { StyleSheet, TouchableWithoutFeedback, TouchableWithoutFeedbackProperties } from "react-native"
import styled from "styled-components/native"

import { Flex, FlexProps } from "../Elements/Flex"
import { theme } from "../Elements/Theme"
import { CssTransition } from "./Animation/CssTransition"

interface CheckboxState {
  checked: boolean
}

interface CheckboxProps extends TouchableWithoutFeedbackProperties, FlexProps {
  checked?: boolean
  disabled?: boolean
  error?: boolean
}

export class Checkbox extends Component<CheckboxProps, CheckboxState> {
  private readonly checkboxSize = 20

  private readonly duration = 250

  private readonly defaultCheckboxStyle = {
    backgroundColor: theme.colors.white100,
    borderColor: theme.colors.black10,
  }

  private readonly checkedCheckboxStyle = {
    backgroundColor: theme.colors.black100,
    borderColor: theme.colors.black100,
  }

  private readonly disabledCheckboxStyle = {
    backgroundColor: theme.colors.black5,
    borderColor: theme.colors.black10,
  }

  private readonly checkboxStyles = {
    default: {
      unchecked: this.defaultCheckboxStyle,
      checked: this.checkedCheckboxStyle,
    },
    error: {
      unchecked: Object.assign({}, this.defaultCheckboxStyle, { borderColor: theme.colors.red100 }),
      checked: this.checkedCheckboxStyle,
    },
  }

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
    const { checked } = this.state

    let checkboxStyle
    if (disabled) {
      checkboxStyle = this.disabledCheckboxStyle
    } else {
      checkboxStyle = this.checkboxStyles[error ? "error" : "default"][checked ? "checked" : "unchecked"]
    }

    return (
      <TouchableWithoutFeedback onPress={disabled ? () => null : this.onPress}>
        <Flex alignItems="center" flexDirection="row" {...props}>
          <CssTransition
            style={[styles.container, checkboxStyle]}
            animate={["backgroundColor", "borderColor"]}
            duration={this.duration}
          >
            {checked && (disabled ? <DisabledMark size={this.checkboxSize} /> : <CheckMark size={this.checkboxSize} />)}
          </CssTransition>

          <Flex>{children}</Flex>
        </Flex>
      </TouchableWithoutFeedback>
    )
  }
}

// styled-component does not have support for Animated.View
const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "solid",
    marginRight: theme.space[3],
    width: 20,
    height: 20,
  },
})

interface CheckMarkProps {
  size: number
}

// This component represents the √ mark in CSS. We are not using styled-system since it's easier to specify raw CSS
// properties with styled-component.
export const CheckMark = styled.View.attrs<CheckMarkProps>({})`
  transform: rotate(-45deg);
  top: -12%;
  width: ${props => props.size * 0.625};
  height: ${props => props.size * 0.3125};
  border-bottom-color: white;
  border-bottom-width: 2px;
  border-left-color: white;
  border-left-width: 2px;
`

export const DisabledMark = styled(CheckMark)`
  border-bottom-color: ${theme.colors.black30};
  border-left-color: ${theme.colors.black30};
`
