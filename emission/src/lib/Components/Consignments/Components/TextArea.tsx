import { color } from "@artsy/palette"
import colors from "lib/data/colors"
import fonts from "lib/data/fonts"
import React from "react"
import { TextInputProperties, View, ViewProperties } from "react-native"
import styled from "styled-components/native"

export interface TextAreaProps extends ViewProperties {
  text?: TextInputProperties
}

interface State {
  text: string
}

// We need to use our own placeholder as there is a bug with multiline placeholders we're working around.
// See discussion in https://github.com/artsy/emission/pull/699
const Placeholder = styled.Text`
  position: absolute;
  z-index: -1;
  color: ${color("black60")};
  font-family: "${fonts["garamond-regular"]}";
  font-size: 20;
  margin-top: 5px;
  width: 100%;
`

const Input = styled.TextInput`
  height: 100%;
  background-color: transparent;
  color: ${color("black100")};
  font-family: "${fonts["garamond-regular"]}";
  font-size: 20;
  flex: 1;
`

export default class TextArea extends React.Component<TextAreaProps, State> {
  constructor(props) {
    super(props)
    this.state = {
      text: props.text.value ? props.text.value : "",
    }
  }

  onChangeText = text => {
    this.props.text.onChangeText(text)
    this.setState({ text })
  }

  render() {
    const displayPlaceholder = this.state.text.length === 0

    const placeholderText = this.props.text.placeholder
    delete this.props.text.placeholder

    return (
      <View style={[this.props.style, { flex: 1 }]}>
        <View style={{ flexDirection: "row" }}>
          {displayPlaceholder ? <Placeholder>{placeholderText}</Placeholder> : null}
          <Input
            autoCapitalize={"sentences"}
            keyboardAppearance="dark"
            selectionColor={colors["gray-medium"]}
            multiline={true}
            {...this.props.text}
            onChangeText={this.onChangeText}
          />
        </View>
      </View>
    )
  }
}
