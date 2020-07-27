import { Flex, Sans } from "@artsy/palette"
import React from "react"

export const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <Flex flexDirection="row" justifyContent="space-between" my={0.5}>
      <Sans size="4" color="black60">
        {label}
      </Sans>
      <Sans size="4">{value}</Sans>
    </Flex>
  )
}
