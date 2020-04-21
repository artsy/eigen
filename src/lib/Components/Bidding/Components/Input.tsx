import React, { Component } from "react"
import { TextInputProperties } from "react-native"
import { TextInput, TextInputProps } from "../Elements/TextInput"

export interface InputProps extends TextInputProps, TextInputProperties {
  error?: boolean
  inputRef?: (component: any) => void
}

interface InputState {
  borderColor: "black10" | "purple100" | "red100"
}

export class Input extends Component<InputProps, InputState> {
  // @ts-ignore STRICTNESS_MIGRATION
  constructor(props) {
    super(props)

    this.state = {
      borderColor: this.props.error ? "red100" : "black10",
    }
  }

  // @ts-ignore STRICTNESS_MIGRATION
  componentDidUpdate(prevProps) {
    if (this.props.error !== prevProps.error) {
      this.setState({ borderColor: this.props.error ? "red100" : "black10" })
    }
  }

  // @ts-ignore STRICTNESS_MIGRATION
  onBlur(e) {
    if (this.props.onBlur) {
      this.props.onBlur(e)
    }

    this.setState({
      borderColor: this.props.error ? "red100" : "black10",
    })
  }

  // @ts-ignore STRICTNESS_MIGRATION
  onFocus(e) {
    if (this.props.onFocus) {
      this.props.onFocus(e)
    }

    this.setState({ borderColor: "purple100" })
  }

  render() {
    return (
      <TextInput
        border={1}
        borderColor={this.state.borderColor}
        fontSize={3}
        p={3}
        pb={2}
        {...this.props}
        // These props should not be overridden so they are declared after `{...this.props}`
        ref={this.props.inputRef}
        // @ts-ignore STRICTNESS_MIGRATION
        onBlur={e => this.onBlur(e)}
        // @ts-ignore STRICTNESS_MIGRATION
        onFocus={e => this.onFocus(e)}
      />
    )
  }
}
