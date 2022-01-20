import { bullet, Flex } from "palette"
import { Text } from "palette"
import React from "react"

export const BulletedItem = ({ children }: { children: string }) => {
  return (
    <Flex flexDirection="row" px={1}>
      <Text variant="sm" color="black60">
        {bullet}{" "}
      </Text>
      <Text variant="sm" color="black60">
        {children}
      </Text>
    </Flex>
  )
}
