import { Flex, Image, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import { Articles_article$key } from "__generated__/Articles_article.graphql"
import { navigate } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useFragment, graphql } from "react-relay"

interface ArticleProps {
  article: Articles_article$key
  headline?: boolean
}

export const Article: React.FC<ArticleProps> = ({ article, headline = false }) => {
  const data = useFragment(articleQuery, article)
  const enableNativeArticleView = useFeatureFlag("AREnableNativeArticleView")

  const handleOnPress = () => {
    if (enableNativeArticleView) {
      navigate(`/article2/${data.internalID}`)
    } else {
      navigate(data.href!)
    }
  }

  return (
    <Touchable onPress={handleOnPress}>
      <Flex width="100%" overflow="hidden">
        <Image
          src={data.thumbnailImage?.url ?? ""}
          aspectRatio={1.5}
          width={headline ? 350 : 175}
          backgroundColor="blue10"
        />
        <Spacer y={1} />
        <Text variant="xs" color="black100">
          {data.vertical}
        </Text>
        <Spacer y={1} />
        <Text variant={headline ? "lg-display" : "sm-display"}>{data.thumbnailTitle}</Text>
        <Spacer y={1} />
        <Text variant="xs" color="black60">{`By ${data.byline}`}</Text>
        {!headline && <Spacer y={4} />}
      </Flex>
    </Touchable>
  )
}

const articleQuery = graphql`
  fragment Articles_article on Article {
    internalID
    href
    thumbnailImage {
      url(version: "large")
    }
    thumbnailTitle
    vertical
    byline
  }
`
