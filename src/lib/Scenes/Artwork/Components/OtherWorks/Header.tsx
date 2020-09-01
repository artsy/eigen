import { Flex, Sans } from "palette"
import React from "react"

interface HeaderProps {
  title: string
}

export const Header: React.FC<HeaderProps> = ({ title }) => (
  <Flex flexDirection="column">
    <Sans size="4t" textAlign="left">
      {title}
    </Sans>
  </Flex>
)
