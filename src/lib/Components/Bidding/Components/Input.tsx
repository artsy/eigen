import React, { Component } from "react"
import { TextInputProperties } from "react-native"
import { TextInput, TextInputProps } from "../Elements/TextInput"

interface InputProps extends TextInputProps, TextInputProperties {
  error?: boolean
  // In order to create a ref to a lower-level input component from a higher-level parent,
  // we pass in a function defined on the parent and call it with a pointer to the current Input.
  refName?: any
  createCustomRef?: any
  customOnBlur?: any
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

  componentDidUpdate(prevProps) {
    if (this.props.error !== prevProps.error) {
      this.setState({ borderColor: this.props.error ? "red100" : "black10" })
    }
  }

  onBlur() {
    if (this.props.customOnBlur) {
      this.props.customOnBlur()
    }

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
        ref={component => this.props.createCustomRef && this.props.createCustomRef(this.props.refName, component)}
        p={3}
        pb={2}
        {...this.props}
      />
    )
  }
}
