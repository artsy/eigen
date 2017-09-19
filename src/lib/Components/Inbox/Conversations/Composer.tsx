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
  disabled: boolean
}

const SendButton = styled.Text`
  font-family: ${fonts["avant-garde-regular"]};
  font-size: 12;
  margin-right: 10;
  color: ${(p: StyledSendButtonProps) => (p.disabled ? colors["gray-regular"] : colors["purple-regular"])};
`

interface Props {
  disabled?: boolean
  onSubmit?: (text: string) => any
  value?: string
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
    Keyboard.dismiss()
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.text)
      this.setState({ text: null })
    }
  }

  componentDidUpdate() {
    if (this.props.value && !this.state.text) {
      this.setState({ text: this.props.value })
    }
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

    const disableSendButton = !(this.state.text && this.state.text.length) || this.props.disabled

    return (
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={20} style={{ flex: 1 }}>
        {this.props.children}
        <Container active={this.state.active}>
          <TextInput
            placeholder={"Reply..."}
            placeholderTextColor={colors["gray-semibold"]}
            keyboardAppearance={"dark"}
            onEndEditing={() => {
              this.setState({ active: false })
            }}
            onFocus={() => this.setState({ active: this.input.isFocused() })}
            onChangeText={text => this.setState({ text })}
            ref={input => (this.input = input)}
            style={inputStyles}
            multiline={true}
            value={this.state.text}
          />
          <TouchableWithoutFeedback disabled={disableSendButton} onPress={this.submitText.bind(this)}>
            <SendButton disabled={disableSendButton}>SEND</SendButton>
          </TouchableWithoutFeedback>
        </Container>
      </KeyboardAvoidingView>
    )
  }
}
