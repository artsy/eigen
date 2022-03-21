import { ChevronIcon, Flex, Spacer, Text, TextProps, Touchable, useColor } from "palette"
import React from "react"
import { StyleProp, ViewStyle } from "react-native"

export const MenuItem: React.FC<{
  disabled?: boolean
  allowDisabledVisualClue?: boolean // grays out with reduced opacity when disabled
  title: React.ReactNode
  value?: React.ReactNode
  text?: string
  isBeta?: boolean
  onPress?: () => void
  chevron?: React.ReactNode
  ellipsizeMode?: TextProps["ellipsizeMode"]
  style?: StyleProp<ViewStyle>
  rightView?: React.ReactNode
}> = ({
  title,
  text,
  value,
  isBeta,
  onPress,
  disabled = false,
  allowDisabledVisualClue = false,
  chevron = (
    <ChevronIcon
      direction="right"
      fill={disabled && allowDisabledVisualClue ? "black30" : "black60"}
    />
  ),
  ellipsizeMode,
  style,
  rightView,
}) => {
  const color = useColor()
  return (
    <Touchable onPress={onPress} underlayColor="black5" disabled={disabled}>
      <Flex
        flexDirection="row"
        alignItems="center"
        py={7.5}
        px="2"
        style={style}
        opacity={disabled && allowDisabledVisualClue ? 0.5 : 1}
      >
        <Flex>
          <Text variant="md">{title}</Text>
          {!!isBeta && (
            <Flex px={0.5} mx={1} backgroundColor={color("black10")}>
              <Text
                variant="sm"
                color={disabled && allowDisabledVisualClue ? "black30" : "black60"}
              >
                Beta
              </Text>
            </Flex>
          )}
        </Flex>

        <Spacer ml={20} />

        <Flex flexDirection="row" justifyContent="flex-end" flex={1} height="100%">
          {!!value && (
            <Flex flex={1}>
              <Text
                variant="md"
                color={disabled && allowDisabledVisualClue ? "black30" : "black60"}
                numberOfLines={1}
                ellipsizeMode={ellipsizeMode}
                textAlign="right"
              >
                {value}
              </Text>
            </Flex>
          )}

          {!!text && (
            <Text variant="md" color={disabled && allowDisabledVisualClue ? "black30" : "black60"}>
              {text}
            </Text>
          )}

          {rightView}

          {!!(onPress && chevron) && <Flex ml="1">{chevron}</Flex>}
        </Flex>
      </Flex>
    </Touchable>
  )
}
