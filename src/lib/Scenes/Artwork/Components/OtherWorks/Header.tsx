import { Flex, Serif } from "@artsy/palette"
import React from "react"

interface HeaderProps {
  title: string
}

export const Header: React.SFC<HeaderProps> = props => {
  const { title } = props

  return (
    <Flex flexDirection="column">
      <Serif size="5t" textAlign="left">
        {title}
      </Serif>
    </Flex>
  )
}
