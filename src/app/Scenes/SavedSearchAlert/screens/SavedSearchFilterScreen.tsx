import { OwnerType } from "@artsy/cohesion"
import { Button, Flex, Spacer, Text, Touchable, useScreenDimensions } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { SavedSearchFilterAdditionalGeneIDs } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterAdditionalGeneIDs"
import { SavedSearchFilterAppliedFilters } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterAppliedFilters"
import { SavedSearchFilterArtistSeriesQR } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterArtistSeries"
import { SavedSearchFilterColor } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterColor"
import { SavedSearchFilterPriceRangeQR } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterPriceRange"
import { SavedSearchFilterRarity } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterRarity"
import { SavedSearchFilterSize } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterSize"
import { SavedSearchFilterWaysToBuy } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterWaysToBuy"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { MotiView } from "moti"
import { Alert, Platform, ScrollView } from "react-native"

export const SavedSearchFilterScreen: React.FC<{}> = () => {
  const navigation = useNavigation()
  const { bottom } = useScreenDimensions().safeAreaInsets

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.alertFilters,
      })}
    >
      <NavigationHeader
        hideBottomDivider
        onLeftButtonPress={navigation.goBack}
        renderRightButton={ClearAllButton}
        onRightButtonPress={() => {}}
      >
        Filters
      </NavigationHeader>
      <ScrollView>
        <SavedSearchFilterAppliedFilters />
        <SavedSearchFilterAdditionalGeneIDs />
        <SavedSearchFilterRarity />
        <SavedSearchFilterPriceRangeQR />
        <SavedSearchFilterArtistSeriesQR />
        <SavedSearchFilterSize />
        <SavedSearchFilterWaysToBuy />
        <SavedSearchFilterColor />
        <Spacer y={2} />
      </ScrollView>

      <Flex p={2} pb={Platform.OS === "android" ? 2 : 0} borderTopWidth={1} borderTopColor="mono10">
        <Button block onPress={navigation.goBack} haptic mb={`${bottom}px`}>
          Set Filters
        </Button>
      </Flex>
    </ProvideScreenTrackingWithCohesionSchema>
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
      accessibilityRole="button"
      haptic={disabled ? undefined : "impactMedium"}
      disabled={disabled}
      accessibilityState={{ disabled }}
      onPress={() => {
        Alert.alert("Clear Filters", "Are you sure you want to clear all filters?", [
          {
            text: "Cancel",
            style: "cancel",
          },

          {
            text: "Clear All",
            onPress() {
              clearAllFiltersAction()
            },
            style: "destructive",
          },
        ])
      }}
    >
      <MotiView
        animate={{ opacity: disabled ? 0.3 : 1 }}
        transition={{ type: "timing", duration: 200 }}
      >
        <Text underline color="mono100">
          Clear All
        </Text>
      </MotiView>
    </Touchable>
  )
}
