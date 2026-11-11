import { ActionType, ContextModule, OwnerType, TappedLink } from "@artsy/cohesion"
import { Flex, LinkText, Text } from "@artsy/palette-mobile"
import { PrivateArtworkExclusiveAccess_artwork$key } from "__generated__/PrivateArtworkExclusiveAccess_artwork.graphql"
// eslint-disable-next-line no-restricted-imports
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
        internalID
        slug
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
    const partnerPath = `/partner/${data.partner?.slug}`
    tracking.trackEvent(
      tracks.tappedGalleryName({
        artworkID: data.internalID,
        artworkSlug: data.slug,
        partnerPath,
      })
    )
    navigate(partnerPath)
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
  tappedGalleryName: ({
    artworkID,
    artworkSlug,
    partnerPath,
  }: {
    artworkID: string
    artworkSlug: string
    partnerPath: string
  }): TappedLink => ({
    action: ActionType.tappedLink,
    context_module: ContextModule.artworkDetails,
    context_screen_owner_type: OwnerType.artwork,
    context_screen_owner_id: artworkID,
    context_screen_owner_slug: artworkSlug,
    destination_path: partnerPath,
    destination_screen_owner_type: OwnerType.partner,
  }),
}
