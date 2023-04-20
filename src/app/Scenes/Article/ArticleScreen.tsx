import { ArticleScreenQuery } from "__generated__/ArticleScreenQuery.graphql"
import { ArticleBody } from "app/Scenes/Article/Components/ArticleBody"
import { PlaceholderGrid, ProvidePlaceholderContext } from "app/utils/placeholders"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

interface ArticleScreenProps {
  articleID: string
}

export const ArticleScreen: React.FC<ArticleScreenProps> = (props) => {
  return (
    <Suspense fallback={<Placeholder />}>
      <Article {...props} />
    </Suspense>
  )
}

const Article: React.FC<ArticleScreenProps> = () => {
  const data = useLazyLoadQuery<ArticleScreenQuery>(articleScreenQuery, {
    slug: "artsy-editorial-data-spotlight-artists-demand-2023",
  })

  if (!data.article) {
    return null
  }

  return <ArticleBody article={data.article} />
}

export const articleScreenQuery = graphql`
  query ArticleScreenQuery($slug: String!) {
    article(id: $slug) {
      ...ArticleBody_article
    }
  }
`

const Placeholder: React.FC = () => {
  return (
    <ProvidePlaceholderContext>
      <PlaceholderGrid />
    </ProvidePlaceholderContext>
  )
}
