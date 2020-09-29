import { ChevronIcon, color, Flex, Sans, SansProps, Touchable } from "palette"
import React from "react"

export const MenuItem: React.FC<{
  disabled?: boolean
  title: React.ReactNode
  value?: React.ReactNode
  text?: string
  onPress?: () => void
  chevron?: React.ReactNode
  ellipsizeMode?: SansProps["ellipsizeMode"]
}> = ({
  title,
  text,
  value,
  onPress,
  disabled = false,
  chevron = <ChevronIcon direction="right" fill="black60" />,
  ellipsizeMode,
}) => {
  return (
    <Touchable onPress={onPress} underlayColor={color("black5")} disabled={disabled}>
      <Flex flexDirection="row" alignItems="center" justifyContent="space-between" py={7.5} px="2" pr="15px">
        <Flex mr="2">
          <Sans size="4">{title}</Sans>
        </Flex>

        {!!value && (
          <Flex flex={1}>
            <Sans size="4" color="black60" numberOfLines={1} ellipsizeMode={ellipsizeMode} textAlign="right">
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
      </Flex>
    </Touchable>
  )
}
