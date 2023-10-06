import { Flex, Join, Separator, Text, Touchable } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { NewArtworkFilterAppliedFilters as AppliedFilters } from "app/Components/NewArtworkFilter/NewArtworkFilterAppliedFilters"
import { NewArtworkFilterRarity as Rarity } from "app/Components/NewArtworkFilter/NewArtworkFilterRarity"
import {
  NewArtworkFiltersStoreProvider,
  NewArtworksFiltersStore,
  getNewArtworkFilterStoreModel,
} from "app/Components/NewArtworkFilter/NewArtworkFilterStore"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
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
        // rightButtonText="Clear All"
        // TODO: Improve fancy modal header logic not to rely on this prop
        // in case renderRightButton is present
        onRightButtonPress={() => {}}
      >
        Filters
      </FancyModalHeader>
      <Join separator={<Separator my={2} borderColor="black10" />}>
        <AppliedFilters includeArtistNames />
        <Rarity />
      </Join>
    </Flex>
  )
}

export const AddFiltersScreenWrapper: React.FC<{}> = () => {
  const aggregations = SavedSearchStore.useStoreState((state) => state.aggregations)

  return (
    <NewArtworkFiltersStoreProvider
      runtimeModel={{
        ...getNewArtworkFilterStoreModel(),
        aggregations,
      }}
    >
      <AddFiltersScreen />
    </NewArtworkFiltersStoreProvider>
  )
}

export const ClearAllButton = () => {
  const clearAllFiltersAction = NewArtworksFiltersStore.useStoreActions(
    (state) => state.clearAllFiltersAction
  )
  const disabled =
    NewArtworksFiltersStore.useStoreState((state) => state.selectedFilters).length === 0

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
