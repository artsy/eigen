import { Text } from "@artsy/palette-mobile"
import { ArticleSectionImageCollectionImage_figure$key } from "__generated__/ArticleSectionImageCollectionImage_figure.graphql"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface ArticleSectionImageCollectionImageProps {
  figure: ArticleSectionImageCollectionImage_figure$key
}

export const ArticleSectionImageCollectionImage: React.FC<
  ArticleSectionImageCollectionImageProps
> = ({ figure }) => {
  const data = useFragment(ArticleSectionImageCollectionImageQuery, figure)

  return (
    <>
      <Text>{data.image?.url}</Text>
    </>
  )
}

const ArticleSectionImageCollectionImageQuery = graphql`
  fragment ArticleSectionImageCollectionImage_figure on ArticleSectionImageCollectionFigure {
    ... on ArticleImageSection {
      id
      image {
        url(version: ["normalized", "larger", "large"])
        width
        height
      }
    }
    ... on Artwork {
      id
      image {
        url(version: ["normalized", "larger", "large"])
        width
        height
      }
    }
    ... on ArticleUnpublishedArtwork {
      id
      image {
        url(version: ["normalized", "larger", "large"])
        width
        height
      }
    }
  }
`
