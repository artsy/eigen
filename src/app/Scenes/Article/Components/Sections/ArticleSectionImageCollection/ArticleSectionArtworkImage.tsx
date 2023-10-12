import { Image, Touchable, useScreenDimensions } from "@artsy/palette-mobile"
import { ArticleSectionArtworkImage_artwork$key } from "__generated__/ArticleSectionArtworkImage_artwork.graphql"
import { navigate } from "app/system/navigation/navigate"
import { useFragment, graphql } from "react-relay"

interface ArticleSectionArtworkImageProps {
  artwork: ArticleSectionArtworkImage_artwork$key
}

export const ArticleSectionArtworkImage: React.FC<ArticleSectionArtworkImageProps> = ({
  artwork,
}) => {
  const { width } = useScreenDimensions()
  const data = useFragment(fragment, artwork)

  if (!data.image?.url) {
    return null
  }

  const handleOnPress = () => {
    if (!!data.href) {
      navigate(data.href)
    }
  }

  const widthShrinkPercentage = width / (data.image?.width ?? width)
  const height = (data.image?.height ?? width) * widthShrinkPercentage
  const aspectRatio = width / height

  return (
    <Touchable onPress={handleOnPress}>
      <Image
        accessibilityLabel={`Image of ${data.title}`}
        src={data.image.url}
        width={width}
        height={height}
        aspectRatio={aspectRatio}
      />
    </Touchable>
  )
}

const fragment = graphql`
  fragment ArticleSectionArtworkImage_artwork on Artwork {
    id
    href
    title
    image {
      url(version: ["main", "normalized", "larger", "large"])
      width
      height
    }
  }
`
