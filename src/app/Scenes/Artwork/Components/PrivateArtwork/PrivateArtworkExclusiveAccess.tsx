import { Flex, LinkText, Text } from "@artsy/palette-mobile"
import { PrivateArtworkExclusiveAccess_artwork$key } from "__generated__/PrivateArtworkExclusiveAccess_artwork.graphql"
import { navigate } from "app/system/navigation/navigate"
import React from "react"
import { graphql, useFragment } from "react-relay"

interface PrivateArtworkExclusiveAccessProps {
  artwork: PrivateArtworkExclusiveAccess_artwork$key
}

export const PrivateArtworkExclusiveAccess: React.FC<PrivateArtworkExclusiveAccessProps> = ({
  artwork,
}) => {
  const data = useFragment(
    graphql`
      fragment PrivateArtworkExclusiveAccess_artwork on Artwork {
        partner {
          name
          slug
        }
        isUnlisted
        additionalInformation
      }
    `,
    artwork
  )

  if (!data.isUnlisted) {
    return null
  }

  const handleLinkPress = () => {
    navigate(`/partner/${data.partner?.slug}`)
  }

  return (
    <Flex
      border="1px solid"
      borderColor="black100"
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
        <LinkText onPress={handleLinkPress}>{data.partner?.name}</LinkText>
      </Text>
    </Flex>
  )
}
