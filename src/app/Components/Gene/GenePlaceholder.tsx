import { PlaceholderGrid, PlaceholderText } from "app/utils/placeholders"
import { Flex, Separator, Spacer } from "palette"
import React from "react"

export const GenePlaceholder = () => (
  <Flex>
    <Flex px={2}>
      <Spacer mb={75} />
      {/* Entity name */}
      <PlaceholderText width={150} />
      <Spacer mb={1} />
      {/* Entity button */}
      <PlaceholderText />
    </Flex>
    <Spacer mb={3} />
    {/* tabs */}
    <Flex justifyContent="space-around" flexDirection="row" px={2}>
      <PlaceholderText width={50} />
      <PlaceholderText width={50} />
    </Flex>
    <Spacer mb={1} />
    <Separator />
    <Spacer mb={2} />
    <Flex justifyContent="space-between" flexDirection="row" px={2}>
      <PlaceholderText width={180} />
      <PlaceholderText width={50} />
    </Flex>
    <Spacer mb={1.5} />
    {/* masonry grid */}
    <PlaceholderGrid />
  </Flex>
)
