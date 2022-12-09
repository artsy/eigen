import { ContextModule, OwnerType } from "@artsy/cohesion"
import { ArtworkScreenHeader_artwork$data } from "__generated__/ArtworkScreenHeader_artwork.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { goBack } from "app/navigation/navigate"
import { useIsStaging } from "app/store/GlobalStore"
import { refreshFavoriteArtworks } from "app/utils/refreshHelpers"
import { Schema } from "app/utils/track"
import { userHadMeaningfulInteraction } from "app/utils/userHadMeaningfulInteraction"
import { isEmpty } from "lodash"
import { BackButton, Flex, HeartFillIcon, HeartIcon, Spacer, Touchable, useSpace } from "palette"
import { createFragmentContainer, graphql, useMutation } from "react-relay"
import { useTracking } from "react-tracking"
import { ArtworkStore } from "../ArtworkStore"
import { ArtworkScreenHeaderCreateAlertFragmentContainer } from "./ArtworkScreenHeaderCreateAlert"

const HEADER_HEIGHT = 44
const SAVE_ICON_SIZE = 25

interface SaveIconProps {
  isSaved: boolean
}

const SaveIcon: React.FC<SaveIconProps> = ({ isSaved }) =>
  isSaved ? (
    <HeartFillIcon fill="blue100" width={SAVE_ICON_SIZE} height={SAVE_ICON_SIZE} />
  ) : (
    <HeartIcon width={SAVE_ICON_SIZE} height={SAVE_ICON_SIZE} />
  )

interface ArtworkScreenHeaderProps {
  artwork: ArtworkScreenHeader_artwork$data
}

const ArtworkScreenHeader: React.FC<ArtworkScreenHeaderProps> = ({ artwork }) => {
  const { trackEvent } = useTracking()
  const isStaging = useIsStaging()
  const space = useSpace()
  const auctionState = ArtworkStore.useStoreState((state) => state.auctionState)

  const { isSaved, sale } = artwork

  const [commit] = useMutation(graphql`
    mutation ArtworkScreenHeaderSaveMutation($input: SaveArtworkInput!) {
      saveArtwork(input: $input) {
        artwork {
          id
          isSaved
        }
      }
    }
  `)

  const handleArtworkSave = () => {
    commit({
      variables: {
        input: {
          artworkID: artwork.internalID,
          remove: isSaved,
        },
      },
      optimisticResponse: {
        saveArtwork: {
          artwork: {
            id: artwork.id,
            isSaved: !isSaved,
          },
        },
      },
      onCompleted: () => {
        refreshFavoriteArtworks()

        userHadMeaningfulInteraction({
          contextModule: ContextModule.artworkMetadata,
          contextOwnerType: OwnerType.artwork,
          contextOwnerId: artwork.internalID,
          contextOwnerSlug: artwork.slug,
        })

        trackEvent({
          action_name: isSaved ? Schema.ActionNames.ArtworkUnsave : Schema.ActionNames.ArtworkSave,
          action_type: Schema.ActionTypes.Success,
          context_module: Schema.ContextModules.ArtworkActions,
        })
      },
      onError: () => {
        refreshFavoriteArtworks()
      },
    })
  }

  const isOpenSale =
    !isEmpty(sale) &&
    sale?.isAuction &&
    (!sale.isClosed || auctionState !== AuctionTimerState.CLOSED)

  const saveButtonText = () => {
    if (isOpenSale) {
      return "Watch lot"
    }

    return isSaved ? "Saved" : "Save"
  }

  return (
    <Flex
      height={HEADER_HEIGHT}
      justifyContent="space-between"
      alignItems="center"
      flexDirection="row"
      px={2}
      accessibilityRole="header"
      accessibilityLabel="Artwork page header"
      {...(!!isStaging && {
        borderBottomWidth: 2,
        borderBottomColor: "devpurple",
      })}
    >
      <Flex>
        <BackButton
          onPress={goBack}
          hitSlop={{
            top: space(2),
            left: space(2),
            right: space(2),
            bottom: space(2),
          }}
        />
      </Flex>

      <Flex flexDirection="row" alignItems="center">
        <Touchable
          accessibilityRole="button"
          accessibilityLabel="Save button"
          haptic
          onPress={handleArtworkSave}
        >
          <SaveIcon isSaved={!!isSaved} />
        </Touchable>

        <Spacer ml={2} />

        <ArtworkScreenHeaderCreateAlertFragmentContainer artwork={artwork} />
      </Flex>
    </Flex>
  )
}

export const ArtworkScreenHeaderFragmentContainer = createFragmentContainer(ArtworkScreenHeader, {
  artwork: graphql`
    fragment ArtworkScreenHeader_artwork on Artwork {
      ...ArtworkScreenHeaderCreateAlert_artwork
      id
      internalID
      slug
      isSaved
      sale {
        isAuction
        isClosed
      }
    }
  `,
})
