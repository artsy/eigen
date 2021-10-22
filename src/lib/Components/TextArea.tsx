import { themeGet } from "@styled-system/theme-get"
import { Text, useColor } from "palette"
import React, { forwardRef, useState } from "react"
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

export const TextArea = forwardRef<TextInput, TextAreaProps>(({ title, ...props }, ref) => {
  const color = useColor()
  const [borderColor, setBorderColor] = useState(color("black10"))

  return (
    <>
      {!!title && (
        <Text mb={1} variant="xs">
          {title}
        </Text>
      )}
      <StyledTextArea
        ref={ref}
        {...props}
        onFocus={(e) => {
          props.onFocus?.(e)
          setBorderColor(color("blue100"))
        }}
        onBlur={(e) => {
          props.onBlur?.(e)
          setBorderColor(color("black10"))
        }}
        style={{ borderColor }}
        multiline
        textAlignVertical="top"
      />
    </>
  )
})
// export const TextArea: React.FC<TextAreaProps> = ({ title, ...props }) => {
//   const color = useColor()
//   const [borderColor, setBorderColor] = useState(color("black10"))

//   return (
//     <>
//       {!!title && (
//         <Text mb={1} variant="xs">
//           {title}
//         </Text>
//       )}
//       <StyledTextArea
//         {...props}
//         onFocus={(e) => {
//           props.onFocus?.(e)
//           setBorderColor(color("blue100"))
//         }}
//         onBlur={(e) => {
//           props.onBlur?.(e)
//           setBorderColor(color("black10"))
//         }}
//         style={{ borderColor }}
//         multiline
//         textAlignVertical="top"
//       />
//     </>
//   )
// }
