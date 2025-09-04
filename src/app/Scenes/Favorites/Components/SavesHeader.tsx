import { AddIcon, TagIcon } from "@artsy/icons/native"
import { Flex, Touchable, Text, Spacer, Join } from "@artsy/palette-mobile"
import { ArtworkListsStore } from "app/Components/ArtworkLists/ArtworkListsStore"
import { ProgressiveOnboardingOfferSettings } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingOfferSettings"
import { useFavoritesTracking } from "app/Scenes/Favorites/useFavoritesTracking"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { ScrollView } from "react-native"

export const SavesHeader = () => {
  const isArtworkListOfferabilityEnabled = useFeatureFlag("AREnableArtworkListOfferability")
  const { setOfferSettingsViewVisible, setCreateNewArtworkListViewVisible } =
    ArtworkListsStore.useStoreActions((actions) => ({
      setOfferSettingsViewVisible: actions.setOfferSettingsViewVisible,
      setCreateNewArtworkListViewVisible: actions.setCreateNewArtworkListViewVisible,
    }))

  const { trackTappedOfferSettings, trackTappedNewArtworkList } = useFavoritesTracking()

  const handleOfferSettings = () => {
    setOfferSettingsViewVisible(true)
    trackTappedOfferSettings()
  }

  const handleCreateList = () => {
    setCreateNewArtworkListViewVisible(true)
    trackTappedNewArtworkList()
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

const TouchableElement: React.FC<React.PropsWithChildren<TouchableElementProps>> = ({
  onPress,
  children,
}) => {
  return (
    <Touchable accessibilityRole="button" onPress={onPress}>
      <Flex flexDirection="row" alignItems="center">
        <Join separator={<Spacer x={0.5} />}>{children}</Join>
      </Flex>
    </Touchable>
  )
}
