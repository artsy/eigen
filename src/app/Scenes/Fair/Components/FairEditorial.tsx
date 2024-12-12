import { ActionType, ContextModule, OwnerType, TappedArticleGroup } from "@artsy/cohesion"
import { Box, BoxProps, useColor, Text, Touchable, Image } from "@artsy/palette-mobile"
import { FairEditorial_fair$data } from "__generated__/FairEditorial_fair.graphql"
import { navigate } from "app/system/navigation/navigate"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface FairEditorialProps extends BoxProps {
  fair: FairEditorial_fair$data
}

export const FairEditorial: React.FC<FairEditorialProps> = ({ fair, ...rest }) => {
  const color = useColor()
  const tracking = useTracking()

  const trackTappedArticle = (articleID: string, articleSlug: string) => {
    const trackTappedArticleProps: TappedArticleGroup = {
      action: ActionType.tappedArticleGroup,
      context_module: ContextModule.relatedArticles,
      context_screen_owner_type: OwnerType.fair,
      context_screen_owner_id: fair.internalID,
      context_screen_owner_slug: fair.slug,
      destination_screen_owner_type: OwnerType.article,
      destination_screen_owner_id: articleID,
      destination_screen_owner_slug: articleSlug,
      type: "thumbnail",
    }
    tracking.trackEvent(trackTappedArticleProps)
  }

  if (!fair.articles?.edges || fair.articles.edges.length === 0) {
    return null
  }

  return (
    <Box {...rest}>
      <Box
        mb={2}
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text variant="sm-display">Related Reading</Text>

        {(fair.articles.totalCount ?? 0) > 5 && (
          <Touchable
            onPress={() => {
              navigate(`/fair/${fair.slug}/articles`)
            }}
          >
            <Text variant="sm" color="black60">
              View all
            </Text>
          </Touchable>
        )}
      </Box>

      {(fair.articles.edges || []).map((edge) => {
        if (!edge || !edge.node) {
          return null
        }

        const article = edge.node

        return (
          <Touchable
            key={article.id}
            underlayColor={color("black5")}
            onPress={() => {
              if (!article.href) {
                return
              }
              trackTappedArticle(article.internalID, article.slug ?? "")
              navigate(article.href)
            }}
          >
            <Box flexDirection="row" py={1} px={2}>
              <Box flex={1} pr={2}>
                <Text variant="sm-display">{article.title}</Text>

                <Text variant="sm" color="black60">
                  {article.publishedAt}
                </Text>
              </Box>

              {!!article.thumbnailImage?.src && (
                <Image width={90} height={50} src={article.thumbnailImage.src} />
              )}
            </Box>
          </Touchable>
        )
      })}
    </Box>
  )
}

export const FairEditorialFragmentContainer = createFragmentContainer(FairEditorial, {
  fair: graphql`
    fragment FairEditorial_fair on Fair {
      internalID
      slug
      articles: articlesConnection(first: 5, sort: PUBLISHED_AT_DESC) {
        totalCount
        edges {
          node {
            id
            internalID
            slug
            title
            href
            publishedAt(format: "MMM Do, YYYY")
            thumbnailImage {
              src: imageURL
            }
          }
        }
      }
    }
  `,
})
