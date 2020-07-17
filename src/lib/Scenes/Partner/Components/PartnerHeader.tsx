import { Box, Flex, Sans, Spacer } from "@artsy/palette"
import { PartnerHeader_partner } from "__generated__/PartnerHeader_partner.graphql"
import { Stack } from "lib/Components/Stack"
import { formatText } from "lib/utils/formatText"
import React, { useState } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { PartnerFollowButtonFragmentContainer as FollowButton } from "./PartnerFollowButton"

const PartnerHeader: React.FC<{
  partner: PartnerHeader_partner
}> = ({ partner }) => {
  const follows = partner.profile?.counts?.follows ?? 0
  const [followersCount, setFollowersCount] = useState(follows)
  const eligibleArtworks = partner.counts?.eligibleArtworks ?? 0

  return (
    <Box px={2} pb={1} pt={6}>
      <Sans size="8">{partner.name}</Sans>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Stack spacing={0.5}>
          {!!(followersCount || eligibleArtworks) && (
            <Sans size="3t">
              {!!eligibleArtworks && formatText(eligibleArtworks, "Work for sale", "Works for sale")}
              {!!(followersCount && eligibleArtworks) && "  •  "}
              {!!followersCount && formatText(followersCount, "Follower")}
            </Sans>
          )}
        </Stack>
        <Flex flexGrow={0} flexShrink={0}>
          <FollowButton partner={partner} followersCount={followersCount} setFollowersCount={setFollowersCount} />
        </Flex>
      </Flex>
    </Box>
  )
}

export const PartnerHeaderContainer = createFragmentContainer(PartnerHeader, {
  partner: graphql`
    fragment PartnerHeader_partner on Partner {
      name
      profile {
        counts {
          follows
        }
      }
      counts {
        eligibleArtworks
      }
      ...PartnerFollowButton_partner
    }
  `,
})
