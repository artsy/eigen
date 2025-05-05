import { Image, useScreenDimensions } from "@artsy/palette-mobile"
import { ArticleSectionArtworkImage_artwork$key } from "__generated__/ArticleSectionArtworkImage_artwork.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
import { graphql, useFragment } from "react-relay"

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

  const widthShrinkPercentage = width / (data.image?.width ?? width)
  const height = (data.image?.height ?? width) * widthShrinkPercentage
  const aspectRatio = width / height

  return (
    <RouterLink to={data.href}>
      <Image
        accessibilityLabel={`Image of ${data.title}`}
        src={data.image.url}
        width={width}
        height={height}
        aspectRatio={aspectRatio}
      />
    </RouterLink>
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
