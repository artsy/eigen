import { color, space, Text } from "palette"
import React, { useState } from "react"
import { TextInput, TextInputProps } from "react-native"
import styled from "styled-components/native"

const StyledTextArea = styled(TextInput)`
  border: solid 1px;
  padding: ${space(1)}px;
  height: 88px;
`

interface TextAreaProps extends TextInputProps {
  title: string
}
export const TextArea: React.FC<TextAreaProps> = ({ title, ...props }) => {
  const [borderColor, setBorderColor] = useState(color("black10"))

  return (
    <>
      {!!title && (
        <Text mb="1" variant="mediumText">
          {title}
        </Text>
      )}
      <StyledTextArea
        {...props}
        onFocus={(e) => {
          props.onFocus?.(e)
          setBorderColor(color("purple100"))
        }}
        onBlur={(e) => {
          props.onBlur?.(e)
          setBorderColor(color("black10"))
        }}
        style={{ borderColor }}
        multiline={true}
      />
    </>
  )
}
