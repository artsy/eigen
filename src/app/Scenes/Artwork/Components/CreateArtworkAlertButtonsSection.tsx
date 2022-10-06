import {
  ActionType,
  ContextModule,
  OwnerType,
  ScreenOwnerType,
  TappedCreateAlert,
} from "@artsy/cohesion"
import { CreateArtworkAlertButtonsSection_artwork$data } from "__generated__/CreateArtworkAlertButtonsSection_artwork.graphql"
import { CreateSavedSearchModal } from "app/Components/Artist/ArtistArtworks/CreateSavedSearchModal"
import { Aggregations } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  SavedSearchEntity,
  SavedSearchEntityArtist,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { compact, isEmpty } from "lodash"
import { Box, Button, Spacer, Text } from "palette"
import { FC, useState } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { InquiryButtonsFragmentContainer } from "./CommercialButtons/InquiryButtons"

export interface CreateArtworkAlertButtonsSectionProps {
  artwork: CreateArtworkAlertButtonsSection_artwork$data
  // FIXME:- state manager can return a string different from AuctionTimerState
  // Check CountdownTimer.tsx
  auctionState?: AuctionTimerState | string
}

const CreateArtworkAlertButtonsSection: FC<CreateArtworkAlertButtonsSectionProps> = ({
  artwork,
  auctionState,
}) => {
  const tracking = useTracking()
  const [isCreateAlertModalVisible, setIsCreateAlertModalVisible] = useState(false)
  const { isInquireable, isInAuction, sale } = artwork
  const isInClosedAuction = isInAuction && sale && auctionState === AuctionTimerState.CLOSED

  let aggregations: Aggregations = []
  let additionalGeneIDs: string[] = []
  const artists = compact(artwork?.artists)
  const attributionClass = compact([artwork?.attributionClass?.internalID])
  const formattedArtists: SavedSearchEntityArtist[] = artists.map((artist) => ({
    id: artist.internalID,
    name: artist.name!,
  }))

  const entity: SavedSearchEntity = {
    placeholder: `Artworks like: ${artwork?.title!}`,
    artists: formattedArtists,
    owner: {
      type: OwnerType.artwork,
      id: artwork?.internalID ?? "",
      slug: artwork?.slug ?? "",
    },
  }

  if (artwork?.mediumType?.filterGene?.name && artwork?.mediumType?.filterGene.slug) {
    additionalGeneIDs = [artwork.mediumType.filterGene.slug]
    aggregations = [
      {
        slice: "MEDIUM",
        counts: [
          {
            name: artwork.mediumType.filterGene.name,
            value: artwork.mediumType.filterGene.slug,
            count: 0,
          },
        ],
      },
    ]
  }

  const attributes: SearchCriteriaAttributes = {
    artistIDs: formattedArtists.map((artist) => artist.id),
    attributionClass,
    additionalGeneIDs,
  }

  const handleCreateAlertPress = () => {
    setIsCreateAlertModalVisible(true)

    const event = tracks.tappedCreateAlert({
      ownerId: entity.owner.id,
      ownerType: entity.owner.type,
      ownerSlug: entity.owner.slug,
    })

    tracking.trackEvent(event)
  }

  return (
    <>
      <Box accessible accessibilityLabel="Create artwork alert buttons section">
        <Text variant="lg">{isInClosedAuction ? "Bidding closed" : "Sold"}</Text>
        {!isEmpty(artists) && (
          <>
            <Text variant="xs" color="black60">
              Be notified when a similar work is available
            </Text>
            <Spacer mt={2} />

            <Button block onPress={handleCreateAlertPress}>
              Create Alert
            </Button>
          </>
        )}

        {!!isInquireable && !isInClosedAuction && (
          <InquiryButtonsFragmentContainer artwork={artwork} variant="outline" mt={1} block />
        )}
      </Box>
      <CreateSavedSearchModal
        visible={isCreateAlertModalVisible}
        entity={entity}
        attributes={attributes}
        aggregations={aggregations}
        closeModal={() => setIsCreateAlertModalVisible(false)}
      />
    </>
  )
}

export const CreateArtworkAlertButtonsSectionFragmentContainer = createFragmentContainer(
  CreateArtworkAlertButtonsSection,
  {
    artwork: graphql`
      fragment CreateArtworkAlertButtonsSection_artwork on Artwork {
        isInquireable
        isInAuction
        internalID
        slug
        title
        attributionClass {
          internalID
        }
        mediumType {
          filterGene {
            slug
            name
          }
        }
        artists {
          internalID
          name
        }
        sale {
          internalID
        }
        ...InquiryButtons_artwork
      }
    `,
  }
)

interface TappedCreateAlertOptions {
  ownerType: ScreenOwnerType
  ownerId: string
  ownerSlug: string
}

const tracks = {
  tappedCreateAlert: ({
    ownerType,
    ownerId,
    ownerSlug,
  }: TappedCreateAlertOptions): TappedCreateAlert => ({
    action: ActionType.tappedCreateAlert,
    context_screen_owner_type: ownerType,
    context_screen_owner_slug: ownerSlug,
    context_screen_owner_id: ownerId,
    context_module: "ArtworkTombstone" as ContextModule,
  }),
}
