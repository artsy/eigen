import { Flex, Sans } from "@artsy/palette"
import React from "react"

export const ZeroArtworks: React.SFC = () => {
  // const { state } = useContext(ArtworkFilterContext)

  return (
    <Flex flexGrow={1}>
      <Sans size="16">NO ARTWORKS TO SHOW HERE FOLKS</Sans>
    </Flex>
  )
}
