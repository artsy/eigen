import { BorderBox, Box, Button, Flex, Sans } from "@artsy/palette"
import React, { useRef } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"

import { ArtistConsignButton_artist } from "__generated__/ArtistConsignButton_artist.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Router } from "lib/utils/router"
import { Schema } from "lib/utils/track"
import { TouchableOpacity } from "react-native"

export interface ArtistConsignButtonProps {
  artist: ArtistConsignButton_artist
}

export const ArtistConsignButton: React.FC<ArtistConsignButtonProps> = props => {
  const tracking = useTracking()
  const buttonRef = useRef()

  const {
    artist: {
      targetSupply: { isInMicrofunnel },
      name,
      image,
    },
  } = props
  const imageURL = image?.cropped?.url
  const headline = isInMicrofunnel ? `Sell your ${name}` : "Sell art from your collection"

  return (
    <TouchableOpacity
      ref={buttonRef}
      onPress={() => {
        tracking.trackEvent({
          context_page: Schema.PageNames.ArtistPage,
          context_page_owner_id: props.artist.internalID,
          context_page_owner_slug: props.artist.slug,
          context_page_owner_type: Schema.OwnerEntityTypes.Artist,
          context_module: Schema.ContextModules.ArtistConsignment,
          subject: Schema.ActionNames.ArtistConsignGetStarted,
          destination_path: Router.ConsignmentsStartSubmission,
        })

        SwitchBoard.presentNavigationViewController(buttonRef.current, Router.ConsignmentsStartSubmission)
      }}
    >
      <BorderBox p={1}>
        <Flex alignItems="center" flexDirection="row">
          {isInMicrofunnel && imageURL && (
            <Box pr={2}>
              <Image source={{ uri: imageURL }} />
            </Box>
          )}
          <Flex justifyContent="center">
            <Sans size="3t" weight="medium">
              {headline}
            </Sans>
            <Box top="-2px" position="relative">
              <Sans size="3t" color="black60">
                Consign with Artsy
              </Sans>
            </Box>
            <Box>
              <Button size="small" variant="secondaryGray">
                Get started
              </Button>
            </Box>
          </Flex>
        </Flex>
      </BorderBox>
    </TouchableOpacity>
  )
}

export const ArtistConsignButtonFragmentContainer = createFragmentContainer(ArtistConsignButton, {
  artist: graphql`
    fragment ArtistConsignButton_artist on Artist {
      targetSupply {
        isInMicrofunnel
      }
      internalID
      slug
      name
      image {
        cropped(width: 66, height: 66) {
          url
        }
      }
    }
  `,
})

const Image = styled.Image`
  height: 66;
  width: 66;
`

export const tests = {
  Image,
}
