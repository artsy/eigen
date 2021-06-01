import { ArticleCard_article } from "__generated__/ArticleCard_article.graphql"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { Flex, Spacer, Text } from "palette"
import React from "react"
import { GestureResponderEvent, TouchableWithoutFeedback, ViewProps } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface ArticleCardProps extends ViewProps {
  article: ArticleCard_article
  onPress?(event: GestureResponderEvent): void
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onPress }) => {
  const imageURL = article.thumbnailImage?.url

  return (
    <Flex width={320}>
      <TouchableWithoutFeedback
        onPress={(event) => {
          onPress?.(event)
          navigate(article.href!)
        }}
      >
        <Flex width={300} overflow="hidden">
          {!!imageURL && <ImageView imageURL={article.thumbnailImage?.url} width={295} height={230} />}
          <Spacer mb={1} />
          <Text numberOfLines={2} ellipsizeMode="tail" variant={"title"}>
            {article.thumbnailTitle}
          </Text>
          {!!article.author && (
            <Text color="black60" variant={"subtitle"}>
              {article.author.name}
            </Text>
          )}
        </Flex>
      </TouchableWithoutFeedback>
    </Flex>
  )
}

export const ArticleCardContainer = createFragmentContainer(ArticleCard, {
  article: graphql`
    fragment ArticleCard_article on Article {
      thumbnailTitle
      href
      author {
        name
      }
      thumbnailImage {
        url(version: "large")
      }
    }
  `,
})
