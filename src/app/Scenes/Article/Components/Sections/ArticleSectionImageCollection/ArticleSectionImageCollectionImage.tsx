import { Image, useScreenDimensions } from "@artsy/palette-mobile"
import { ArticleSectionImageCollectionImage_figure$key } from "__generated__/ArticleSectionImageCollectionImage_figure.graphql"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface ArticleSectionImageCollectionImageProps {
  figure: ArticleSectionImageCollectionImage_figure$key
}

export const ArticleSectionImageCollectionImage: React.FC<
  ArticleSectionImageCollectionImageProps
> = ({ figure }) => {
  const { width } = useScreenDimensions()

  const data = useFragment(ArticleSectionImageCollectionImageQuery, figure)

  if (!data.image?.url) {
    return null
  }

  const widthShrinkPercentage = width / (data.image?.width ?? width)
  const height = (data.image?.height ?? width) * widthShrinkPercentage
  const aspectRatio = width / height

  return (
    <Image
      src={data.image.url}
      width={width}
      height={height}
      aspectRatio={aspectRatio}
      geminiResizeMode="fill"
    />
  )
}

const ArticleSectionImageCollectionImageQuery = graphql`
  fragment ArticleSectionImageCollectionImage_figure on ArticleSectionImageCollectionFigure {
    ... on ArticleImageSection {
      id
      image {
        url
        width
        height
      }
    }
    ... on Artwork {
      id
      image {
        url
        width
        height
      }
    }
    ... on ArticleUnpublishedArtwork {
      id
      image {
        url
        width
        height
      }
    }
  }
`
