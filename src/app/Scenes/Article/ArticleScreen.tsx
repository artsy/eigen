import { Text } from "@artsy/palette-mobile"
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
  const data = useLazyLoadQuery(ArticleScreenQuery, {
    slug: "artsy-editorial-data-spotlight-artists-demand-2023",
  })
  console.log(data)
  return <Text>Hi Article</Text>
}

export const ArticleScreenQuery = graphql`
  query ArticleScreenQuery($slug: String!) {
    article(id: $slug) {
      internalID
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
