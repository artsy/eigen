import { ActionType, ContextModule, OwnerType, SelectedRecentPriceRange } from "@artsy/cohesion"
import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "app/Components/ArtworkFilter"
import {
  FilterData,
  FilterDisplayName,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworksFiltersStore,
  useSelectedOptionsDisplay,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { ArtworkFilterBackHeader } from "app/Components/ArtworkFilter/components/ArtworkFilterBackHeader"
import { PriceRangeContainer } from "app/Components/PriceRange/PriceRangeContainer"
import { DEFAULT_PRICE_RANGE } from "app/Components/PriceRange/constants"
import { getBarsFromAggregations } from "app/Components/PriceRange/utils"
import { debounce } from "lodash"
import { useMemo, useRef, useState } from "react"
import { ScrollView } from "react-native"
import { useTracking } from "react-tracking"
import { parsePriceRangeLabel, PriceRange } from "./helpers"

type PriceRangeOptionsScreenProps = StackScreenProps<
  ArtworkFilterNavigationStack,
  "PriceRangeOptionsScreen"
>

const PARAM_NAME = FilterParamName.priceRange
const DEBOUNCE_DELAY = 200

export const PriceRangeOptionsScreen: React.FC<PriceRangeOptionsScreenProps> = ({ navigation }) => {
  const screenScrollViewRef = useRef<ScrollView>(null)

  const tracking = useTracking()
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.selectFiltersAction
  )

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedFilterOption = selectedOptions.find(
    (option) => option.paramName === PARAM_NAME
  ) as FilterData

  const [filterPriceRange, setFilterPriceRange] = useState(
    selectedFilterOption.paramValue as string
  )
  const filterHeaderText = FilterDisplayName.priceRange
  const selectFiltersActionDebounced = useMemo(
    () => debounce(selectFiltersAction, DEBOUNCE_DELAY),
    []
  )

  const handleClear = () => {
    setFilterPriceRange(DEFAULT_PRICE_RANGE)
    // unset the price range filter in the store
    selectFiltersAction({
      displayText: filterHeaderText,
      paramValue: DEFAULT_PRICE_RANGE,
      paramName: PARAM_NAME,
    })
  }

  const handleMultiSliderValuesChangeStart = () => {
    if (screenScrollViewRef.current) {
      screenScrollViewRef.current.setNativeProps({ scrollEnabled: false })
    }
  }

  const handleMultiSliderValuesChangeFinish = () => {
    if (screenScrollViewRef.current) {
      screenScrollViewRef.current.setNativeProps({ scrollEnabled: true })
    }
  }

  const isActive = selectedFilterOption.paramValue !== DEFAULT_PRICE_RANGE

  const handleUpdateRange = (updatedRange: PriceRange) => {
    const [min, max] = updatedRange

    setFilterPriceRange(updatedRange.join("-"))
    selectFiltersActionDebounced({
      displayText: parsePriceRangeLabel(min, max),
      paramValue: updatedRange.join("-"),
      paramName: PARAM_NAME,
    })
  }

  const handleRecentPriceRangeSelected = (isCollectorProfileSources: boolean) => {
    tracking.trackEvent(tracks.selectedRecentPriceRange(isCollectorProfileSources))
  }

  const aggregations = ArtworksFiltersStore.useStoreState((state) => state.aggregations)
  const histogramBars = getBarsFromAggregations(aggregations)

  return (
    <Flex flex={1}>
      <ArtworkFilterBackHeader
        title={filterHeaderText}
        onLeftButtonPress={navigation.goBack}
        {...(isActive ? { rightButtonText: "Clear", onRightButtonPress: handleClear } : {})}
      />
      <ScrollView ref={screenScrollViewRef} keyboardShouldPersistTaps="handled">
        <PriceRangeContainer
          filterPriceRange={filterPriceRange}
          histogramBars={histogramBars}
          header={<Text variant="sm-display">Choose Your Price Range</Text>}
          onPriceRangeUpdate={handleUpdateRange}
          onRecentPriceRangeSelected={handleRecentPriceRangeSelected}
          onMultiSliderValuesChangeStart={handleMultiSliderValuesChangeStart}
          onMultiSliderValuesChangeFinish={handleMultiSliderValuesChangeFinish}
        />
      </ScrollView>
      <Spacer y={2} />
    </Flex>
  )
}

const tracks = {
  selectedRecentPriceRange: (isCollectorProfileSources: boolean): SelectedRecentPriceRange => ({
    action: ActionType.selectedRecentPriceRange,
    context_module: ContextModule.recentPriceRanges,
    context_screen_owner_type: OwnerType.artworkPriceFilter,
    collector_profile_sourced: isCollectorProfileSources,
  }),
}
