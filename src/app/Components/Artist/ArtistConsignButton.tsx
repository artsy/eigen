import { ArrowRightIcon, BorderBox, Flex, Box, Text } from "@artsy/palette-mobile"
import { ArtistConsignButton_artist$data } from "__generated__/ArtistConsignButton_artist.graphql"
import { navigate } from "app/system/navigation/navigate"
import { useSelectedTab } from "app/utils/hooks/useSelectedTab"
import { Schema } from "app/utils/track"
import React, { useRef } from "react"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"

export interface ArtistConsignButtonProps {
  artist: ArtistConsignButton_artist$data
}

export const ArtistConsignButton: React.FC<ArtistConsignButtonProps> = (props) => {
  const tracking = useTracking()
  const buttonRef = useRef(null)
  const isSalesTab = useSelectedTab() === "sell"

  const {
    artist: { name, image },
  } = props
  const isInMicrofunnel = props.artist.targetSupply?.isInMicrofunnel
  const isTargetSupply = props.artist.targetSupply?.isTargetSupply
  const imageURL = image?.cropped?.url
  const showImage = imageURL && (isInMicrofunnel || isTargetSupply)
  const headline = isInMicrofunnel ? `Sell your ${name}` : "Sell art from your collection"

  return (
    <TouchableOpacity
      ref={buttonRef}
      onPress={() => {
        const destination: string = isSalesTab
          ? "/collections/my-collection/marketing-landing"
          : "/sales"

        tracking.trackEvent({
          context_page: Schema.PageNames.ArtistPage,
          context_page_owner_id: props.artist.internalID,
          context_page_owner_slug: props.artist.slug,
          context_page_owner_type: Schema.OwnerEntityTypes.Artist,
          context_module: Schema.ContextModules.ArtistConsignment,
          subject: Schema.ActionNames.ArtistConsignGetStarted,
          destination_path: destination,
        })

        isSalesTab
          ? navigate(destination)
          : navigate(destination, { passProps: { overwriteHardwareBackButtonPath: "search" } })
      }}
    >
      <BorderBox p={0}>
        <Flex flexDirection="row" alignItems="center">
          <Flex alignItems="center" flexDirection="row" style={{ flex: 1 }}>
            {!!(showImage && !!imageURL) && (
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
              <Text variant="sm" weight="medium" style={{ flexWrap: "wrap" }}>
                {headline}
              </Text>
              <Box position="relative">
                <Text variant="sm" color="black60">
                  Consign with Artsy
                </Text>
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
  width: 76px;
  height: 70px;
`

export const tests = {
  Image,
}
