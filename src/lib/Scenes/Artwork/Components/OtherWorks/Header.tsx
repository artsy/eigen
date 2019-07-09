import { Flex, Serif } from "@artsy/palette"
import React from "react"

interface HeaderProps {
  children?: JSX.Element
  title: string
}

export const Header: React.SFC<HeaderProps> = props => {
  const { children, title } = props

  return (
    <Flex flexDirection="column">
      <Serif size="5t" mb={2} textAlign="left">
        {title}
      </Serif>
      {children}
    </Flex>
  )
}
