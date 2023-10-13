import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { SavedSearchFilterPill } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterPill"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { isValueSelected, useSearchCriteriaAttributes } from "app/Scenes/SavedSearchAlert/helpers"
import { useState } from "react"
import { LayoutAnimation, TouchableOpacity } from "react-native"

export const SavedSearchFilterAdditionalGeneIDs = () => {
  const [showAll, setShowAll] = useState(false)

  const selectedAttributes = useSearchCriteriaAttributes(
    SearchCriteria.additionalGeneIDs
  ) as string[]

  const setValueToAttributesByKeyAction = SavedSearchStore.useStoreActions(
    (actions) => actions.setValueToAttributesByKeyAction
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
      setValueToAttributesByKeyAction({
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
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            setShowAll(!showAll)
          }}
        >
          <Flex height={50} justifyContent="center">
            <Text variant="xs" color="blue100">
              Show {showAll ? "less" : "more"}
            </Text>
          </Flex>
        </TouchableOpacity>
      </Flex>
    </Flex>
  )
}

export const gravityArtworkMediumCategories = [
  { label: "Print", value: "Print" },
  { label: "Photography", value: "Photography" },
  {
    label: "Work on Paper",
    value: "Work on Paper",
  },
  { label: "Ephemera or Merchandise", value: "Ephemera or Merchandise" },
  { label: "Painting", value: "Painting" },
  { label: "Drawing", value: "Drawing" },
  { label: "Sculpture", value: "Sculpture" },
  { label: "Mixed Media", value: "Mixed Media" },
  { label: "Performance Art", value: "Performance Art" },
  { label: "Installation", value: "Installation" },
  { label: "Video/Film/Animation", value: "Video/Film/Animation" },
  { label: "Architecture", value: "Architecture" },
  { label: "Fashion Design and Wearable Art", value: "Fashion Design and Wearable Art" },
  { label: "Jewelry", value: "Jewelry" },
  { label: "Design/Decorative Art", value: "Design/Decorative Art" },
  { label: "Textile Arts", value: "Textile Arts" },
  { label: "Posters", value: "Posters" },
  { label: "Books and Portfolios", value: "Books and Portfolios" },
  { label: "Reproduction", value: "Reproduction" },
  { label: "NFT", value: "NFT" },
  { label: "Other", value: "Other" },
]
