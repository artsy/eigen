import * as React from "react"

import { Keyboard, KeyboardAvoidingView, TextInput, TouchableWithoutFeedback } from "react-native"

import styled from "styled-components/native"
import colors from "../../../../data/colors"
import fonts from "../../../../data/fonts"

const Container = styled.View`
  flexDirection: row
  justifyContent: space-between
  alignItems: center
  borderWidth: 1
  borderColor: ${colors["gray-regular"]}
  borderRadius: 3
  marginBottom: 20
`

const SendButton = styled.Text`
  fontFamily: ${fonts["avant-garde-regular"]}
  fontSize: 12
  marginRight: 10
`

interface Props {
  onSubmit: (text: string) => any,
}

interface State {
  active: boolean,
  text: string,
}

export default class Composer extends React.Component<any, State> {
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
    this.input.clear()
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.text)
    }
  }

  render() {
    // The TextInput loses its isFocused() callback as a styled component
    const inputStyles = {
      flex: 1,
      fontFamily: fonts["garamond-regular"],
      fontSize: 12,
      paddingLeft: 10,
      paddingTop: 10,
      paddingBottom: 10,
      paddingRight: 10,
    }

    const sendButtonColor = this.state.text && this.state.text.length ?
                              colors["purple-regular"] : colors["gray-regular"]
    return (
      <KeyboardAvoidingView behavior={"padding"}>
        <Container style={{ backgroundColor: this.state.active ? "white" : colors["gray-light"] }}>
          <TextInput placeholder={"Reply..."}
                  placeholderTextColor={colors["gray-semibold"]}
                  keyboardAppearance={"dark"}
                  onEndEditing={() => {
                    this.input.clear()
                    this.setState({active: false, text: null})
                  }}
                  onFocus={() => this.setState({active: this.input.isFocused()})}
                  onChangeText={(text) => this.setState({text})}
                  ref={input => this.input = input}
                  style={inputStyles}
                  multiline={true}
          />
          <TouchableWithoutFeedback onPress={this.submitText.bind(this)}>
            <SendButton style={{color: sendButtonColor}}>SEND</SendButton>
          </TouchableWithoutFeedback>
        </Container>
      </KeyboardAvoidingView>
    )
  }
}
