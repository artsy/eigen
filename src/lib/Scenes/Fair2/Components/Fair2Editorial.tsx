import { ActionType, ContextModule, OwnerType, TappedArticleGroup } from "@artsy/cohesion"
import { Fair2Editorial_fair } from "__generated__/Fair2Editorial_fair.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { Box, BoxProps, color, Text, Touchable } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface Fair2EditorialProps extends BoxProps {
  fair: Fair2Editorial_fair
}

export const Fair2Editorial: React.FC<Fair2EditorialProps> = ({ fair, ...rest }) => {
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
      <Text mx={2} mb={2} variant="subtitle">
        Related articles
      </Text>

      {(fair.articles.edges || []).map((edge) => {
        const article = edge!.node!

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
                <Text variant="subtitle">{article.title}</Text>

                <Text variant="text" color="black60">
                  {article.publishedAt}
                </Text>
              </Box>

              {!!article.thumbnailImage?.src && (
                <OpaqueImageView width={90} height={50} imageURL={article.thumbnailImage.src} />
              )}
            </Box>
          </Touchable>
        )
      })}
    </Box>
  )
}

export const Fair2EditorialFragmentContainer = createFragmentContainer(Fair2Editorial, {
  fair: graphql`
    fragment Fair2Editorial_fair on Fair {
      internalID
      slug
      articles: articlesConnection(first: 5, sort: PUBLISHED_AT_DESC) {
        edges {
          node {
            id
            internalID
            slug
            title
            href
            publishedAt(format: "MMM Do, YY")
            thumbnailImage {
              src: imageURL
            }
          }
        }
      }
    }
  `,
})
