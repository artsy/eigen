import React from "react"

import { Flex, Sans, Spacer } from "@artsy/palette"

interface ZeroStateProps {
  title: string
  subtitle?: string
  separators?: boolean
  callToAction?: JSX.Element
}

export const ZeroState = (props: ZeroStateProps) => (
  <Flex py="4" px="2" alignItems="center" justifyContent="center">
    <Sans size="6" textAlign="center" maxWidth="80%">
      {props.title}
    </Sans>
    <Spacer mb="3" />

    <Sans size="4" textAlign="center">
      {props.subtitle}
    </Sans>
    {!!props.callToAction && (
      <>
        <Spacer mb={4} />
        {props.callToAction}
      </>
    )}
  </Flex>
)
