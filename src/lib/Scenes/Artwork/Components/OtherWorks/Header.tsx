import { Flex, Serif } from "@artsy/palette"
import React from "react"

interface HeaderProps {
  children?: JSX.Element
  title: string
}

export const Header: React.SFC<HeaderProps> = props => {
  const { children, title } = props

  return (
    <Flex flexDirection="column" alignItems="center">
      <Serif size={["5t", "8"]} mb={2} textAlign="center">
        {title}
      </Serif>
      {children}
    </Flex>
  )
}
