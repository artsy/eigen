import { Spacer } from "@artsy/palette-mobile"
import { RelatedArticlesRail_articles$key } from "__generated__/RelatedArticlesRail_articles.graphql"
import { ArticleCardContainer } from "app/Components/ArticleCard"
import { FlatList } from "react-native"
import { graphql, useFragment } from "react-relay"

interface ArticlesRailProps {
  relatedArticles: RelatedArticlesRail_articles$key
}

export const RelatedArticlesRail: React.FC<ArticlesRailProps> = ({ relatedArticles }) => {
  const data = useFragment(relatedArticlesRailQuery, relatedArticles)

  if (data?.relatedArticles?.length === 0) {
    return null
  }

  return (
    <>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <Spacer x={2} />}
        data={data?.relatedArticles}
        keyExtractor={(item) => `relatedArticle-${item.internalID}`}
        renderItem={({ item }) => <ArticleCardContainer article={item} />}
      />
    </>
  )
}

const relatedArticlesRailQuery = graphql`
  fragment RelatedArticlesRail_articles on Article {
    internalID
    slug
    relatedArticles {
      internalID
      ...ArticleCard_article
    }
  }
`
