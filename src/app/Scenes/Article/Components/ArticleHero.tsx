import { Flex, Image, Spacer, Text, useScreenDimensions } from "@artsy/palette-mobile"
import { ArticleHero_article$key } from "__generated__/ArticleHero_article.graphql"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { DateTime } from "luxon"
import { useFragment, graphql } from "react-relay"

interface ArticleHeroProps {
  article: ArticleHero_article$key
}

export const ArticleHero: React.FC<ArticleHeroProps> = ({ article }) => {
  const { width } = useScreenDimensions()
  const data = useFragment(ArticleHeroFragment, article)
  const showBlurhash = useFeatureFlag("ARShowBlurhashImagePlaceholder")

  return (
    <>
      {!!data.hero?.image?.url && (
        <>
          <Image
            width={width}
            src={data.hero.image.url}
            aspectRatio={data.hero.image.aspectRatio}
            blurhash={showBlurhash ? data.hero.image.blurhash : undefined}
          />

          <Spacer y={2} />
        </>
      )}

      <Flex mx={2}>
        <Text variant="xs" color="mono100">
          {data.vertical}
        </Text>

        <Text variant="lg-display" color="mono100">
          {data.title}
        </Text>

        <Text variant="xs" color="mono100" mt={0.5}>
          {data.byline}
        </Text>

        {!!data.publishedAt && (
          <Text color="mono60" variant="xs" mt={0.5}>
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
          blurhash
          url(version: ["main", "normalized", "larger", "large"])
        }
      }
    }
  }
`
