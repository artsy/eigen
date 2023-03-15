import { Flex, HeartFillIcon, HeartIcon, Spacer, Text, useSpace } from "@artsy/palette-mobile"
import { ArtworkSaveButton_artwork$key } from "__generated__/ArtworkSaveButton_artwork.graphql"
import { refreshFavoriteArtworks } from "app/utils/refreshHelpers"
import { Schema } from "app/utils/track"
import { Touchable } from "palette"
import { graphql, useFragment, useMutation } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtworkSaveButtonProps {
  artwork: ArtworkSaveButton_artwork$key
}

export const ArtworkSaveButton: React.FC<ArtworkSaveButtonProps> = ({ artwork }) => {
  const space = useSpace()
  const { trackEvent } = useTracking()
  const { isSaved, internalID, id } = useFragment(ArtworkSaveButtonFragment, artwork)
  const [commit] = useMutation(ArtworkSaveMutation)

  const handleArtworkSave = () => {
    commit({
      variables: {
        input: {
          artworkID: internalID,
          remove: isSaved,
        },
      },
      optimisticResponse: {
        saveArtwork: {
          artwork: {
            id,
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
    <Touchable
      hitSlop={{
        top: space(1),
        left: space(1),
        bottom: space(1),
      }}
      accessibilityRole="button"
      accessibilityLabel="Save artwork"
      onPress={handleArtworkSave}
    >
      <Flex flexDirection="row" justifyContent="flex-start" alignItems="center" pr={2}>
        {isSaved ? <HeartFillIcon fill="blue100" /> : <HeartIcon />}
        <Spacer x={0.5} />
        {/* the spaces below are to not make the icon jumpy when changing from save to saved will work on a more permanent fix */}
        <Text variant="sm">{isSaved ? "Saved" : "Save   "}</Text>
      </Flex>
    </Touchable>
  )
}

const ArtworkSaveButtonFragment = graphql`
  fragment ArtworkSaveButton_artwork on Artwork {
    id
    internalID
    isSaved
  }
`

const ArtworkSaveMutation = graphql`
  mutation ArtworkSaveButtonMutation($input: SaveArtworkInput!) {
    saveArtwork(input: $input) {
      artwork {
        id
        isSaved
      }
    }
  }
`
