import { Flex, Separator, Spacer, Text } from "@artsy/palette-mobile"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { SavedSearchFilterPill } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterPill"
import {
  isValueSelected,
  useSavedSearchFilter,
  useSearchCriteriaAttributes,
} from "app/Scenes/SavedSearchAlert/helpers"
import { AnimateHeight } from "app/utils/animations/AnimateHeight"
import { gravityArtworkMediumCategories } from "app/utils/artworkMediumCategories"
import { useState } from "react"
import { TouchableOpacity } from "react-native"

export const SavedSearchFilterAdditionalGeneIDs = () => {
  const selectedAttributes = useSearchCriteriaAttributes(
    SearchCriteria.additionalGeneIDs
  ) as string[]

  const { handlePress } = useSavedSearchFilter({ criterion: SearchCriteria.additionalGeneIDs })

  // If the user has selected any values, show all the options on initial render
  const [showAll, setShowAll] = useState(!!selectedAttributes?.length)

  return (
    <Flex px={2}>
      <Separator my={2} borderColor="mono10" />
      <Text variant="sm" fontWeight="bold">
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
                  handlePress(option.value)
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
                        handlePress(option.value)
                      }}
                    >
                      {option.label}
                    </SavedSearchFilterPill>
                  )
                })
            : null}

          <TouchableOpacity
            accessibilityRole="button"
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
