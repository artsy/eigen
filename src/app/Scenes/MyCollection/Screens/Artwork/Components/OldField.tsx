import { Flex, Sans } from "palette"
import React from "react"

export const Field: React.FC<{ label: string; value: string | null }> = ({ label, value }) => {
  if (!value) {
    return null
  }
  return (
    <Flex flexDirection="row" justifyContent="space-between" my={0.5}>
      <Sans size="4" color="black60" pr={1}>
        {label}
      </Sans>
      <Sans size="4" style={{ flex: 1, maxWidth: "60%" }} textAlign="right">
        {value}
      </Sans>
    </Flex>
  )
}
