import { Flex, RadioButton, Separator, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import { CustomSizeInputs } from "app/Components/ArtworkFilter/Filters/CustomSizeInputs"
import {
  UNIT_METRICS,
  getSizeOptions,
} from "app/Components/ArtworkFilter/Filters/SizesOptionsScreen"
import { Range, parseRange, round } from "app/Components/ArtworkFilter/Filters/helpers"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { SavedSearchFilterPill } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterPill"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { useSearchCriteriaAttributes } from "app/Scenes/SavedSearchAlert/helpers"
import { useState } from "react"

export const SavedSearchFilterSize = () => {
  const selectedAttributes = useSearchCriteriaAttributes(SearchCriteria.sizes) as string[]

  const customHeight = useSearchCriteriaAttributes(SearchCriteria.height)

  const customWidth = useSearchCriteriaAttributes(SearchCriteria.width)

  const [hasSelectedCustomInputValues, setHasSelectedCustomInput] = useState(
    (customHeight || customWidth) !== undefined
  )

  const addValueToAttributesByKeyAction = SavedSearchStore.useStoreActions(
    (actions) => actions.addValueToAttributesByKeyAction
  )
  const removeValueFromAttributesByKeyAction = SavedSearchStore.useStoreActions(
    (actions) => actions.removeValueFromAttributesByKeyAction
  )
  const setAttributeAction = SavedSearchStore.useStoreActions(
    (actions) => actions.setAttributeAction
  )

  const setUnitAction = SavedSearchStore.useStoreActions((actions) => actions.setUnitAction)
  const unit = SavedSearchStore.useStoreState((state) => state.unit)

  const options = getSizeOptions(unit)

  const handlePressDefinedSizePill = (value: string) => {
    const isSizeSelected = !!selectedAttributes?.includes(value)

    // If the user presesses on unselected option
    if (!isSizeSelected) {
      // if we have custom input values, we need to remove them
      if (hasSelectedCustomInputValues) {
        setHasSelectedCustomInput(false)

        queueMicrotask(() => {
          removeValueFromAttributesByKeyAction({
            key: SearchCriteria.height,
            value: "*-*",
          })
          removeValueFromAttributesByKeyAction({
            key: SearchCriteria.width,
            value: "*-*",
          })
        })
      }

      const newValues = (selectedAttributes || []).concat(value)
      queueMicrotask(() => {
        addValueToAttributesByKeyAction({
          key: SearchCriteria.sizes,
          value: newValues,
        })
      })
    }
    // If  the user presesses on an already selected option
    else {
      // Remove the defined size from the selected attributes
      removeValueFromAttributesByKeyAction({
        key: SearchCriteria.sizes,
        value: value,
      })
    }
  }

  const handleCustomInputChange = (paramName: SearchCriteria) => (range: Range) => {
    setAttributeAction({
      key: paramName,
      value: `${range.min}-${range.max}`,
    })
  }

  return (
    <Flex px={2}>
      <Separator my={2} borderColor="mono10" />
      <Text variant="sm" fontWeight={500}>
        Size
      </Text>

      <Spacer y={1} />

      <Flex flexDirection="row">
        {UNIT_METRICS.map((currentMetric) => {
          const isSelected = unit === currentMetric
          return (
            <Touchable
              accessibilityRole="radio"
              onPress={() => {
                setUnitAction(currentMetric)
              }}
              key={currentMetric}
            >
              <Flex flexDirection="row">
                <RadioButton
                  accessibilityState={{ checked: isSelected }}
                  accessibilityLabel={currentMetric}
                  selected={isSelected}
                  onPress={() => setUnitAction(currentMetric)}
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
                handlePressDefinedSizePill(option.paramValue as string)
              }}
            >
              {option.displayText}
            </SavedSearchFilterPill>
          )
        })}
        <SavedSearchFilterPill
          key="custom-size"
          accessibilityLabel="Custom Size"
          selected={hasSelectedCustomInputValues}
          onPress={() => {
            if (!hasSelectedCustomInputValues) {
              // Unselect all other options
              options.forEach((option) => {
                queueMicrotask(() => {
                  removeValueFromAttributesByKeyAction({
                    key: SearchCriteria.sizes,
                    value: option.paramValue as string,
                  })
                })
              })
            } else {
              queueMicrotask(() => {
                removeValueFromAttributesByKeyAction({
                  key: SearchCriteria.height,
                  value: "*-*",
                })
                removeValueFromAttributesByKeyAction({
                  key: SearchCriteria.width,
                  value: "*-*",
                })
              })
            }
            setHasSelectedCustomInput(!hasSelectedCustomInputValues)
          }}
        >
          Custom Size
        </SavedSearchFilterPill>
      </Flex>

      {!!hasSelectedCustomInputValues && (
        <Flex mt={1}>
          <CustomSizeInputs
            label="Width"
            range={{
              min: round(parseRange(String(customWidth)).min),
              max: round(parseRange(String(customWidth)).max),
            }}
            active
            onChange={handleCustomInputChange(SearchCriteria.width)}
            selectedMetric={unit}
          />
          <Spacer y={2} />
          <CustomSizeInputs
            label="Height"
            range={{
              min: round(parseRange(String(customHeight)).min),
              max: round(parseRange(String(customHeight)).max),
            }}
            active
            onChange={handleCustomInputChange(SearchCriteria.height)}
            selectedMetric={unit}
          />
        </Flex>
      )}
    </Flex>
  )
}
