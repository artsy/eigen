import { Flex, Sans } from "palette"
import React from "react"

export const Field: React.FC<{ label: string; value: string | null }> = ({ label, value }) => {
  if (!value) {
    return null
  }
  return (
    <Flex flexDirection="row" justifyContent="space-between" my={0.5} pr={1}>
      <Sans size="4" color="black60" pr={1}>
        {label}
      </Sans>
      <Sans size="4">{value}</Sans>
    </Flex>
  )
}
