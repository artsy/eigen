import { Flex, LinkText, Text } from "@artsy/palette-mobile"
import { PrivateArtworkExclusiveAccess_artwork$key } from "__generated__/PrivateArtworkExclusiveAccess_artwork.graphql"
import { navigate } from "app/system/navigation/navigate"
import React from "react"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface PrivateArtworkExclusiveAccessProps {
  artwork: PrivateArtworkExclusiveAccess_artwork$key
}

export const PrivateArtworkExclusiveAccess: React.FC<PrivateArtworkExclusiveAccessProps> = ({
  artwork,
}) => {
  const data = useFragment(
    graphql`
      fragment PrivateArtworkExclusiveAccess_artwork on Artwork {
        partner(shallow: true) {
          name
          profile {
            isPubliclyVisible
          }
          slug
        }
        isUnlisted
        additionalInformation
      }
    `,
    artwork
  )

  const tracking = useTracking()

  if (!data.isUnlisted) {
    return null
  }

  const handleLinkPress = () => {
    tracking.trackEvent(tracks.tappedGalleryName())
    navigate(`/partner/${data.partner?.slug}`)
  }

  return (
    <Flex
      border="1px solid"
      borderColor="mono100"
      borderRadius={3}
      p={2}
      textAlign="center"
      justifyContent="center"
    >
      <Text variant="sm" textAlign="center">
        <Text variant="sm" fontWeight="bold">
          Exclusive access.{" "}
        </Text>
        This work was privately shared by{" "}
        {data.partner?.profile?.isPubliclyVisible ? (
          <LinkText testID="test-partner-button" onPress={handleLinkPress}>
            {data.partner?.name}
          </LinkText>
        ) : (
          <>{data.partner?.name}</>
        )}
      </Text>
    </Flex>
  )
}

const tracks = {
  tappedGalleryName: () => ({
    context_module: "artworkDetails",
    subject: "Gallery Name",
    type: "Link",
    flow: "Exclusive access",
  }),
}
