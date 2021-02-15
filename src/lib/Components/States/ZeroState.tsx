import React from "react"

import { Flex, Sans, Spacer } from "palette"

interface ZeroStateProps {
  title?: string
  subtitle?: string
  separators?: boolean
  callToAction?: JSX.Element
}

export const ZeroState = (props: ZeroStateProps) => (
  <Flex py="4" px="2" alignItems="center" justifyContent="center" style={{ height: "100%" }}>
    {!!props.title && (
      <>
        <Sans size="6" textAlign="center" maxWidth="80%">
          {props.title}
        </Sans>
        <Spacer mb="3" />
      </>
    )}

    {!!props.subtitle && (
      <>
        <Sans size="4" textAlign="center" maxWidth={props.title ? "100%" : "80%"}>
          {props.subtitle}
        </Sans>
        <Spacer mb="3" />
      </>
    )}
    {!!props.callToAction && <>{props.callToAction}</>}
  </Flex>
)
