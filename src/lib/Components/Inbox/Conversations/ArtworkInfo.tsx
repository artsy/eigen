import { ArtworkInfo_artwork } from "__generated__/ArtworkInfo_artwork.graphql"
import { Flex, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  artwork: ArtworkInfo_artwork
}

export const ArtworkInfo: React.FC<Props> = (props) => {
  const { artwork } = props
  return (
    <Flex flexDirection="column" ml={2}>
      <Text variant="mediumText" numberOfLines={1}>
        {artwork.artistNames}
      </Text>
      <Text variant="caption" color="black60" numberOfLines={1} ellipsizeMode={"clip"}>
        {[artwork.title, artwork.date].join(", ")}
      </Text>
      <Text variant="caption" color="black60" numberOfLines={1}>
        {artwork.partner?.name}
      </Text>
      <Text variant="caption" color="black60" numberOfLines={1}>
        {artwork.saleMessage}
      </Text>
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
