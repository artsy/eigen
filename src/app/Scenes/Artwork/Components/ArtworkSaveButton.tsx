import { HeartFillIcon, HeartStrokeIcon } from "@artsy/icons/native"
import { Box, Flex, Spacer, Text, useSpace, Touchable } from "@artsy/palette-mobile"
import { ArtworkSaveButton_artwork$key } from "__generated__/ArtworkSaveButton_artwork.graphql"
import { useSaveArtworkToArtworkLists } from "app/Components/ArtworkLists/useSaveArtworkToArtworkLists"
import { isOpenOrUpcomingSale } from "app/Scenes/Artwork/utils/isOpenOrUpcomingSale"
import { Schema } from "app/utils/track"
import { StyleSheet } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtworkSaveButtonProps {
  artwork: ArtworkSaveButton_artwork$key
  saveToDefaultCollectionOnly?: boolean
}

interface IconProps {
  isSaved: boolean
}

const WatchLotIcon: React.FC<IconProps> = ({ isSaved }) => {
  if (isSaved) {
    return <HeartFillIcon accessibilityLabel="unwatch lot icon" fill="blue100" />
  }

  return <HeartStrokeIcon accessibilityLabel="watch lot icon" />
}

const SaveButtonIcon: React.FC<IconProps> = ({ isSaved }) => {
  if (isSaved) {
    return <HeartFillIcon accessibilityLabel="Saved icon" fill="blue100" />
  }

  return <HeartStrokeIcon accessibilityLabel="Save icon" />
}

const getSaveButtonText = (isSaved: boolean, openOrUpcomingSale: boolean) => {
  if (openOrUpcomingSale) {
    return "Watch lot"
  }

  return isSaved ? "Saved" : "Save"
}

const getA11yLabel = (isSaved: boolean, openOrUpcomingSale: boolean) => {
  if (openOrUpcomingSale) {
    return "Watch lot"
  }

  if (isSaved) {
    return "Unsave artwork"
  }

  return "Save artwork"
}

export const ArtworkSaveButton: React.FC<ArtworkSaveButtonProps> = ({
  artwork,
  saveToDefaultCollectionOnly = false,
}) => {
  const space = useSpace()
  const { trackEvent } = useTracking()
  const artworkData = useFragment(ArtworkSaveButtonFragment, artwork)

  const { isSaved, saveArtworkToLists } = useSaveArtworkToArtworkLists({
    artworkFragmentRef: artworkData,
    onCompleted: (isArtworkSaved) => {
      trackEvent({
        action_name: isArtworkSaved
          ? Schema.ActionNames.ArtworkSave
          : Schema.ActionNames.ArtworkUnsave,
        action_type: Schema.ActionTypes.Success,
        context_module: Schema.ContextModules.ArtworkActions,
      })
    },
    saveToDefaultCollectionOnly,
  })
  const { sale } = artworkData
  const openOrUpcomingSale = isOpenOrUpcomingSale(sale)

  const a11yLabel = getA11yLabel(!!isSaved, !!openOrUpcomingSale)
  const buttonCopy = getSaveButtonText(!!isSaved, !!openOrUpcomingSale)

  return (
    <Touchable
      hitSlop={{
        top: space(1),
        left: space(1),
        bottom: space(1),
      }}
      haptic
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      onPress={saveArtworkToLists}
    >
      <Flex flexDirection="row" justifyContent="flex-start" alignItems="center">
        {openOrUpcomingSale ? (
          <WatchLotIcon isSaved={!!isSaved} />
        ) : (
          <SaveButtonIcon isSaved={!!isSaved} />
        )}
        <Spacer x={0.5} />

        <Box position="relative">
          {/* Longest text transparent to prevent changing text pushing elements on the right */}
          {/* Hiding it in the testing environment since it is not visible to the users */}
          {/* Hidden from screen readers */}
          {!__TEST__ && (
            <Text variant="sm" color="transparent" accessibilityElementsHidden>
              {openOrUpcomingSale ? "Watch lot" : "Saved"}
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
    sale {
      isAuction
      isClosed
    }
    ...useSaveArtworkToArtworkLists_artwork
  }
`
