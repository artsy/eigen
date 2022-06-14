import { ArtworkExtraLinks_artwork$data } from "__generated__/ArtworkExtraLinks_artwork.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { navigate } from "app/navigation/navigate"
import { useFeatureFlag, useSelectedTab } from "app/store/GlobalStore"
import { Schema } from "app/utils/track"
import { Sans } from "palette"
import React from "react"
import { Text, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { AuctionFaqSection } from "./AuctionFaqSection"
import { FaqAndSpecialistSectionFragmentContainer as FaqAndSpecialistSection } from "./FaqAndSpecialistSection"

export interface ArtworkExtraLinksProps {
  artwork: ArtworkExtraLinks_artwork$data
  auctionState: AuctionTimerState
}

export const ArtworkExtraLinks: React.FC<ArtworkExtraLinksProps> = ({ artwork, auctionState }) => {
  const artists = artwork.artists ?? []
  const consignableArtistsCount = artists.filter((artist) => artist?.isConsignable).length ?? 0
  const artistName = artists.length === 1 ? artists[0]!.name : null

  const enableCreateArtworkAlert = useFeatureFlag("AREnableCreateArtworkAlert")

  return (
    <>
      <AuctionFaqSection artwork={artwork} auctionState={auctionState} />
      {!enableCreateArtworkAlert && <FaqAndSpecialistSection artwork={artwork} />}
      {!!consignableArtistsCount && (
        <ConsignmentsLink
          artistName={consignableArtistsCount > 1 ? "these artists" : artistName ?? "this artist"}
        />
      )}
    </>
  )
}

const ConsignmentsLink: React.FC<{ artistName: string }> = ({ artistName }) => {
  const isSellTab = useSelectedTab() === "sell"
  const tracking = useTracking()

  return (
    <View>
      <Sans size="2" color="black60">
        Want to sell a work by {artistName}?{" "}
        <Text
          style={{ textDecorationLine: "underline" }}
          onPress={() => {
            tracking.trackEvent({
              action_name: Schema.ActionNames.ConsignWithArtsy,
              action_type: Schema.ActionTypes.Tap,
              context_module: Schema.ContextModules.ArtworkExtraLinks,
            })
            navigate(isSellTab ? "/collections/my-collection/marketing-landing" : "/sales")
          }}
        >
          Consign with Artsy
        </Text>
        .
      </Sans>
    </View>
  )
}

export const ArtworkExtraLinksFragmentContainer = createFragmentContainer(ArtworkExtraLinks, {
  artwork: graphql`
    fragment ArtworkExtraLinks_artwork on Artwork {
      ...FaqAndSpecialistSection_artwork
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
