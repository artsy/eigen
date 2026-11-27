import { ActionType, ContextModule, OwnerType, TappedCV } from "@artsy/cohesion"
import { Text } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"
import React from "react"
import { useTracking } from "react-tracking"

interface ArtistCVLinkProps {
  artistID: string
  artistSlug: string
  contextModule: ContextModule
  children: string
}

export const ArtistCVLink: React.FC<ArtistCVLinkProps> = ({
  artistID,
  artistSlug,
  contextModule,
  children,
}) => {
  const { trackEvent } = useTracking()

  return (
    <RouterLink
      to={`/artist/${artistSlug}/cv`}
      onPress={() => trackEvent(tracks.tappedCV(artistID, artistSlug, contextModule))}
    >
      <Text variant="sm" underline>
        {children}
      </Text>
    </RouterLink>
  )
}

const tracks = {
  tappedCV: (artistID: string, artistSlug: string, contextModule: ContextModule): TappedCV => ({
    action: ActionType.tappedCV,
    context_module: contextModule,
    context_screen_owner_type: OwnerType.artistAbout,
    context_screen_owner_id: artistID,
    context_screen_owner_slug: artistSlug,
  }),
}
