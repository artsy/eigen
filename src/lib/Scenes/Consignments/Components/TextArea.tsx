import colors from "lib/data/colors"
import fonts from "lib/data/fonts"
import { color } from "palette"
import React from "react"
import { Platform, TextInputProps, View, ViewProps } from "react-native"
import styled from "styled-components/native"

const Input = styled.TextInput`
  height: 100%;
  color: ${color("black100")};
  font-family: "${fonts["unica77ll-regular"]}";
  font-size: 16;
`

export interface TextAreaProps extends ViewProps {
  text?: TextInputProps
}

export const TextArea: React.FC<TextAreaProps> = (props) => {
  const onChangeText = (text: string) => {
    props.text?.onChangeText?.(text)
  }

  return (
    <View style={[props.style, { flex: 1 }]}>
      <View style={{ flexDirection: "column" }}>
        <Input
          style={Platform.OS === "android" ? { textAlignVertical: "top" } : null}
          autoCapitalize={"sentences"}
          keyboardAppearance="dark"
          selectionColor={colors["gray-medium"]}
          multiline
          {...props.text}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  )
}
