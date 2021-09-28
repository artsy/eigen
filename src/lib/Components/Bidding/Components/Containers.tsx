import React from "react"
import { Flex } from "../Elements/Flex"

export const Container = (props: any /* STRICTNESS_MIGRATION */) => (
  <Flex m="2" flex={1} flexDirection="column" justifyContent="space-between" {...props} />
)

export const CenteringContainer = (props: any /* STRICTNESS_MIGRATION */) => (
  <Flex flex={1} justifyContent="center" alignItems="center" {...props} />
)
