import { ChevronIcon, Flex, Sans, SansProps, Touchable, useColor } from "palette"
import React from "react"
import { StyleProp, ViewStyle } from "react-native"

export const MenuItem: React.FC<{
  disabled?: boolean
  title: React.ReactNode
  value?: React.ReactNode
  text?: string
  isBeta?: boolean
  onPress?: () => void
  chevron?: React.ReactNode
  ellipsizeMode?: SansProps["ellipsizeMode"]
  style?: StyleProp<ViewStyle>
  rightView?: React.ReactNode
}> = ({
  title,
  text,
  value,
  isBeta,
  onPress,
  disabled = false,
  chevron = <ChevronIcon direction="right" fill="black60" />,
  ellipsizeMode,
  style,
  rightView,
}) => {
  const color = useColor()
  return (
    <Touchable onPress={onPress} underlayColor={color("black5")} disabled={disabled}>
      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        py={7.5}
        px="2"
        pr="15px"
        style={style}
      >
        <Flex flexDirection="row" mr="2">
          <Sans size="4">{title}</Sans>
          {!!isBeta && (
            <Flex px={0.5} mx={1} backgroundColor={color("black10")}>
              <Sans size="3" color={color("black60")}>
                Beta
              </Sans>
            </Flex>
          )}
        </Flex>
        {!!value && (
          <Flex flex={1}>
            <Sans
              size="4"
              color="black60"
              numberOfLines={1}
              ellipsizeMode={ellipsizeMode}
              textAlign="right"
            >
              {value}
            </Sans>
          </Flex>
        )}
        {!!(onPress && chevron) && <Flex ml="1">{chevron}</Flex>}

        {!!text && (
          <Sans size="4" color={color("black60")}>
            {text}
          </Sans>
        )}

        {rightView}
      </Flex>
    </Touchable>
  )
}
