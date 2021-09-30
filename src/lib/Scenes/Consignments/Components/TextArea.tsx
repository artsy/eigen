import { themeGet } from "@styled-system/theme-get"
import { useTheme } from "palette"
import React from "react"
import { Platform, TextInputProps, View, ViewProps } from "react-native"
import styled from "styled-components/native"

const Input = styled.TextInput`
  height: 100%;
  color: ${themeGet("colors.black100")};
  font-family: "Unica77LL-Regular";
  font-size: 16;
`

export interface TextAreaProps extends ViewProps {
  text?: TextInputProps
}

export const TextArea: React.FC<TextAreaProps> = (props) => {
  const { color } = useTheme()

  const onChangeText = (text: string) => {
    props.text?.onChangeText?.(text)
  }

  return (
    <View style={[props.style, { flex: 1 }]}>
      <Input
        style={Platform.OS === "android" ? { textAlignVertical: "top" } : null}
        autoCapitalize="sentences"
        keyboardAppearance="dark"
        selectionColor={color("black30")}
        multiline
        {...props.text}
        onChangeText={onChangeText}
      />
    </View>
  )
}
