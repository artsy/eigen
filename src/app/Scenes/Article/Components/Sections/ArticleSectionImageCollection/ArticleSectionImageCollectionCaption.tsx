import { Text } from "@artsy/palette-mobile"
import { ArticleSectionImageCollectionCaption_figure$key } from "__generated__/ArticleSectionImageCollectionCaption_figure.graphql"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface ArticleSectionImageCollectionCaptionProps {
  figure: ArticleSectionImageCollectionCaption_figure$key
}

export const ArticleSectionImageCollectionCaption: React.FC<
  ArticleSectionImageCollectionCaptionProps
> = ({ figure }) => {
  const data = useFragment(ArticleSectionImageCollectionCaptionQuery, figure)

  return <>{data.__typename === "ArticleImageSection" && <Text>{data.caption}</Text>}</>
}

const ArticleSectionImageCollectionCaptionQuery = graphql`
  fragment ArticleSectionImageCollectionCaption_figure on ArticleSectionImageCollectionFigure {
    __typename
    ... on ArticleImageSection {
      caption
    }
    ... on ArticleUnpublishedArtwork {
      title
      date
      artist {
        name
      }
      partner {
        name
      }
    }
  }
`
