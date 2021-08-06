import { PlaceholderGrid, PlaceholderText } from "lib/utils/placeholders"
import { Flex, Separator, Spacer, Theme } from "palette"
import React from "react"

export const TagPlaceholder: React.FC = () => {
  return (
    <Theme>
      <Flex>
        <Flex px={2}>
          {/* Entity name */}
          <PlaceholderText />
        </Flex>
        <Spacer mb={1} />
        <Separator />
        <Spacer mb={2} />
        {/* Filters */}
        <Flex justifyContent="space-between" flexDirection="row" px={2}>
          <PlaceholderText width={180} />
          <PlaceholderText width={50} />
        </Flex>
        <Spacer mb={0.5} />
        {/* Grid */}
        <PlaceholderGrid />
      </Flex>
    </Theme>
  )
}
