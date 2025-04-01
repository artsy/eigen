import { ActionType } from "@artsy/cohesion"
import { Flex, AddIcon, TagIcon, Touchable, Text, Spacer, Join } from "@artsy/palette-mobile"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ProgressiveOnboardingOfferSettings } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingOfferSettings"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { ScrollView } from "react-native"
import { useTracking } from "react-tracking"

export const SavesHeader = () => {
  const isArtworkListOfferabilityEnabled = useFeatureFlag("AREnableArtworkListOfferability")
  const { dispatch } = useArtworkListsContext()
  const { trackEvent } = useTracking()

  const handleOfferSettings = () => {
    dispatch({
      type: "SET_OFFER_SETTINGS_VIEW_VISIBLE",
      payload: true,
    })

    trackEvent({
      action: ActionType.tappedOfferSettings,
    })
  }

  const handleCreateList = () => {
    dispatch({
      type: "SET_CREATE_NEW_ARTWORK_LIST_VIEW_VISIBLE",
      payload: true,
    })

    trackEvent({
      action: ActionType.tappedNewArtworkList,
    })
  }

  return (
    <ScrollView>
      <Flex flex={1}>
        <Flex flexDirection="row" justifyContent="space-between" alignItems="center" mb={2}>
          <TouchableElement onPress={handleCreateList}>
            <AddIcon />
            <Text variant="xs">New List</Text>
          </TouchableElement>

          {!!isArtworkListOfferabilityEnabled && (
            <ProgressiveOnboardingOfferSettings>
              <TouchableElement onPress={handleOfferSettings}>
                <TagIcon />
                <Text variant="xs">Offer Settings</Text>
              </TouchableElement>
            </ProgressiveOnboardingOfferSettings>
          )}
        </Flex>
      </Flex>
    </ScrollView>
  )
}

interface TouchableElementProps {
  onPress: () => void
}

const TouchableElement: React.FC<TouchableElementProps> = ({ onPress, children }) => {
  return (
    <Touchable onPress={onPress}>
      <Flex flexDirection="row" alignItems="center">
        <Join separator={<Spacer x={0.5} />}>{children}</Join>
      </Flex>
    </Touchable>
  )
}
