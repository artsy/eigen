import { Flex, Join, Separator, Text, Touchable } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { NewArtworkFilterRarity as Rarity } from "app/Components/NewArtworkFilter/NewArtworkFilterRarity"
import { NewArtworkFiltersStoreProvider } from "app/Components/NewArtworkFilter/NewArtworkFilterStore"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { AddFiltersScreenAppliedFilters } from "app/Scenes/SavedSearchAlert/screens/AddFiltersScreenAppliedFilters"
import { MotiView } from "moti"
import { Alert } from "react-native"

export const AddFiltersScreen: React.FC<{}> = () => {
  const navigation = useNavigation()

  return (
    <Flex>
      <FancyModalHeader
        hideBottomDivider
        onLeftButtonPress={navigation.goBack}
        renderRightButton={ClearAllButton}
        // TODO: Improve fancy modal header logic not to rely on this prop
        // in case renderRightButton is present
        onRightButtonPress={() => {}}
      >
        Filters
      </FancyModalHeader>
      <Join separator={<Separator my={2} borderColor="black10" />}>
        <AddFiltersScreenAppliedFilters />
        <Rarity />
      </Join>
    </Flex>
  )
}

export const AddFiltersScreenWrapper: React.FC<{}> = () => {
  return (
    <NewArtworkFiltersStoreProvider>
      <AddFiltersScreen />
    </NewArtworkFiltersStoreProvider>
  )
}

export const ClearAllButton = () => {
  const clearAllFiltersAction = SavedSearchStore.useStoreActions(
    (state) => state.clearAllAttributesAction
  )
  const attributes = SavedSearchStore.useStoreState((state) => state.attributes)
  const disabled = Object.keys(attributes).length === 0

  return (
    <Touchable
      haptic={disabled ? undefined : "impactMedium"}
      disabled={disabled}
      accessibilityState={{ disabled }}
      onPress={() => {
        Alert.alert("Are you sure you want to clear all filters?", undefined, [
          {
            text: "Cancel",
            style: "cancel",
          },

          {
            text: "Clear All",
            onPress() {
              // Trigger action to clear all filters
              clearAllFiltersAction()
            },
            style: "destructive",
          },
        ])
      }}
    >
      <MotiView
        accessibilityLabel="Image Pagination Indicator"
        animate={{ opacity: disabled ? 0.3 : 1 }}
        transition={{ type: "timing", duration: 200 }}
      >
        <Text underline color="black100">
          Clear All
        </Text>
      </MotiView>
    </Touchable>
  )
}
