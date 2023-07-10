import { Flex, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import { Articles_article$key } from "__generated__/Articles_article.graphql"
import { navigate } from "app/system/navigation/navigate"
import FastImage from "react-native-fast-image"
import { useFragment, graphql } from "react-relay"

interface ArticleProps {
  article: Articles_article$key
  headline?: boolean
}

export const Article: React.FC<ArticleProps> = ({ article, headline = false }) => {
  const data = useFragment(articleQuery, article)

  const handleOnPress = () => {
    navigate(data.href!)
  }

  return (
    <Touchable onPress={handleOnPress}>
      <Flex width="100%" overflow="hidden">
        <Flex width="100%" style={{ aspectRatio: 1.5 }}>
          {/* TODO: palette Image doesn't work with percentages, we can change it
              as soon as the palette element works
           */}
          <FastImage
            source={{ uri: data.thumbnailImage?.url ?? "" }}
            style={{
              width: "100%",
              height: "100%",
            }}
            resizeMode="cover"
          />
        </Flex>
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
