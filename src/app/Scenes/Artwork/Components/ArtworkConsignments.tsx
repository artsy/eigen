import { LinkText, Text } from "@artsy/palette-mobile"
import { ArtworkConsignments_artwork$key } from "__generated__/ArtworkConsignments_artwork.graphql"
import { popToRoot, switchTab } from "app/system/navigation/navigate"
import { useSelectedTab } from "app/utils/hooks/useSelectedTab"
import { Schema } from "app/utils/track"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtworkConsignmentsProps {
  artwork: ArtworkConsignments_artwork$key
}

export const ArtworkConsignments: React.FC<ArtworkConsignmentsProps> = ({ artwork }) => {
  const tracking = useTracking()
  const data = useFragment(artworkConsignmentsFragment, artwork)
  const artists = data.artists ?? []
  const consignableArtists = artists.filter((artist) => !!artist?.isConsignable)
  const firstArtistName = artists[0]?.name ?? "this artist"
  const label = consignableArtists.length > 1 ? "these artists" : firstArtistName

  const activeTab = useSelectedTab()

  const handleLinkPress = () => {
    tracking.trackEvent({
      action_name: Schema.ActionNames.ConsignWithArtsy,
      action_type: Schema.ActionTypes.Tap,
      // TODO: Update context module
      context_module: Schema.ContextModules.ArtworkExtraLinks,
    })
    if (activeTab === "sell") {
      popToRoot()
    } else {
      switchTab("sell")
    }
  }

  if (!artists.length) {
    return null
  }

  return (
    <Text variant="sm-display">
      Want to sell a work by {label}?{" "}
      <LinkText onPress={handleLinkPress}>Consign with Artsy</LinkText>.
    </Text>
  )
}

const artworkConsignmentsFragment = graphql`
  fragment ArtworkConsignments_artwork on Artwork {
    artists(shallow: true) {
      isConsignable
      name
    }
  }
`
