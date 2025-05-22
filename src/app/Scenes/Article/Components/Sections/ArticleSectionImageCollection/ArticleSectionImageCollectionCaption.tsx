import { useColor } from "@artsy/palette-mobile"
import { ArticleSectionImageCollectionCaption_figure$key } from "__generated__/ArticleSectionImageCollectionCaption_figure.graphql"
import { HTML } from "app/Components/HTML"
import { ArticleSectionArtworkCaption } from "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionArtworkCaption"
import { useFragment, graphql } from "react-relay"

interface ArticleSectionImageCollectionCaptionProps {
  figure: ArticleSectionImageCollectionCaption_figure$key
}

export const ArticleSectionImageCollectionCaption: React.FC<
  ArticleSectionImageCollectionCaptionProps
> = ({ figure }) => {
  const data = useFragment(ArticleSectionImageCollectionCaptionQuery, figure)
  const typename = data.__typename

  const color = useColor()

  if (typename !== "ArticleImageSection" && typename !== "Artwork") {
    return null
  }

  if (typename === "Artwork") {
    return <ArticleSectionArtworkCaption artwork={data} />
  }

  return (
    <HTML
      html={data.caption as string}
      variant="xs"
      margin="auto"
      tagStyles={{
        p: {
          color: color("mono60"),
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
    ... on Artwork {
      ...ArticleSectionArtworkCaption_artwork
    }
  }
`
