import { color, Flex, Sans, space } from "@artsy/palette"
import React from "react"
import styled from "styled-components/native"

// FIXME: Replace `background-color` with `background` prop on Flex on `@artsy/palette` upgrade
const Container = styled(Flex)`
  background-color: ${color("black10")};
  border-radius: ${space(2)};
`

// FIXME: Replace type with `TextProps` imported from `@artsy/palette`
export const Chip: React.SFC<any> = props => {
  return (
    <Container alignSelf="center" justifyContent="center" alignItems="center" px={2} py={1}>
      <Sans size="3" {...props} />
    </Container>
  )
}
