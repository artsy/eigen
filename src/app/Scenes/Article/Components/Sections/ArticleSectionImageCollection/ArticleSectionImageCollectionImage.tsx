import { Image, useScreenDimensions } from "@artsy/palette-mobile"
import { ArticleSectionImageCollectionImage_figure$key } from "__generated__/ArticleSectionImageCollectionImage_figure.graphql"
import { ArticleSectionArtworkImage } from "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionArtworkImage"
import { useFragment, graphql } from "react-relay"

interface ArticleSectionImageCollectionImageProps {
  figure: ArticleSectionImageCollectionImage_figure$key
}

export const ArticleSectionImageCollectionImage: React.FC<
  ArticleSectionImageCollectionImageProps
> = ({ figure }) => {
  const { width } = useScreenDimensions()
  const data = useFragment(ArticleSectionImageCollectionImageQuery, figure)

  if (data.__typename === "Artwork") {
    return <ArticleSectionArtworkImage artwork={data} />
  }

  if (data.__typename === "%other" || !data.image?.url) {
    return null
  }

  const widthShrinkPercentage = width / (data.image?.width ?? width)
  const height = (data.image?.height ?? width) * widthShrinkPercentage
  const aspectRatio = width / height

  return <Image src={data.image.url} width={width} height={height} aspectRatio={aspectRatio} />
}

const ArticleSectionImageCollectionImageQuery = graphql`
  fragment ArticleSectionImageCollectionImage_figure on ArticleSectionImageCollectionFigure {
    __typename
    ... on ArticleImageSection {
      id
      image {
        url(version: ["main", "normalized", "larger", "large"])
        width
        height
      }
    }
    ... on Artwork {
      ...ArticleSectionArtworkImage_artwork
    }
    ... on ArticleUnpublishedArtwork {
      id
      image {
        url(version: ["main", "normalized", "larger", "large"])
        width
        height
      }
    }
  }
`
