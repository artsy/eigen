import { Join, Separator, Text, Touchable } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { SavedSearchAppliedFilters } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterAppliedFilters"
import { SavedSearchFilterColour } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterColour"
import { SavedSearchFilterPriceRangeQR } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterPriceRange"
import { SavedSearchRarity } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterRarity"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { MotiView } from "moti"
import { Alert, ScrollView } from "react-native"

export const SavedSearchFilterScreen: React.FC<{}> = () => {
  const navigation = useNavigation()

  return (
    <ScrollView>
      <FancyModalHeader
        hideBottomDivider
        onLeftButtonPress={navigation.goBack}
        renderRightButton={ClearAllButton}
        onRightButtonPress={() => {}}
      >
        Filters
      </FancyModalHeader>
      <Join separator={<Separator my={2} borderColor="black10" />}>
        <SavedSearchAppliedFilters />
        <SavedSearchFilterPriceRangeQR />
        <SavedSearchRarity />
        <SavedSearchFilterColour />
      </Join>
    </ScrollView>
  )
}

export const ClearAllButton = () => {
  const clearAllFiltersAction = SavedSearchStore.useStoreActions(
    (state) => state.clearAllAttributesAction
  )
  const attributes = SavedSearchStore.useStoreState((state) => state.attributes)
  const disabled =
    Object.entries(attributes).filter((keyValue) => {
      const key = keyValue[0]
      const value = keyValue[1]
      if (key === SearchCriteria.priceRange) {
        return value && value !== "*-*"
      }

      if (key !== SearchCriteria.artistID && key !== SearchCriteria.artistIDs) {
        // Values might be empty arrays
        if (Array.isArray(value)) {
          return value.length > 0
        }
        return true
      }
    }).length === 0

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
