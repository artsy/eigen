import React from "react"
import { Flex } from "../Elements/Flex"

export const Container = props => (
  <Flex m={4} flex={1} flexDirection="column" justifyContent="space-between" {...props} />
)

export const CenteringContainer = props => <Flex flex={1} justifyContent="center" alignItems="center" {...props} />
