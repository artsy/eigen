import { ActionType, ContextModule, OwnerType, TappedArticleShare } from "@artsy/cohesion"
import { DEFAULT_HIT_SLOP, ShareIcon } from "@artsy/palette-mobile"
import { ArticleShareButton_article$key } from "__generated__/ArticleShareButton_article.graphql"
import { getShareURL } from "app/Components/ShareSheet/helpers"
import { TouchableOpacity } from "react-native"
import RNShare from "react-native-share"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface ArticleShareButtonProps {
  article: ArticleShareButton_article$key
}

export const ArticleShareButton: React.FC<ArticleShareButtonProps> = (props) => {
  const tracking = useTracking()
  const data = useFragment(articleShareButtonFragment, props.article)

  const handleSharePress = async () => {
    try {
      trackShare()

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

  const trackShare = () => {
    const trackingEvent: TappedArticleShare = {
      action: ActionType.tappedArticleShare,
      context_module: ContextModule.article,
      context_screen_owner_type: OwnerType.article,
      context_screen_owner_id: data.internalID,
      context_screen_owner_slug: data.slug ?? "",
    }

    tracking.trackEvent(trackingEvent)
  }

  return (
    <TouchableOpacity onPress={handleSharePress} hitSlop={DEFAULT_HIT_SLOP} testID="shareButton">
      <ShareIcon fill="mono100" width="25px" height="25px" top="2px" />
    </TouchableOpacity>
  )
}

const articleShareButtonFragment = graphql`
  fragment ArticleShareButton_article on Article {
    internalID
    href
    slug
    title
  }
`
