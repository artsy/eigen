import { Flex } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import React from "react"

export const ArtistSeriesHeader = () => {
  return (
    <Flex flexDirection="row" justifyContent="center">
      {/* TODO: add image url */}
      <OpaqueImageView width={180} height={180} />
    </Flex>
  )
}
