import { themeGet } from "@styled-system/theme-get"
import { Text, useColor } from "palette"
import { usePaletteFlagStore } from "palette/PaletteFlag"
import React, { useState } from "react"
import { TextInput, TextInputProps } from "react-native"
import styled from "styled-components/native"

const StyledTextArea = styled(TextInput)`
  border: solid 1px;
  padding: ${themeGet("space.1")}px;
  height: 88px;
`

interface TextAreaProps extends TextInputProps {
  title: string
}
export const TextArea: React.FC<TextAreaProps> = ({ title, ...props }) => {
  const color = useColor()
  const [borderColor, setBorderColor] = useState(color("black10"))

  const allowV3 = usePaletteFlagStore((state) => state.allowV3)

  return (
    <>
      {!!title &&
        (allowV3 ? (
          <Text mb={1} size="xs">
            {title}
          </Text>
        ) : (
          <Text mb={1} variant="mediumText">
            {title}
          </Text>
        ))}
      <StyledTextArea
        {...props}
        onFocus={(e) => {
          props.onFocus?.(e)
          setBorderColor(allowV3 ? color("purple100") : color("blue100"))
        }}
        onBlur={(e) => {
          props.onBlur?.(e)
          setBorderColor(color("black10"))
        }}
        style={{ borderColor }}
        multiline={true}
        textAlignVertical="top"
      />
    </>
  )
}
