import { ArticleCard_article$data } from "__generated__/ArticleCard_article.graphql"
import ImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "app/navigation/navigate"
import { useFeatureFlag } from "app/store/GlobalStore"
import { Flex, OpaqueImageView, Spacer, Text, useTheme } from "palette"
import React from "react"
import {
  GestureResponderEvent,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
  ViewProps,
} from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

const WIDTH = 295
const HEIGHT = 230

interface ArticleCardProps extends ViewProps {
  article: ArticleCard_article$data
  isFluid?: boolean
  onPress?(event: GestureResponderEvent): void
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onPress, isFluid }) => {
  const imageURL = article.thumbnailImage?.url

  const onTap = (event: GestureResponderEvent) => {
    onPress?.(event)
    navigate(article.href!)
  }

  const { space } = useTheme()
  const { width } = useWindowDimensions()
  const enableNewOpaqueImageView = useFeatureFlag("AREnableNewOpaqueImageView")

  return (
    <Flex width={isFluid ? "100%" : WIDTH}>
      <TouchableWithoutFeedback onPress={onTap}>
        <Flex width={isFluid ? "100%" : WIDTH} overflow="hidden">
          {!!imageURL &&
            (isFluid ? (
              <>
                {enableNewOpaqueImageView ? (
                  <View style={{ width }}>
                    <OpaqueImageView
                      imageURL={imageURL}
                      // aspect ratio is fixed to 1.33 to match the old image aspect ratio
                      aspectRatio={1.33}
                      // 40 here comes from the mx={2} from the parent component
                      width={width - 2 * space(2)}
                    />
                  </View>
                ) : (
                  <View style={{ width: "100%", aspectRatio: 1.33 }}>
                    <ImageView imageURL={imageURL} style={{ flex: 1 }} />
                  </View>
                )}
              </>
            ) : enableNewOpaqueImageView ? (
              <OpaqueImageView imageURL={imageURL} width={WIDTH} height={HEIGHT} />
            ) : (
              <ImageView imageURL={imageURL} width={WIDTH} height={HEIGHT} />
            ))}
          <Spacer mb={1} />
          <Text variant="xs">{article.vertical || " "}</Text>
          <Text numberOfLines={3} ellipsizeMode="tail" variant="lg">
            {article.thumbnailTitle}
          </Text>
          {!!article.author && (
            <Text color="black60" variant="xs">
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
      internalID
      slug
      author {
        name
      }
      href
      thumbnailImage {
        url(version: "large")
      }
      thumbnailTitle
      vertical
    }
  `,
})
