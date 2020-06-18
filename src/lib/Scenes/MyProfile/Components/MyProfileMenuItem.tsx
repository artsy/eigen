import { ChevronIcon, color, Flex, Sans } from "@artsy/palette"
import React from "react"
import { TouchableHighlight } from "react-native"

export const MyProfileMenuItem: React.FC<{
  title: string
  value?: string
  onPress?: () => void
  endComponent?: React.ReactNode
}> = ({ title, value, onPress, endComponent = <ChevronIcon direction="right" fill="black60" /> }) => (
  <TouchableHighlight onPress={onPress} underlayColor={color("black5")}>
    <Flex flexDirection="row" alignItems="center" py="1" px="2">
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
      {!!endComponent && <Flex flexGrow={0}>{endComponent}</Flex>}
    </Flex>
  </TouchableHighlight>
)
