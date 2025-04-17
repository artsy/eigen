import { Flex, Text } from "@artsy/palette-mobile"
import { ArticleSlideShowCaption_figure$key } from "__generated__/ArticleSlideShowCaption_figure.graphql"
import { HTML } from "app/Components/HTML"
import { ArticleSectionArtworkCaption } from "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionArtworkCaption"
import { graphql, useFragment } from "react-relay"
import { color } from "styled-system"

interface ArticleSlideShowCaptionProps {
  figure: ArticleSlideShowCaption_figure$key
}

export const ArticleSlideShowCaption: React.FC<ArticleSlideShowCaptionProps> = ({ figure }) => {
  const data = useFragment(fragment, figure)

  switch (data?.__typename) {
    case "Artwork":
      return <ArticleSectionArtworkCaption artwork={data} showViewArtworkCTA />
    case "ArticleImageSection":
      if (!data.caption) {
        return null
      }
      return (
        <HTML
          flexDirection="row"
          flex={1}
          html={data.caption}
          variant="sm-display"
          margin="auto"
          tagStyles={{
            p: {
              color: color("mono60"),
            },
          }}
          mr={2}
        />
      )
    case "ArticleUnpublishedArtwork":
      return (
        <Flex flex={1} mr={2}>
          {!!data.artist?.name && <Text variant="sm-display">{data.artist.name}</Text>}

          {!!data.title && (
            <Text variant="sm-display" color="mono60">
              <Text variant="sm-display" color="mono60" italic>
                {data.title}
              </Text>
              {!!data.date && `, ${data.date}`}
            </Text>
          )}

          {!!data.partner?.name && (
            <Text variant="xs" color="mono60">
              {data.partner.name}
            </Text>
          )}
        </Flex>
      )
    default:
      return null
  }
}

const fragment = graphql`
  fragment ArticleSlideShowCaption_figure on ArticleSectionImageCollectionFigure {
    __typename
    ... on Artwork {
      ...ArticleSectionArtworkCaption_artwork
    }
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
