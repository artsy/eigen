import { Flex, Text } from "palette"
import React from "react"

interface HeaderProps {
  title: string
}

export const Header: React.FC<HeaderProps> = ({ title }) => (
  <Flex flexDirection="column">
    <Text size="md" textAlign="left">
      {title}
    </Text>
  </Flex>
)
