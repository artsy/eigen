import React from "react"

import { Flex, Sans, Spacer, useColor } from "palette"

interface ZeroStateProps {
  title?: string
  subtitle?: string
  separators?: boolean
  callToAction?: JSX.Element
}

export const ZeroState = (props: ZeroStateProps) => (
  <Flex py="4" px="2" justifyContent="center" style={{ height: "100%" }}>
    {!!props.title && (
      <>
        <Sans size="3" lineHeight="20" maxWidth="80%" color={useColor()("black100")}>
          {props.title}
        </Sans>
      </>
    )}

    {!!props.subtitle && (
      <>
        <Sans
          size="3"
          maxWidth={props.title ? "100%" : "80%"}
          lineHeight="20"
          color={props.title ? useColor()("black60") : useColor()("black100")}
        >
          {props.subtitle}
        </Sans>
      </>
    )}

    <Spacer mb={3} />
    {!!props.callToAction && <>{props.callToAction}</>}
  </Flex>
)
