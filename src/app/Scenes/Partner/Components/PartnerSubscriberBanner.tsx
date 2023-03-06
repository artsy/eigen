import { Box, LinkText } from "@artsy/palette-mobile"
import { PartnerSubscriberBanner_partner$data } from "__generated__/PartnerSubscriberBanner_partner.graphql"
import { navigate } from "app/system/navigation/navigate"
import { SimpleMessage } from "palette"
import { createFragmentContainer, graphql } from "react-relay"

interface PartnerSubscriberBannerProps {
  partner: PartnerSubscriberBanner_partner$data
}

export const PartnerSubscriberBanner: React.FC<PartnerSubscriberBannerProps> = ({ partner }) => {
  const { name, hasFairPartnership } = partner
  const fairPartner = `${name} participated in Artsy’s art fair coverage but does not have a full profile.`
  const churnedPartner = `${name} is not currently an Artsy partner and does not have a full profile.`
  const title = hasFairPartnership ? fairPartner : churnedPartner

  return (
    <Box px={2}>
      <SimpleMessage>
        {title} Are you a representative of {name}?{" "}
        <LinkText
          onPress={() => {
            navigate("https://partners.artsy.net/gallery-partnerships")
          }}
        >
          Learn about Artsy gallery partnerships.
        </LinkText>
      </SimpleMessage>
    </Box>
  )
}

export const PartnerSubscriberBannerFragmentContainer = createFragmentContainer(
  PartnerSubscriberBanner,
  {
    partner: graphql`
      fragment PartnerSubscriberBanner_partner on Partner {
        name
        hasFairPartnership
      }
    `,
  }
)
