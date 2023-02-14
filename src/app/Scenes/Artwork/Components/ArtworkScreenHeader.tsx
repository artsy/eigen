import { Spacer, HeartIcon, HeartFillIcon, Text } from "@artsy/palette-mobile"
import { ArtworkScreenHeader_artwork$data } from "__generated__/ArtworkScreenHeader_artwork.graphql"
import { useIsStaging } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { refreshFavoriteArtworks } from "app/utils/refreshHelpers"
import { Schema } from "app/utils/track"
import { BackButton, Flex, useSpace, Button } from "palette"
import { createFragmentContainer, graphql, useMutation } from "react-relay"
import { useTracking } from "react-tracking"
import { ArtworkScreenHeaderCreateAlertFragmentContainer } from "./ArtworkScreenHeaderCreateAlert"

const HEADER_HEIGHT = 44
const SAVE_ICON_SIZE = 20

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
  const { isSaved } = artwork

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
            top: space("2"),
            left: space("2"),
            right: space("2"),
            bottom: space("2"),
          }}
        />
      </Flex>

      <Flex flexDirection="row" alignItems="center">
        <Button
          size="small"
          variant="outlineLight"
          haptic
          onPress={handleArtworkSave}
          icon={<SaveIcon isSaved={!!isSaved} />}
          longestText="Savedd"
        >
          <Text variant="sm-display">{isSaved ? "Saved" : "Save"}</Text>
        </Button>

        <Spacer x={1} />

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
    }
  `,
})
