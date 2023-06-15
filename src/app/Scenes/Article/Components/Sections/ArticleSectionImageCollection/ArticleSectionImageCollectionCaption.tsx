import { useColor } from "@artsy/palette-mobile"
import { ArticleSectionImageCollectionCaption_figure$key } from "__generated__/ArticleSectionImageCollectionCaption_figure.graphql"
import { HTML } from "app/Components/HTML"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface ArticleSectionImageCollectionCaptionProps {
  figure: ArticleSectionImageCollectionCaption_figure$key
}

export const ArticleSectionImageCollectionCaption: React.FC<
  ArticleSectionImageCollectionCaptionProps
> = ({ figure }) => {
  const data = useFragment(ArticleSectionImageCollectionCaptionQuery, figure)

  const color = useColor()

  if (data.__typename !== "ArticleImageSection") {
    return null
  }

  return (
    <HTML
      html={data.caption as string}
      variant="xs"
      margin="auto"
      tagStyles={{
        p: {
          color: color("black60"),
          textAlign: "center",
        },
      }}
    />
  )
}

const ArticleSectionImageCollectionCaptionQuery = graphql`
  fragment ArticleSectionImageCollectionCaption_figure on ArticleSectionImageCollectionFigure {
    __typename
    ... on ArticleImageSection {
      caption
    }
  }
`
