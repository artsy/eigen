import { AddIcon, Box, Button, LinkText, Text } from "@artsy/palette-mobile"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ProgressiveOnboardingSignalInterest } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingSignalInterest"
import { navigate } from "app/system/navigation/navigate"

const PARTNER_OFFER_HELP_ARTICLE_URL = "https://support.artsy.net/s/"

export const SavesTabHeader = () => {
  const { dispatch } = useArtworkListsContext()

  const handleCreateList = () => {
    dispatch({
      type: "SET_CREATE_NEW_ARTWORK_LIST_VIEW_VISIBLE",
      payload: true,
    })
  }

  return (
    <Box>
      <ProgressiveOnboardingSignalInterest>
        <Text variant="xs" color="black60">
          Curate your own lists of the works you love and{" "}
          <LinkText
            variant="xs"
            color="black60"
            onPress={() => navigate(PARTNER_OFFER_HELP_ARTICLE_URL)}
          >
            signal your interest to galleries
          </LinkText>
          .
        </Text>
      </ProgressiveOnboardingSignalInterest>

      <Button
        haptic
        variant="text"
        size="small"
        onPress={handleCreateList}
        icon={<AddIcon />}
        ml={-1}
        my={2}
      >
        Create New List
      </Button>
    </Box>
  )
}
