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

  return <Image src={data.image.url} width={width} aspectRatio={data.image.aspectRatio} />
}

const ArticleSectionImageCollectionImageQuery = graphql`
  fragment ArticleSectionImageCollectionImage_figure on ArticleSectionImageCollectionFigure {
    ... on ArticleImageSection {
      id
      image {
        url
        width
        height
        aspectRatio
      }
    }
    ... on Artwork {
      id
      image {
        url
        width
        height
        aspectRatio
      }
    }
    ... on ArticleUnpublishedArtwork {
      id
      image {
        url
        width
        height
        aspectRatio
      }
    }
  }
`
