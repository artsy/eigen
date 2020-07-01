import { ArrowRightIcon, BorderBox, Box, Flex, Sans } from "@artsy/palette"
import React, { useRef } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"

import { ArtistConsignButton_artist } from "__generated__/ArtistConsignButton_artist.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Router } from "lib/utils/router"
import { Schema } from "lib/utils/track"
import { NativeModules, TouchableOpacity } from "react-native"

export interface ArtistConsignButtonProps {
  artist: ArtistConsignButton_artist
}

export const ArtistConsignButton: React.FC<ArtistConsignButtonProps> = props => {
  const tracking = useTracking()
  const buttonRef = useRef()

  const {
    artist: {
      // @ts-ignore STRICTNESS_MIGRATION
      targetSupply: { isInMicrofunnel, isTargetSupply },
      name,
      image,
    },
  } = props
  const imageURL = image?.cropped?.url
  const showImage = imageURL && (isInMicrofunnel || isTargetSupply)
  const headline = isInMicrofunnel ? `Sell your ${name}` : "Sell art from your collection"

  return (
    <TouchableOpacity
      // @ts-ignore STRICTNESS_MIGRATION
      ref={buttonRef}
      onPress={() => {
        const featureFlag = NativeModules?.Emission?.options?.AROptionsMoveCityGuideEnableSales
        const destination = featureFlag ? "/sales" : Router.ConsignmentsStartSubmission

        tracking.trackEvent({
          context_page: Schema.PageNames.ArtistPage,
          context_page_owner_id: props.artist.internalID,
          context_page_owner_slug: props.artist.slug,
          context_page_owner_type: Schema.OwnerEntityTypes.Artist,
          context_module: Schema.ContextModules.ArtistConsignment,
          subject: Schema.ActionNames.ArtistConsignGetStarted,
          destination_path: destination,
        })

        // @ts-ignore STRICTNESS_MIGRATION
        SwitchBoard.presentNavigationViewController(buttonRef.current, destination)
      }}
    >
      <BorderBox p={0}>
        <Flex flexDirection="row" alignItems="center">
          <Flex alignItems="center" flexDirection="row" style={{ flex: 1 }}>
            {showImage && !!imageURL && (
              <Box pr={2}>
                <Image source={{ uri: imageURL }} />
              </Box>
            )}
            <Flex
              justifyContent="center"
              style={{ flex: 1, minHeight: 70 }}
              p={showImage ? 0 : 1}
              pl={showImage ? 0 : 2}
            >
              <Sans size="3t" weight="medium" style={{ flexWrap: "wrap" }}>
                {headline}
              </Sans>
              <Box position="relative">
                <Sans size="3t" color="black60">
                  Consign with Artsy
                </Sans>
              </Box>
            </Flex>
          </Flex>
          <Box px={2}>
            <ArrowRightIcon />
          </Box>
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
        isTargetSupply
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
  width: 76;
  height: 70;
`

export const tests = {
  Image,
}
