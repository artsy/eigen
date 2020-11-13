import { Flex, Separator, Text } from "palette"
import React from "react"
import { View } from "react-native"

export const PageWithSimpleHeader: React.FC<{
  title: string
  left?: React.ReactNode
  right?: React.ReactNode
  noSeparator?: boolean
}> = ({ title, left, right, children, noSeparator }) => {
  return (
    <Flex flex={1} backgroundColor="background">
      <Flex px="2" pb="1" pt="2" flexDirection="row" alignItems="center">
        <Flex flex={1} alignItems="flex-start">
          {left}
        </Flex>
        {/* TODO: figure out how to make this stretch dynamically */}
        <Flex flex={2.5}>
          <Text variant="title" fontWeight="500" textAlign="center">
            {title}
          </Text>
        </Flex>
        <Flex flex={1} alignItems="flex-end">
          {right}
        </Flex>
      </Flex>
      {!noSeparator && <Separator />}
      <View style={{ flex: 1 }}>{children}</View>
    </Flex>
  )
}
