import { ChevronIcon, color, Flex, Sans } from "@artsy/palette"
import React from "react"
import { TouchableHighlight } from "react-native"

export const MyProfileMenuItem: React.FC<{
  title: React.ReactNode
  value?: React.ReactNode
  onPress?: () => void
  chevron?: React.ReactNode
}> = ({ title, value, onPress, chevron = <ChevronIcon direction="right" fill="black60" /> }) => {
  return (
    <TouchableHighlight onPress={onPress} underlayColor={color("black5")}>
      <Flex flexDirection="row" alignItems="center" py={7.5} px="2" pr="15px">
        <Flex flexGrow={1}>
          <Sans size="4">{title}</Sans>
        </Flex>

        {!!value && (
          <Flex flexGrow={0}>
            <Sans size="4" color="black60">
              {value}
            </Sans>
          </Flex>
        )}
        {!!(onPress && chevron) && (
          <Flex ml="1" flexGrow={0}>
            {chevron}
          </Flex>
        )}
      </Flex>
    </TouchableHighlight>
  )
}
