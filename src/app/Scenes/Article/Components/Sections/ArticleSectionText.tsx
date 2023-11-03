import { ActionType, ContextModule, OwnerType, TappedLink } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { ArticleSectionText_article$key } from "__generated__/ArticleSectionText_article.graphql"
import { ArticleSectionText_section$key } from "__generated__/ArticleSectionText_section.graphql"
import { HTML } from "app/Components/HTML"
import { useFragment, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface ArticleSectionTextProps {
  article: ArticleSectionText_article$key
  section: ArticleSectionText_section$key
}

export const ArticleSectionText: React.FC<ArticleSectionTextProps> = ({ article, section }) => {
  const tracking = useTracking()
  const sectionTextData = useFragment(sectionTextFragment, section)
  const articleData = useFragment(articleFragment, article)

  if (!sectionTextData.body || !articleData) {
    return null
  }

  const trackLinkPress = (href: string) => {
    const trackingData: TappedLink = {
      action: ActionType.tappedLink,
      context_module: ContextModule.article,
      context_screen_owner_type: OwnerType.article,
      context_screen_owner_id: articleData.internalID,
      context_screen_owner_slug: articleData.slug,
      destination_path: href,
    }

    tracking.trackEvent(trackingData)
  }

  return (
    <Flex px={2}>
      <HTML html={sectionTextData.body} onLinkPress={trackLinkPress} />
    </Flex>
  )
}

const sectionTextFragment = graphql`
  fragment ArticleSectionText_section on ArticleSectionText {
    body
  }
`

const articleFragment = graphql`
  fragment ArticleSectionText_article on Article {
    internalID @required(action: NONE)
    slug @required(action: NONE)
  }
`
