import {
  ActionType,
  ContextModule,
  OwnerType,
  ScreenOwnerType,
  TappedCreateAlert,
} from "@artsy/cohesion"
import { CreateArtworkAlertSection_artwork$data } from "__generated__/CreateArtworkAlertSection_artwork.graphql"
import { CreateSavedSearchModal } from "app/Components/Artist/ArtistArtworks/CreateSavedSearchModal"
import { Aggregations } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  SavedSearchEntity,
  SavedSearchEntityArtist,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { compact } from "lodash"
import { BellIcon, Button, Flex, Text } from "palette"
import { FC, useState } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface CreateArtworkAlertSectionProps {
  artwork: CreateArtworkAlertSection_artwork$data | null
}

export const CreateArtworkAlertSection: FC<CreateArtworkAlertSectionProps> = ({ artwork }) => {
  const tracking = useTracking()
  const [isCreateAlertModalVisible, setIsCreateAlertModalVisible] = useState(false)

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
      <Flex
        accessible
        accessibilityLabel="Create artwork alert section"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Flex flex={1}>
          <Text variant="xs" numberOfLines={2}>
            Be notified when a similar work is available
          </Text>
        </Flex>

        <Flex flex={1} alignItems="flex-end" justifyContent="center">
          <Button
            size="small"
            variant="outline"
            icon={<BellIcon fill="black100" width="16px" height="16px" />}
            haptic
            onPress={handleCreateAlertPress}
            disabled={!artwork}
          >
            <Text variant="xs" ml={0.5} numberOfLines={1} lineHeight={16}>
              Create Alert
            </Text>
          </Button>
        </Flex>
      </Flex>
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

export const CreateArtworkAlertSectionFragmentContainer = createFragmentContainer(
  CreateArtworkAlertSection,
  {
    artwork: graphql`
      fragment CreateArtworkAlertSection_artwork on Artwork {
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
    context_module: "ArtworkTombstone" as ContextModule,
  }),
}
