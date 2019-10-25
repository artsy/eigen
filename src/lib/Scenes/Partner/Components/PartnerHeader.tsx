import { Box, Flex, Sans, Serif, Spacer } from "@artsy/palette"
import { PartnerHeader_partner } from "__generated__/PartnerHeader_partner.graphql"
import { get } from "lib/utils/get"
import React from "react"
import { Text } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { PartnerFollowButtonFragmentContainer as FollowButton } from "./PartnerFollowButton"

const PartnerHeader: React.FC<{
  partner: PartnerHeader_partner
  scrollY: number
}> = ({ partner }) => {
  const followsCount = get(partner, p => p.profile.counts.follows)
  return (
    <>
      <Box style={{ height: 50 }} />
      <Flex flexDirection="row" justifyContent="center">
        <Box px={2}>
          <Serif style={{ textAlign: "center" }} size="6">
            {partner.name}
          </Serif>
          {followsCount && (
            <>
              <Spacer mb={0.5} />
              <Text style={{ textAlign: "center" }}>
                <Sans size="2" weight="medium">
                  {followsCount.toLocaleString()}
                </Sans>
                <Sans size="2"> Followers</Sans>
              </Text>
            </>
          )}
          <Spacer mb={2} />
          <FollowButton partner={partner} />
        </Box>
      </Flex>
    </>
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
      ...PartnerFollowButton_partner
    }
  `,
})
