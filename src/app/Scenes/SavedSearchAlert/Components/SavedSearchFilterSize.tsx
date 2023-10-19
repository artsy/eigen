import { Flex, RadioButton, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import {
  UNIT_METRICS,
  getSizeOptions,
} from "app/Components/ArtworkFilter/Filters/SizesOptionsScreen"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { useSearchCriteriaAttributes } from "app/Scenes/SavedSearchAlert/helpers"
import { GlobalStore } from "app/store/GlobalStore"
import { useEffect, useState } from "react"
import { getCountry } from "react-native-localize"

// Helper to get the initial metric based on the user's country
const getPreferredMetric = () => {
  const countryCode = getCountry()
  switch (countryCode) {
    case "US":
    case "LR":
    case "MM":
    case "GB":
      return "in"
    default:
      return "cm"
  }
}

export const SavedSearchFilterSize = () => {
  const selectedAttributes = useSearchCriteriaAttributes(SearchCriteria.sizes) as string[]

  const storeMetric = GlobalStore.useAppState((state) => state.userPrefs.metric)
  const [selectedMetric, setSelectedMetric] = useState(storeMetric || getPreferredMetric())

  const setMetric = GlobalStore.actions.userPrefs.setMetric

  const sizeOptions = getSizeOptions(selectedMetric)

  useEffect(() => {
    if (storeMetric !== selectedMetric) {
      setSelectedMetric(selectedMetric)
    }
  }, [selectedMetric])

  return (
    <Flex px={2}>
      <Text variant="sm" fontWeight={500}>
        Size
      </Text>

      <Spacer y={1} />

      <Flex flexDirection="row">
        {UNIT_METRICS.map((currentMetric) => {
          const isSelected = selectedMetric === currentMetric
          return (
            <Touchable
              onPress={() => {
                setSelectedMetric(currentMetric)
              }}
              key={currentMetric}
            >
              <Flex flexDirection="row">
                <RadioButton
                  accessibilityState={{ checked: isSelected }}
                  accessibilityLabel={currentMetric}
                  selected={isSelected}
                  onPress={() => setSelectedMetric(currentMetric)}
                />
                <Text marginRight="4">{currentMetric}</Text>
              </Flex>
            </Touchable>
          )
        })}
      </Flex>
    </Flex>
  )
}
