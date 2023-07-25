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
    <Screen testID="ArticleWebViewScreen">
      <Screen.Header onBack={goBack} />
      <Screen.Body fullwidth>
        {/*
            NOTE: we don't need safeAreaEdges but passing undefined or empty array didn't work,
            so we're passing "left" that doesn't actually add anything to the webview to avoid
            having double paddings from Screen and ArtsyWebView
        */}
        <ArtsyWebView url={data.href} safeAreaEdges={["left"]} />
      </Screen.Body>
    </Screen>
  )
}

const articleWebViewFragment = graphql`
  fragment ArticleWebViewScreen_article on Article {
    href
  }
`
