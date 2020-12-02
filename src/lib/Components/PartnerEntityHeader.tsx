import { PartnerEntityHeader_partner } from "__generated__/PartnerEntityHeader_partner.graphql"
import { navigate } from "lib/navigation/navigate"
import { PartnerFollowButtonFragmentContainer as PartnerFollowButton } from "lib/Scenes/Partner/Components/PartnerFollowButton"
import { limitWithCount } from "lib/utils/limitWithCount"
import { compact } from "lodash"
import { Box, BoxProps, EntityHeader } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

export interface PartnerEntityHeaderProps extends BoxProps {
  partner: PartnerEntityHeader_partner
}

export const PartnerEntityHeader: React.FC<PartnerEntityHeaderProps> = ({ partner, ...rest }) => {
  if (partner.name === null || partner.profile === null) {
    return null
  }

  const cities = limitWithCount(compact(partner.cities), 2).join(", ")
  const avatarUrl = partner.profile.icon?.url

  return (
    <Box {...rest}>
      <TouchableWithoutFeedback onPress={() => navigate(partner.href!)}>
        <EntityHeader
          name={partner.name}
          href={Boolean(partner.isDefaultProfilePublic) ? partner.href ?? undefined : undefined}
          meta={cities ?? undefined}
          imageUrl={avatarUrl ?? undefined}
          initials={partner.initials ?? undefined}
          FollowButton={<PartnerFollowButton partner={partner} />}
        />
      </TouchableWithoutFeedback>
    </Box>
  )
}

export const PartnerEntityHeaderFragmentContainer = createFragmentContainer(PartnerEntityHeader, {
  partner: graphql`
    fragment PartnerEntityHeader_partner on Partner {
      ...PartnerFollowButton_partner
      href
      name
      cities
      isDefaultProfilePublic
      initials
      profile {
        icon {
          url(version: "square140")
        }
      }
    }
  `,
})
