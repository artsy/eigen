import { useScreenDimensions } from "@artsy/palette-mobile"
import { ArticleSectionImageCollectionImage_figure$key } from "__generated__/ArticleSectionImageCollectionImage_figure.graphql"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
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

  if (!data.image?.resized?.src) {
    return null
  }

  return (
    <OpaqueImageView
      imageURL={data.image.resized.src}
      aspectRatio={data.image.aspectRatio}
      useRawURL
      style={{
        width: width - 40,
        aspectRatio: data.image.aspectRatio,
      }}
    />
  )
}

const ArticleSectionImageCollectionImageQuery = graphql`
  fragment ArticleSectionImageCollectionImage_figure on ArticleSectionImageCollectionFigure {
    ... on ArticleImageSection {
      id
      image {
        resized(height: 1000) {
          src
          width
          height
        }
        aspectRatio
      }
    }
    ... on Artwork {
      id
      image {
        resized(height: 1000) {
          src
          width
          height
        }
        aspectRatio
      }
    }
    ... on ArticleUnpublishedArtwork {
      id
      image {
        resized(height: 1000) {
          src
          width
          height
        }
        aspectRatio
      }
    }
  }
`
