import { Box, Flex, Sans, Serif, Spacer } from "@artsy/palette"
import { PartnerHeader_partner } from "__generated__/PartnerHeader_partner.graphql"
import { get } from "lib/utils/get"
import React, { useState } from "react"
import { Dimensions, Text } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"
import { PartnerFollowButtonFragmentContainer as FollowButton } from "./PartnerFollowButton"

const PartnerHeader: React.FC<{
  partner: PartnerHeader_partner
}> = ({ partner }) => {
  const follows = get(partner, p => p.profile.counts.follows)
  const [followersCount, setFollowersCount] = useState(follows)
  const eligibleArtworks = get(partner, p => p.counts.eligibleArtworks)
  const dimensionsWidth = Dimensions.get("window").width

  return (
    <Box px={2}>
      <Flex flexDirection="row" justifyContent="center">
        <Box>
          <Spacer mb={20} />
          <Serif style={{ textAlign: "center", width: dimensionsWidth - 140 }} size="5">
            {partner.name}
          </Serif>
          <Spacer mb={0.5} />
          {(followersCount || eligibleArtworks) && (
            <>
              <TextWrapper style={{ textAlign: "center" }}>
                {eligibleArtworks && (
                  <>
                    <Sans size="2" weight="medium">
                      {eligibleArtworks.toLocaleString()}
                    </Sans>
                    <Sans size="2"> Works for sale</Sans>
                  </>
                )}
                {followersCount &&
                  eligibleArtworks && (
                    <Sans size="2">
                      {"  "}•{"  "}
                    </Sans>
                  )}
                {followersCount && (
                  <>
                    <Sans size="2" weight="medium">
                      {followersCount.toLocaleString()}
                    </Sans>
                    <Sans size="2"> Followers</Sans>
                  </>
                )}
              </TextWrapper>
            </>
          )}
        </Box>
      </Flex>
      <FollowButtonWrapper>
        <FollowButton
          size="small"
          inline
          partner={partner}
          followersCount={followersCount}
          setFollowersCount={setFollowersCount}
        />
      </FollowButtonWrapper>
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

export const TextWrapper = styled(Text)``

const FollowButtonWrapper = styled(Box)`
  position: absolute;
  top: 20;
  right: 20;
`
