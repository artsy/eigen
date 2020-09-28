import { ChevronIcon, color, Flex, Sans, SansProps, Touchable } from "palette"
import React from "react"

export const MyProfileMenuItem: React.FC<{
  title: React.ReactNode
  value?: React.ReactNode
  onPress?: () => void
  chevron?: React.ReactNode
  ellipsizeMode?: SansProps["ellipsizeMode"]
}> = ({ title, value, onPress, chevron = <ChevronIcon direction="right" fill="black60" />, ellipsizeMode }) => {
  return (
    <Touchable onPress={onPress} underlayColor={color("black5")}>
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
      </Flex>
    </Touchable>
  )
}
