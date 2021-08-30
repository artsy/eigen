import { themeGet } from "@styled-system/theme-get"
import { Text, useColor } from "palette"
import React, { useState } from "react"
import { StyleSheet, TouchableWithoutFeedback, TouchableWithoutFeedbackProps } from "react-native"
import styled from "styled-components/native"

import { CssTransition } from "lib/Components/Bidding/Components/Animation/CssTransition"
import { Flex, FlexProps } from "lib/Components/Bidding/Elements/Flex"
import { theme } from "../../../lib/Components/Bidding/Elements/Theme"

const RADIOBUTTON_SIZE = 20
const DURATION = 250

export interface RadioButtonProps extends TouchableWithoutFeedbackProps, FlexProps {
  selected?: boolean
  focused?: boolean
  disabled?: boolean
  error?: boolean
  text?: React.ReactElement | string
  subtitle?: React.ReactElement | string
  children?: React.ReactElement | string
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  selected: selectedProp,
  disabled,
  error,
  onPress,
  style,
  text,
  subtitle,
  children,
  ...restProps
}) => {
  const color = useColor()

  const [selected, setSelected] = useState(selectedProp)
  const isSelected = selectedProp ?? selected

  const defaultRadioButtonStyle = {
    backgroundColor: color("white100"),
    borderColor: color("black60"),
  }

  const selectedRadioButtonStyle = {
    backgroundColor: color("black100"),
    borderColor: color("black100"),
  }

  const disabledRadioButtonStyle = {
    backgroundColor: color("black5"),
    borderColor: color("black10"),
  }

  const radioButtonStyles = {
    default: {
      notSelected: defaultRadioButtonStyle,
      selected: selectedRadioButtonStyle,
    },
    error: {
      notSelected: { backgroundColor: color("white100"), borderColor: color("red100") },
      selected: selectedRadioButtonStyle,
    },
  }

  const radioButtonStyle = disabled
    ? disabledRadioButtonStyle
    : radioButtonStyles[error ? "error" : "default"][isSelected ? "selected" : "notSelected"]

  const textColor = error ? color("red100") : disabled ? color("black30") : color("black100")
  const subtitleColor = error ? color("red100") : color("black30")

  return (
    <TouchableWithoutFeedback
      onPress={(event) => {
        if (disabled) {
          return
        }

        setSelected(!selected)
        onPress?.(event)
      }}
    >
      <Flex flexDirection="row" {...restProps}>
        <CssTransition
          style={[styles.container, radioButtonStyle]}
          animate={["backgroundColor", "borderColor"]}
          duration={DURATION}
        >
          {!!isSelected &&
            (!!disabled ? <DisabledDot size={RADIOBUTTON_SIZE} /> : <RadioDot size={RADIOBUTTON_SIZE} />)}
        </CssTransition>

        <Flex style={{ marginTop: !!children ? 0 : 2 }}>
          {!!text && <Text color={textColor}>{text}</Text>}
          {!!subtitle && (
            <Text variant="small" color={subtitleColor}>
              {subtitle}
            </Text>
          )}
          {/* TODO: Remove once the migration from V2 to V3 is completed. */}
          {children}
        </Flex>
      </Flex>
    </TouchableWithoutFeedback>
  )
}

// styled-component does not have support for Animated.View
const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "solid",
    marginRight: theme.space[3],
    height: 20,
    width: 20,
    borderRadius: 10,
  },
})

interface RadioDotProps {
  size: number
}

// This component represents the √ mark in CSS. We are not using styled-system since it's easier to specify raw CSS
// properties with styled-component.
export const RadioDot = styled.View.attrs<RadioDotProps>({})`
  height: 12;
  width: 12;
  border-radius: 5px;
  background-color: white;
`

export const DisabledDot = styled(RadioDot)`
  border-bottom-color: ${themeGet("colors.black30")};
  border-left-color: ${themeGet("colors.black30")};
`
