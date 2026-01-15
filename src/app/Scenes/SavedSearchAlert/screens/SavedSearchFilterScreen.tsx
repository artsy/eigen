import { OwnerType } from "@artsy/cohesion"
import {
  Button,
  Flex,
  Spacer,
  Text,
  Touchable,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
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
import { KeyboardAwareForm } from "app/utils/keyboard/KeyboardAwareForm"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { MotiView } from "moti"
import { useCallback, useState } from "react"
import { Alert, LayoutChangeEvent, Platform } from "react-native"
import { KeyboardStickyView } from "react-native-keyboard-controller"

export const SavedSearchFilterScreen: React.FC<{}> = () => {
  const navigation = useNavigation()
  const space = useSpace()
  const { bottom } = useScreenDimensions().safeAreaInsets
  const [bottomOffset, setBottomOffset] = useState(0)

  const stickyOffset = Platform.select({ android: bottom, ios: bottom - space(2) })

  const handleOnLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setBottomOffset(event.nativeEvent.layout.height + bottom)
    },
    [setBottomOffset, bottom]
  )

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
      <KeyboardAwareForm bottomOffset={bottomOffset}>
        <SavedSearchFilterAppliedFilters />
        <SavedSearchFilterAdditionalGeneIDs />
        <SavedSearchFilterRarity />
        <SavedSearchFilterPriceRangeQR />
        <SavedSearchFilterArtistSeriesQR />
        <SavedSearchFilterSize />
        <SavedSearchFilterWaysToBuy />
        <SavedSearchFilterColor />
        <Spacer y={2} />
      </KeyboardAwareForm>

      <KeyboardStickyView onLayout={handleOnLayout} offset={{ opened: stickyOffset }}>
        <Flex
          p={2}
          pb={`${bottom}px`}
          borderTopWidth={1}
          borderTopColor="mono10"
          backgroundColor="mono0"
        >
          <Button block onPress={navigation.goBack} haptic>
            Set Filters
          </Button>
        </Flex>
      </KeyboardStickyView>
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
