import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { SavedSearchFilterPill } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterPill"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { isValueSelected, useSearchCriteriaAttributes } from "app/Scenes/SavedSearchAlert/helpers"
import { AnimateHeight } from "app/utils/animations/AnimateHeight"
import { gravityArtworkMediumCategories } from "app/utils/artworkMediumCategories"
import { useState } from "react"
import { TouchableOpacity } from "react-native"

export const SavedSearchFilterAdditionalGeneIDs = () => {
  const selectedAttributes = useSearchCriteriaAttributes(
    SearchCriteria.additionalGeneIDs
  ) as string[]

  // If the user has selected any values, show all the options on initial render
  const [showAll, setShowAll] = useState(!!selectedAttributes?.length)

  const addValueToAttributesByKeyAction = SavedSearchStore.useStoreActions(
    (actions) => actions.addValueToAttributesByKeyAction
  )
  const removeValueFromAttributesByKeyAction = SavedSearchStore.useStoreActions(
    (actions) => actions.removeValueFromAttributesByKeyAction
  )

  const handlePress = (value: string) => {
    const isSelected = isValueSelected({
      selectedAttributes,
      value: value,
    })

    if (isSelected) {
      removeValueFromAttributesByKeyAction({
        key: SearchCriteria.additionalGeneIDs,
        value: value,
      })
    } else {
      const newValues = (selectedAttributes || []).concat(value)
      addValueToAttributesByKeyAction({
        key: SearchCriteria.additionalGeneIDs,
        value: newValues,
      })
    }
  }

  return (
    <Flex px={2}>
      <Text variant="sm" fontWeight={500}>
        Medium
      </Text>
      <Spacer y={1} />
      <AnimateHeight>
        <Flex flexDirection="row" flexWrap="wrap">
          {gravityArtworkMediumCategories.slice(0, 7).map((option) => {
            return (
              <SavedSearchFilterPill
                key={option.value as string}
                accessibilityLabel={option.label}
                selected={isValueSelected({
                  selectedAttributes,
                  value: option.value,
                })}
                onPress={() => {
                  handlePress(option.value as string)
                }}
              >
                {option.label}
              </SavedSearchFilterPill>
            )
          })}

          {showAll
            ? gravityArtworkMediumCategories
                .slice(7, gravityArtworkMediumCategories.length)
                .map((option) => {
                  return (
                    <SavedSearchFilterPill
                      key={option.value as string}
                      accessibilityLabel={option.label}
                      selected={isValueSelected({
                        selectedAttributes,
                        value: option.value,
                      })}
                      onPress={() => {
                        handlePress(option.value as string)
                      }}
                    >
                      {option.label}
                    </SavedSearchFilterPill>
                  )
                })
            : null}

          <TouchableOpacity
            onPress={() => {
              setShowAll(!showAll)
            }}
          >
            <Flex height={50} justifyContent="center" px={1}>
              <Text variant="xs" color="blue100">
                Show {showAll ? "less" : "more"}
              </Text>
            </Flex>
          </TouchableOpacity>
        </Flex>
      </AnimateHeight>
    </Flex>
  )
}
