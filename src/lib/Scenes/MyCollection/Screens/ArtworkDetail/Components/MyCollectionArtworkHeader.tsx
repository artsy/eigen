import { MyCollectionArtworkHeader_artwork } from "__generated__/MyCollectionArtworkHeader_artwork.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface MyCollectionArtworkHeaderProps {
  artwork: MyCollectionArtworkHeader_artwork
}

export const MyCollectionArtworkHeader: React.FC<MyCollectionArtworkHeaderProps> = (props) => {
  const {
    artwork: { artistNames, date, image, title },
  } = props
  const dimensions = useScreenDimensions()
  const formattedTitleAndYear = [title, date].filter(Boolean).join(", ")

  return (
    <>
      <ScreenMargin>
        <Text variant="largeTitle">{artistNames}</Text>
        <Text variant="subtitle" color="black60">
          {formattedTitleAndYear}
        </Text>
      </ScreenMargin>

      <OpaqueImageView
        // TODO: figure out if "normalized" is the correct version
        imageURL={image?.url?.replace(":version", "normalized")}
        height={300}
        width={dimensions.width}
      />
    </>
  )
}

export const MyCollectionArtworkHeaderFragmentContainer = createFragmentContainer(MyCollectionArtworkHeader, {
  artwork: graphql`
    fragment MyCollectionArtworkHeader_artwork on Artwork {
      artistNames
      date
      image {
        url
      }
      title
    }
  `,
})
