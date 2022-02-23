import React from "react"
import { Flex } from "../Elements/Flex"

export const Row = (props: any /* STRICTNESS_MIGRATION */) => (
  <Flex flexDirection="row" justifyContent="space-between" alignItems="center" {...props} />
)
export const Col = (props: any /* STRICTNESS_MIGRATION */) => <Flex flex={1} {...props} />
