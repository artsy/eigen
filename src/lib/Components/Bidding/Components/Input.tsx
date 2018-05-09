import React, { Component } from "react"
import { TextInputProperties } from "react-native"
import { TextInput, TextInputProps } from "../Elements/TextInput"

interface InputProps extends TextInputProps, TextInputProperties {
  error?: boolean
}

class InputState {
  borderColor: "black10" | "purple100" | "red100"
}

export class Input extends Component<InputProps, InputState> {
  constructor(props) {
    super(props)

    this.state = {
      borderColor: this.props.error ? "red100" : "black10",
    }
  }

  onBlur() {
    this.setState({
      borderColor: this.props.error ? "red100" : "black10",
    })
  }

  onFocus() {
    this.setState({ borderColor: "purple100" })
  }

  render() {
    return (
      <TextInput
        border={1}
        borderColor={this.state.borderColor}
        fontSize={3}
        onBlur={() => this.onBlur()}
        onFocus={() => this.onFocus()}
        p={3}
        pb={2}
        {...this.props}
      />
    )
  }
}
