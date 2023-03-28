import {
  BellIcon,
  BellFillIcon,
  Box,
  Flex,
  HeartFillIcon,
  HeartIcon,
  Spacer,
  Text,
  useSpace,
} from "@artsy/palette-mobile"
import { ArtworkSaveButton_artwork$key } from "__generated__/ArtworkSaveButton_artwork.graphql"
import { refreshFavoriteArtworks } from "app/utils/refreshHelpers"
import { Schema } from "app/utils/track"
import { isEmpty } from "lodash"
import { Touchable } from "palette"
import { StyleSheet } from "react-native"
import { graphql, useFragment, useMutation } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtworkSaveButtonProps {
  artwork: ArtworkSaveButton_artwork$key
}

interface IconProps {
  isSaved: boolean
}

const WatchLotIcon: React.FC<IconProps> = ({ isSaved }) => {
  if (isSaved) {
    return <BellFillIcon accessibilityLabel="unwatch lot icon" fill="blue100" />
  }

  return <BellIcon accessibilityLabel="watch lot icon" />
}

const SaveButtonIcon: React.FC<IconProps> = ({ isSaved }) => {
  if (isSaved) {
    return <HeartFillIcon accessibilityLabel="Saved icon" fill="blue100" />
  }

  return <HeartIcon accessibilityLabel="Save icon" />
}

const getSaveButtonText = (isSaved: boolean, isOpenSale: boolean) => {
  if (isOpenSale) {
    return "Watch lot"
  }

  return isSaved ? "Saved" : "Save"
}

const getA11yLabel = (isSaved: boolean, isOpenSale: boolean) => {
  if (isOpenSale) {
    return "Watch lot"
  }

  if (isSaved) {
    return "Unsave artwork"
  }

  return "Save artwork"
}

export const ArtworkSaveButton: React.FC<ArtworkSaveButtonProps> = ({ artwork }) => {
  const space = useSpace()
  const { trackEvent } = useTracking()
  const { isSaved, internalID, id, sale } = useFragment(ArtworkSaveButtonFragment, artwork)
  const [commit] = useMutation(ArtworkSaveMutation)

  const isOpenSale = !isEmpty(sale) && sale?.isAuction && !sale?.isClosed

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

  const a11yLabel = getA11yLabel(!!isSaved, !!isOpenSale)
  const buttonCopy = getSaveButtonText(!!isSaved, !!isOpenSale)

  return (
    <Touchable
      hitSlop={{
        top: space(1),
        left: space(1),
        bottom: space(1),
      }}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      onPress={handleArtworkSave}
    >
      <Flex flexDirection="row" justifyContent="flex-start" alignItems="center">
        {isOpenSale ? <WatchLotIcon isSaved={!!isSaved} /> : <SaveButtonIcon isSaved={!!isSaved} />}
        <Spacer x={0.5} />

        <Box position="relative">
          {/* Longest text transparent to prevent changing text pushing elements on the right */}
          {/* Hiding it in the testing environment since it is not visible to the users */}
          {/* Hidden from screen readers */}
          {!__TEST__ && (
            <Text variant="sm" color="transparent" accessibilityElementsHidden>
              {isOpenSale ? "Watch lot" : "Saved"}
            </Text>
          )}
          <Box {...StyleSheet.absoluteFillObject}>
            <Text variant="sm">{buttonCopy}</Text>
          </Box>
        </Box>
      </Flex>
    </Touchable>
  )
}

const ArtworkSaveButtonFragment = graphql`
  fragment ArtworkSaveButton_artwork on Artwork {
    id
    internalID
    isSaved
    sale {
      isAuction
      isClosed
    }
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
