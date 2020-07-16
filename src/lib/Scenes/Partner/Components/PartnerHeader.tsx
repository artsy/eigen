import { Box, Sans, Spacer } from "@artsy/palette"
import { PartnerHeader_partner } from "__generated__/PartnerHeader_partner.graphql"
import { Stack } from "lib/Components/Stack"
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
      <Stack spacing={0.5}>
        <Sans size="8">{partner.name}</Sans>
        {!!(followersCount || eligibleArtworks) && (
          <Sans size="3t">
            {!!eligibleArtworks && `${eligibleArtworks.toLocaleString()} Works for sale`}
            {!!(followersCount && eligibleArtworks) && "  •  "}
            {!!followersCount && `${followersCount.toLocaleString()} Followers`}
          </Sans>
        )}
      </Stack>
      <Spacer mb={2} />
      <FollowButton block partner={partner} followersCount={followersCount} setFollowersCount={setFollowersCount} />
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
