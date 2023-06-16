import { Flex, FlexProps, Spacer, useSpace } from "@artsy/palette-mobile"
import { ArticleRelatedArticlesRail_article$key } from "__generated__/ArticleRelatedArticlesRail_article.graphql"
import { ArticleCardContainer } from "app/Components/ArticleCard"
import { FlatList } from "react-native"
import { graphql, useFragment } from "react-relay"

interface ArticlesRailProps extends FlexProps {
  relatedArticles: ArticleRelatedArticlesRail_article$key
}

export const ArticleRelatedArticlesRail: React.FC<ArticlesRailProps> = ({
  relatedArticles,
  ...flexProps
}) => {
  const space = useSpace()

  const data = useFragment(relatedArticlesRailQuery, relatedArticles)

  if (data?.relatedArticles?.length === 0) {
    return null
  }

  return (
    <Flex {...flexProps}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: space(2) }}
        ItemSeparatorComponent={() => <Spacer x={2} />}
        data={data?.relatedArticles}
        keyExtractor={(item) => `relatedArticle-${item.internalID}`}
        renderItem={({ item }) => <ArticleCardContainer article={item} />}
      />
    </Flex>
  )
}

const relatedArticlesRailQuery = graphql`
  fragment ArticleRelatedArticlesRail_article on Article {
    internalID
    slug
    relatedArticles {
      internalID
      ...ArticleCard_article
    }
  }
`
