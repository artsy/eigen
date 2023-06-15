import { DEFAULT_HIT_SLOP, ShareIcon } from "@artsy/palette-mobile"
import { ArticleShareButton_article$key } from "__generated__/ArticleShareButton_article.graphql"
import { getShareURL } from "app/Components/ShareSheet/helpers"
import { TouchableOpacity } from "react-native"
import RNShare from "react-native-share"
import { graphql, useFragment } from "react-relay"

interface ArticleShareButtonProps {
  article: ArticleShareButton_article$key
}

export const ArticleShareButton: React.FC<ArticleShareButtonProps> = (props) => {
  const data = useFragment(articleShareButtonFragment, props.article)

  const handleSharePress = async () => {
    try {
      const url = getShareURL(`${data.href}?utm_content=article-share`)
      const message = `${data.title} on Artsy`

      await RNShare.open({
        title: data.title ?? "",
        message: message + "\n" + url,
        failOnCancel: false,
      })
    } catch (error) {
      console.error("[ArticleScreen] Error sharing article:", error)
    }
  }

  return (
    <TouchableOpacity onPress={handleSharePress} hitSlop={DEFAULT_HIT_SLOP}>
      <ShareIcon fill="black100" width="25px" height="25px" top="2px" />
    </TouchableOpacity>
  )
}

const articleShareButtonFragment = graphql`
  fragment ArticleShareButton_article on Article {
    href
    title
  }
`
