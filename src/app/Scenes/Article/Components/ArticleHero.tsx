import { Flex, Image, Spacer, Text, useScreenDimensions } from "@artsy/palette-mobile"
import { ArticleHero_article$key } from "__generated__/ArticleHero_article.graphql"
import { ArticleHeroVideo } from "app/Scenes/Article/Components/ArticleHeroVideo"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { DateTime } from "luxon"
import LinearGradient from "react-native-linear-gradient"
import { useFragment, graphql } from "react-relay"

interface ArticleHeroProps {
  article: ArticleHero_article$key
}

export const ArticleHero: React.FC<ArticleHeroProps> = ({ article }) => {
  const { width, height: screenHeight, safeAreaInsets } = useScreenDimensions()
  const data = useFragment(ArticleHeroFragment, article)
  const showBlurhash = useFeatureFlag("ARShowBlurhashImagePlaceholder")

  const hasVideo = !!data.hero?.media
  const hasImage = !!data.hero?.image?.url

  if (hasVideo) {
    // Calculate height similar to web: max(50vh - navHeight, 360px)
    const navHeight = 50 + safeAreaInsets.top
    const videoHeight = Math.max(screenHeight * 0.5 - navHeight, 360)

    return (
      <Flex style={{ marginTop: safeAreaInsets.top }}>
        <Flex width={width} height={videoHeight} position="relative">
          <ArticleHeroVideo videoUrl={data.hero.media} width={width} height={videoHeight} />
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <Flex px={2} pb={2} pt={4}>
              <Text variant="sm" color="white" fontWeight="bold">
                {data.vertical}
              </Text>

              <Text
                variant="xl"
                color="white"
                style={{
                  textShadowColor: "rgba(0,0,0,0.25)",
                  textShadowRadius: 15,
                }}
              >
                {data.title}
              </Text>

              <Text
                variant="md"
                color="white"
                style={{
                  textShadowColor: "rgba(0,0,0,0.25)",
                  textShadowRadius: 15,
                }}
              >
                {data.byline}
              </Text>

              {!!data.publishedAt && (
                <Text
                  color="white"
                  variant="xs"
                  mt={0.5}
                  style={{
                    textShadowColor: "rgba(0,0,0,0.25)",
                    textShadowRadius: 15,
                  }}
                >
                  {DateTime.fromISO(data.publishedAt).toFormat("MMM d, yyyy")}
                </Text>
              )}
            </Flex>
          </LinearGradient>
        </Flex>
      </Flex>
    )
  }

  // Render image with text below
  return (
    <>
      {hasImage ? (
        <>
          <Image
            width={width}
            src={data.hero.image.url}
            aspectRatio={data.hero.image.aspectRatio}
            blurhash={showBlurhash ? data.hero.image.blurhash : undefined}
          />
          <Spacer y={2} />
        </>
      ) : null}

      <Flex mx={2}>
        <Text variant="sm" color="mono100">
          {data.vertical}
        </Text>

        <Text variant="xl" color="mono100">
          {data.title}
        </Text>

        <Text variant="md" color="mono100" mt={0.5}>
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
        media
        image {
          aspectRatio
          blurhash
          url(version: ["main", "normalized", "larger", "large"])
        }
      }
    }
  }
`
