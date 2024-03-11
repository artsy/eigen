import {
  AddIcon,
  Box,
  Button,
  Flex,
  LinkText,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Text,
} from "@artsy/palette-mobile"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ProgressiveOnboardingSignalInterest } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingSignalInterest"
import { navigate } from "app/system/navigation/navigate"

const PARTNER_OFFER_HELP_ARTICLE_URL = "https://support.artsy.net/s/article/Offers-on-saved-works"

export const SavesTabHeader = () => {
  const { dispatch } = useArtworkListsContext()

  const handleCreateList = () => {
    dispatch({
      type: "SET_CREATE_NEW_ARTWORK_LIST_VIEW_VISIBLE",
      payload: true,
    })
  }

  const handleEditListPrivacy = () => {
    dispatch({
      type: "SET_EDIT_LIST_PRIVACY_VIEW_VISIBLE",
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

      <Flex flexDirection="row" justifyContent="space-between" alignItems="center" my={2}>
        <Button
          haptic
          variant="text"
          size="small"
          onPress={handleCreateList}
          icon={<AddIcon />}
          ml={-1}
        >
          Create New List
        </Button>

        <Button haptic variant="text" size="small" onPress={handleEditListPrivacy}>
          Edit List Privacy
        </Button>
      </Flex>
    </Box>
  )
}

export const SavesTabHeaderPlaceholder = () => {
  return (
    <Skeleton>
      <SkeletonText variant="xs">
        Curate your own lists of the works you love and signal
      </SkeletonText>
      <SkeletonText variant="xs" mt={0.5}>
        your interest to galleries
      </SkeletonText>

      <SkeletonBox my={2} height={30} width="45%" />
    </Skeleton>
  )
}
