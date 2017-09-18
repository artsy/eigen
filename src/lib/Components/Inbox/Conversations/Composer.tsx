import * as React from "react"

import { Keyboard, KeyboardAvoidingView, TextInput, TouchableWithoutFeedback } from "react-native"

import styled from "styled-components/native"
import colors from "../../../../data/colors"
import fonts from "../../../../data/fonts"

interface ContainerProps {
  active: boolean
}

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-width: 1;
  border-color: ${colors["gray-regular"]};
  border-radius: 3;
  margin: 0 20px 20px;
  background-color: ${(p: ContainerProps) => (p.active ? "white" : colors["gray-light"])};
`

interface StyledSendButtonProps {
  containsText: boolean
}

const SendButton = styled.Text`
  font-family: ${fonts["avant-garde-regular"]};
  font-size: 12;
  margin-right: 10;
  color: ${(p: StyledSendButtonProps) => (p.containsText ? colors["purple-regular"] : colors["gray-regular"])};
`

interface Props {
  disabled?: boolean
  onSubmit?: (text: string) => any
}

interface State {
  active: boolean
  text: string
}

export default class Composer extends React.Component<Props, State> {
  input?: TextInput | any

  constructor(props) {
    super(props)

    this.state = {
      active: false,
      text: null,
    }
  }

  submitText() {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.text)
    }
    Keyboard.dismiss()
    this.input.clear()
  }

  render() {
    // The TextInput loses its isFocused() callback as a styled component
    const inputStyles = {
      flex: 1,
      fontFamily: fonts["garamond-regular"],
      fontSize: 13,
      paddingLeft: 10,
      paddingTop: 13,
      paddingBottom: 10,
      paddingRight: 10,
    }

    return (
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={20} style={{ flex: 1 }}>
        {this.props.children}
        <Container active={this.state.active}>
          <TextInput
            placeholder={"Reply..."}
            placeholderTextColor={colors["gray-semibold"]}
            keyboardAppearance={"dark"}
            onEndEditing={() => {
              this.input.clear()
              this.setState({ active: false, text: null })
            }}
            onFocus={() => this.setState({ active: this.input.isFocused() })}
            onChangeText={text => this.setState({ text })}
            ref={input => (this.input = input)}
            style={inputStyles}
            multiline={true}
            editable={!this.props.disabled}
          />
          <TouchableWithoutFeedback onPress={this.submitText.bind(this)}>
            <SendButton containsText={!!(this.state.text && this.state.text.length)}>SEND</SendButton>
          </TouchableWithoutFeedback>
        </Container>
      </KeyboardAvoidingView>
    )
  }
}
