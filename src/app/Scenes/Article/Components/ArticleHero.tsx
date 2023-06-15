import { Flex, Image, Spacer, Text, useScreenDimensions } from "@artsy/palette-mobile"
import { ArticleHero_article$key } from "__generated__/ArticleHero_article.graphql"
import { DateTime } from "luxon"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface ArticleHeroProps {
  article: ArticleHero_article$key
}

export const ArticleHero: React.FC<ArticleHeroProps> = ({ article }) => {
  const { width } = useScreenDimensions()
  const data = useFragment(ArticleHeroFragment, article)

  return (
    <>
      {!!data.hero?.image?.url && (
        <>
          <Image
            width={width}
            src={data.hero.image.url}
            aspectRatio={data.hero.image.aspectRatio}
          />

          <Spacer y={2} />
        </>
      )}

      <Flex mx={2}>
        <Text variant="xs" color="black100">
          {data.vertical}
        </Text>

        <Text variant="lg-display" color="black100">
          {data.title}
        </Text>

        <Text variant="sm-display" color="black100">
          {data.byline}
        </Text>

        {!!data.publishedAt && (
          <Text color="black60" variant="xs" mt={1}>
            {DateTime.fromISO(data.publishedAt).toFormat("MMM d, yyyy")}
          </Text>
        )}
      </Flex>
    </>
  )
}

const ArticleHeroFragment = graphql`
  fragment ArticleHero_article on Article {
    title
    href
    vertical
    byline
    publishedAt
    hero {
      ... on ArticleFeatureSection {
        image {
          aspectRatio
          url
        }
      }
    }
  }
`
