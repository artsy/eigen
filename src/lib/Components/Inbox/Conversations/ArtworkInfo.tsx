import { ArtworkInfo_artwork } from "__generated__/ArtworkInfo_artwork.graphql"
import { Flex, Sans } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  artwork: ArtworkInfo_artwork
}

export const ArtworkInfo: React.FC<Props> = (props) => {
  const { artwork } = props
  return (
    <Flex flexDirection="column" ml={1}>
      <Sans size="3t" weight="medium" numberOfLines={1}>
        {artwork.artistNames}
      </Sans>
      <Sans size="3t" color="black60" numberOfLines={1} ellipsizeMode={"clip"}>
        {[artwork.title, artwork.date].join(", ")}
      </Sans>
      <Sans size="3t" color="black60" numberOfLines={1}>
        {artwork.partner?.name}
      </Sans>
      <Sans size="3t" color="black60" numberOfLines={1}>
        {artwork.saleMessage}
      </Sans>
    </Flex>
  )
}

export const ArtworkInfoFragmentContainer = createFragmentContainer(ArtworkInfo, {
  artwork: graphql`
    fragment ArtworkInfo_artwork on Artwork {
      title
      artistNames
      date
      saleMessage
      partner {
        name
      }
    }
  `,
})
