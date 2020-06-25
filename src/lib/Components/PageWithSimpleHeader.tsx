import { Flex, Sans, Separator } from "@artsy/palette"
import React from "react"
import { View } from "react-native"

export const PageWithSimpleHeader: React.FC<{ title: string; left?: React.ReactNode; right?: React.ReactNode }> = ({
  title,
  left,
  right,
  children,
}) => {
  return (
    <View style={{ flex: 1 }}>
      <Flex px="2" pb="1" pt="2" flexDirection="row">
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
      <Separator />
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  )
}
