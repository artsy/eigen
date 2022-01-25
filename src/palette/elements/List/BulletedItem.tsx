import { bullet, Flex, Spacer } from "palette"
import { Text } from "palette"
import React from "react"

interface Props {
  children: string
  color?: string
}

export const BulletedItem = ({ children, color }: Props) => {
  return (
    <Flex flexDirection="row" px={1}>
      <Text variant="sm" color={color || "black60"}>
        {bullet}
      </Text>
      <Spacer mr={1} />
      <Text variant="sm" color={color || "black60"}>
        {children}
      </Text>
    </Flex>
  )
}
