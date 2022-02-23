import { Flex, Sans, Separator } from "palette"
import React from "react"
import { View } from "react-native"

export const PageWithSimpleHeader: React.FC<{
  title: string
  left?: React.ReactNode
  right?: React.ReactNode
  noSeparator?: boolean
}> = ({ title, left, right, children, noSeparator }) => {
  return (
    <View style={{ flex: 1 }}>
      <Flex px="2" pb="1" pt="2" mb={0.5} flexDirection="row" alignItems="center">
        <Flex flex={1} alignItems="flex-start">
          {left}
        </Flex>
        {/* TODO: figure out how to make this stretch dynamically */}
        <Flex flex={2.5}>
          <Sans size="4" weight="medium" textAlign="center">
            {title}
          </Sans>
        </Flex>
        <Flex flex={1} alignItems="flex-end">
          {right}
        </Flex>
      </Flex>
      {!noSeparator && <Separator />}
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  )
}
