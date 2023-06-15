import { Screen } from "@artsy/palette-mobile"
import { ArticleWebViewScreen_article$key } from "__generated__/ArticleWebViewScreen_article.graphql"
import { ArtsyWebView } from "app/Components/ArtsyWebView"
import { goBack } from "app/system/navigation/navigate"
import { graphql, useFragment } from "react-relay"

interface ArticleWebViewScreenProps {
  article: ArticleWebViewScreen_article$key
}

export const ArticleWebViewScreen: React.FC<ArticleWebViewScreenProps> = ({ article }) => {
  const data = useFragment(articleWebViewFragment, article)

  if (!data.href) {
    return null
  }

  return (
    <Screen>
      <Screen.Header title={data.title ?? ""} onBack={goBack} />
      <Screen.Body>
        <ArtsyWebView url={data.href} />
      </Screen.Body>
    </Screen>
  )
}

const articleWebViewFragment = graphql`
  fragment ArticleWebViewScreen_article on Article {
    title
    href
  }
`
