import { Text } from "@artsy/palette-mobile"
import { ArtworkExtraLinks_artwork$data } from "__generated__/ArtworkExtraLinks_artwork.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { switchTab } from "app/system/navigation/navigate"
import { Schema } from "app/utils/track"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { AuctionFaqSection } from "./AuctionFaqSection"

export interface ArtworkExtraLinksProps {
  artwork: ArtworkExtraLinks_artwork$data
  auctionState: AuctionTimerState
}

export const ArtworkExtraLinks: React.FC<ArtworkExtraLinksProps> = ({ artwork, auctionState }) => {
  const artists = artwork.artists ?? []
  const consignableArtistsCount = artists.filter((artist) => artist?.isConsignable).length ?? 0
  const artistName = artists.length === 1 ? artists[0]?.name : null

  return (
    <>
      <AuctionFaqSection artwork={artwork} auctionState={auctionState} />
      {!!consignableArtistsCount && (
        <ConsignmentsLink
          artistName={consignableArtistsCount > 1 ? "these artists" : artistName ?? "this artist"}
        />
      )}
    </>
  )
}

const ConsignmentsLink: React.FC<{ artistName: string }> = ({ artistName }) => {
  const tracking = useTracking()

  return (
    <View>
      <Text variant="xs" color="black60">
        Want to sell a work by {artistName}?{" "}
        <Text
          variant="xs"
          style={{ textDecorationLine: "underline" }}
          onPress={() => {
            tracking.trackEvent({
              action_name: Schema.ActionNames.ConsignWithArtsy,
              action_type: Schema.ActionTypes.Tap,
              context_module: Schema.ContextModules.ArtworkExtraLinks,
            })
            switchTab("sell")
          }}
        >
          Consign with Artsy
        </Text>
        .
      </Text>
    </View>
  )
}

export const ArtworkExtraLinksFragmentContainer = createFragmentContainer(ArtworkExtraLinks, {
  artwork: graphql`
    fragment ArtworkExtraLinks_artwork on Artwork {
      isAcquireable
      isInAuction
      isOfferable
      title
      isForSale
      sale {
        isClosed
        isBenefit
        partner {
          name
        }
      }
      artists {
        isConsignable
        name
      }
      artist {
        name
      }
    }
  `,
})
