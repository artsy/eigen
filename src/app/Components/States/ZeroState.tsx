import React from "react"

import { Flex, Sans, useColor } from "palette"
import { AlignItemsValue } from "../Bidding/Elements/types"

interface ZeroStateProps {
  title?: string
  subtitle?: string
  separators?: boolean
  callToAction?: JSX.Element
  alignItems?: AlignItemsValue
}

export const ZeroState = (props: ZeroStateProps) => {
  const color = useColor()
  return (
    <Flex
      py="6"
      px={props.alignItems ? "0" : "2px"}
      justifyContent="center"
      alignItems={props.alignItems}
    >
      <Flex minHeight={30}>
        {!!props.title && (
          <>
            <Sans size="3" lineHeight="20" maxWidth="80%" color={color("black100")}>
              {props.title}
            </Sans>
          </>
        )}
      </Flex>

      <Flex minHeight={80}>
        {!!props.subtitle && (
          <>
            <Sans
              size="3"
              maxWidth={props.title ? "100%" : "80%"}
              lineHeight="20"
              textAlign={props.alignItems ? "center" : "left"}
              color={props.title ? color("black60") : color("black100")}
            >
              {props.subtitle}
            </Sans>
          </>
        )}
      </Flex>

      <Flex minHeight={80}>{!!props.callToAction && <>{props.callToAction}</>}</Flex>
    </Flex>
  )
}
