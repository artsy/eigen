import { ActionType, ContextModule, OwnerType, TappedLink } from "@artsy/cohesion"
import { Flex, FlexProps } from "@artsy/palette-mobile"
import { ArticleSectionText_section$key } from "__generated__/ArticleSectionText_section.graphql"
import { HTML } from "app/Components/HTML"
import { useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { graphql } from "relay-runtime"

interface ArticleSectionTextProps extends FlexProps {
  internalID: string
  slug: string
  section: ArticleSectionText_section$key
}

export const ArticleSectionText: React.FC<ArticleSectionTextProps> = ({
  internalID,
  section,
  slug,
  ...flexProps
}) => {
  const tracking = useTracking()
  const data = useFragment(ArticleSectionTextQuery, section)

  if (!data.body) {
    return null
  }

  const trackLinkPress = (href: string) => {
    const trackingData: TappedLink = {
      action: ActionType.tappedLink,
      context_module: ContextModule.article,
      context_screen_owner_type: OwnerType.article,
      context_screen_owner_id: internalID,
      context_screen_owner_slug: slug,
      destination_path: href,
    }

    tracking.trackEvent(trackingData)
  }

  return (
    <Flex {...flexProps}>
      <HTML html={data.body} onLinkPress={trackLinkPress} />
    </Flex>
  )
}

const ArticleSectionTextQuery = graphql`
  fragment ArticleSectionText_section on ArticleSectionText {
    body
  }
`
