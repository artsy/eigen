import { Flex, RadioButton, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import {
  UNIT_METRICS,
  getSizeOptions,
} from "app/Components/ArtworkFilter/Filters/SizesOptionsScreen"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { SavedSearchFilterPill } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterPill"
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

  const addValueToAttributesByKeyAction = SavedSearchStore.useStoreActions(
    (actions) => actions.addValueToAttributesByKeyAction
  )
  const removeValueFromAttributesByKeyAction = SavedSearchStore.useStoreActions(
    (actions) => actions.removeValueFromAttributesByKeyAction
  )

  const storeMetric = GlobalStore.useAppState((state) => state.userPrefs.metric)
  const [selectedMetric, setSelectedMetric] = useState(storeMetric || getPreferredMetric())

  const setMetric = GlobalStore.actions.userPrefs.setMetric

  const options = getSizeOptions(selectedMetric)

  useEffect(() => {
    if (storeMetric !== selectedMetric) {
      setMetric(selectedMetric)
    }
  }, [selectedMetric])

  const handlePress = (value: string) => {
    const isSelected = !!selectedAttributes?.includes(value)

    if (isSelected) {
      removeValueFromAttributesByKeyAction({
        key: SearchCriteria.sizes,
        value: value,
      })
    } else {
      const newValues = (selectedAttributes || []).concat(value)
      addValueToAttributesByKeyAction({
        key: SearchCriteria.sizes,
        value: newValues,
      })
    }
  }

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

      <Flex flexDirection="row" flexWrap="wrap">
        {options.map((option) => {
          return (
            <SavedSearchFilterPill
              key={option.paramValue as string}
              accessibilityLabel={option.displayText}
              selected={!!selectedAttributes?.includes(option.paramValue as string)}
              onPress={() => {
                handlePress(option.paramValue as string)
              }}
            >
              {option.displayText}
            </SavedSearchFilterPill>
          )
        })}
      </Flex>
    </Flex>
  )
}
