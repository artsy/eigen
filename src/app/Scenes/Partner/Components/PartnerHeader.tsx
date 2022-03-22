import { PartnerHeader_partner } from "__generated__/PartnerHeader_partner.graphql"
import { Stack } from "app/Components/Stack"
import { formatLargeNumberOfItems } from "app/utils/formatLargeNumberOfItems"
import { Box, Flex, Sans } from "palette"
import { createFragmentContainer, graphql } from "react-relay"
import { PartnerFollowButtonFragmentContainer as FollowButton } from "./PartnerFollowButton"

const PartnerHeader: React.FC<{
  partner: PartnerHeader_partner
}> = ({ partner }) => {
  const eligibleArtworks = partner.counts?.eligibleArtworks ?? 0

  return (
    <Box px={2} pb={1} pt={6}>
      <Sans mb={1} size="8">
        {partner.name}
      </Sans>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Stack spacing={0.5}>
          {!!eligibleArtworks && (
            <Sans size="3t">
              {!!eligibleArtworks && formatLargeNumberOfItems(eligibleArtworks, "work", "works")}
            </Sans>
          )}
        </Stack>
        {!!partner.profile && (
          <Flex flexGrow={0} flexShrink={0}>
            <FollowButton partner={partner} />
          </Flex>
        )}
      </Flex>
    </Box>
  )
}

export const PartnerHeaderContainer = createFragmentContainer(PartnerHeader, {
  partner: graphql`
    fragment PartnerHeader_partner on Partner {
      name
      profile {
        # Only fetch something so we can see if the profile exists.
        name
      }
      counts {
        eligibleArtworks
      }
      ...PartnerFollowButton_partner
    }
  `,
})
