import { themeGet } from "@styled-system/theme-get"
import { Text, useTheme } from "palette"
import React, { useState } from "react"
import {
  PixelRatio,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
} from "react-native"
import styled from "styled-components/native"

import { CssTransition } from "../../../app/Components/Bidding/Components/Animation/CssTransition"
import { Flex, FlexProps } from "../../../app/Components/Bidding/Elements/Flex"

const CHECKBOX_SIZE = 20
const DURATION = 250

export interface CheckboxProps extends TouchableWithoutFeedbackProps, FlexProps {
  checked?: boolean
  disabled?: boolean
  error?: boolean
  text?: React.ReactElement | string
  subtitle?: React.ReactElement | string
  children?: React.ReactElement | string
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked: checkedProp,
  disabled,
  error,
  onPress,
  style,
  text,
  subtitle,
  children,
  ...restProps
}) => {
  const { color, space } = useTheme()

  const fontScale = PixelRatio.getFontScale()
  const checkboxSize = CHECKBOX_SIZE * fontScale

  const [checked, setChecked] = useState(checkedProp)
  const isChecked = checkedProp ?? checked

  const defaultCheckboxStyle = {
    backgroundColor: color("white100"),
    borderColor: color("black60"),
  }

  const checkedCheckboxStyle = {
    backgroundColor: color("black100"),
    borderColor: color("black100"),
  }

  const disabledCheckboxStyle = {
    backgroundColor: color("black5"),
    borderColor: color("black10"),
  }

  const checkboxStyles = {
    default: {
      unchecked: defaultCheckboxStyle,
      checked: checkedCheckboxStyle,
    },
    error: {
      unchecked: { backgroundColor: color("white100"), borderColor: color("red100") },
      checked: checkedCheckboxStyle,
    },
  }

  const checkboxStyle = disabled
    ? disabledCheckboxStyle
    : checkboxStyles[error ? "error" : "default"][isChecked ? "checked" : "unchecked"]

  const textColor = error ? color("red100") : disabled ? color("black30") : color("black100")
  const subtitleColor = error ? color("red100") : color("black30")

  return (
    <TouchableWithoutFeedback
      onPress={(event) => {
        if (disabled) {
          return
        }

        setChecked(!checked)
        onPress?.(event)
      }}
    >
      <Flex flex={1} {...restProps}>
        <Flex flexDirection="row">
          <Flex mt="2px">
            <CssTransition
              style={[
                styles(fontScale).container,
                text || subtitle || children ? { marginRight: space("1") * fontScale } : {},
                checkboxStyle,
              ]}
              animate={["backgroundColor", "borderColor"]}
              duration={DURATION}
            >
              {!!isChecked &&
                (!!disabled ? (
                  <DisabledMark size={checkboxSize} />
                ) : (
                  <CheckMark size={checkboxSize} />
                ))}
            </CssTransition>
          </Flex>

          <Flex justifyContent="center" flex={1}>
            {!!text && (
              <Text variant="md" color={textColor}>
                {text}
              </Text>
            )}
            {children}
          </Flex>
        </Flex>

        {!!subtitle && (
          <Flex ml={(CHECKBOX_SIZE + space("1")) * fontScale} mt="6px">
            <Text variant="xs" color={subtitleColor}>
              {subtitle}
            </Text>
          </Flex>
        )}
      </Flex>
    </TouchableWithoutFeedback>
  )
}

// styled-component does not have support for Animated.View
const styles = (fontScale: number) =>
  StyleSheet.create({
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderStyle: "solid",
      width: CHECKBOX_SIZE * fontScale,
      height: CHECKBOX_SIZE * fontScale,
    },
  })

interface CheckMarkProps {
  size: number
}

// This component represents the √ mark in CSS. We are not using styled-system since it's easier to specify raw CSS
// properties with styled-component.
export const CheckMark = styled.View.attrs<CheckMarkProps>({})`
  transform: rotate(-45deg);
  top: -12%;
  width: ${(props) => props.size * 0.625};
  height: ${(props) => props.size * 0.3125};
  border-bottom-color: white;
  border-bottom-width: 2px;
  border-left-color: white;
  border-left-width: 2px;
`

export const DisabledMark = styled(CheckMark)`
  border-bottom-color: ${themeGet("colors.black30")};
  border-left-color: ${themeGet("colors.black30")};
`
