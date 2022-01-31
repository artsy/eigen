import { bullet, Flex, Spacer } from "palette"
import { Text } from "palette"
import React from "react"

interface Props {
  children: string | Array<string | Element>
  color?: string
}

export const BulletedItem = ({ children, color = "black60" }: Props) => {
  return (
    <Flex flexDirection="row" px={1}>
      <Text variant="sm" color={color}>
        {bullet}
      </Text>
      <Spacer mr={1} />
      <Text variant="sm" color={color}>
        {children}
      </Text>
    </Flex>
  )
}
