import {
  ActionType,
  ContextModule,
  OwnerType,
  ScreenOwnerType,
  TappedCreateAlert,
} from "@artsy/cohesion"
import { BellIcon } from "@artsy/palette-mobile"
import { ArtworkScreenHeaderCreateAlert_artwork$data } from "__generated__/ArtworkScreenHeaderCreateAlert_artwork.graphql"
import { CreateSavedSearchModal } from "app/Components/Artist/ArtistArtworks/CreateSavedSearchModal"
import { Aggregations } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  SavedSearchEntity,
  SavedSearchEntityArtist,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { compact, isEmpty } from "lodash"
import { Button } from "palette"
import { useState } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtworkScreenHeaderCreateAlertProps {
  artwork: ArtworkScreenHeaderCreateAlert_artwork$data
}

const ArtworkScreenHeaderCreateAlert: React.FC<ArtworkScreenHeaderCreateAlertProps> = ({
  artwork,
}) => {
  const { isForSale } = artwork
  const { trackEvent } = useTracking()
  const [isCreateAlertModalVisible, setIsCreateAlertModalVisible] = useState(false)

  const hasArtists = !isEmpty(artwork.artists) && artwork.artists!.length > 0

  if (!hasArtists) {
    return null
  }

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

    trackEvent(event)
  }

  return (
    <>
      <Button
        size="small"
        variant={isForSale ? "outline" : "fillDark"}
        textVariant="xs"
        haptic
        onPress={handleCreateAlertPress}
        icon={<BellIcon />}
      >
        Create Alert
      </Button>
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

export const ArtworkScreenHeaderCreateAlertFragmentContainer = createFragmentContainer(
  ArtworkScreenHeaderCreateAlert,
  {
    artwork: graphql`
      fragment ArtworkScreenHeaderCreateAlert_artwork on Artwork {
        title
        internalID
        slug
        isForSale
        artists {
          internalID
          name
        }
        attributionClass {
          internalID
        }
        mediumType {
          filterGene {
            slug
            name
          }
        }
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
    context_screen_owner_id: ownerId,
    context_screen_owner_slug: ownerSlug,
    context_module: "ArtworkScreenHeader" as ContextModule,
  }),
}
