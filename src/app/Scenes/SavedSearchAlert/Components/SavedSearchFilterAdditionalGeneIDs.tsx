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

// List from gravity
export const gravityArtworkMediumCategories: { label: string; value: string }[] = [
  {
    label: "Architecture",
    value: "architecture-1",
  },
  {
    label: "Books and Portfolios",
    value: "books-and-portfolios",
  },
  {
    label: "Design",
    value: "design",
  },
  {
    label: "Work on Paper",
    value: "work-on-paper",
  },
  {
    label: "Ephemera or Merchandise",
    value: "ephemera-or-merchandise",
  },
  {
    label: "Fashion Design and Wearable Art",
    value: "fashion-design-and-wearable-art",
  },
  {
    label: "Installation",
    value: "installation",
  },
  {
    label: "Jewelry",
    value: "jewelry",
  },
  {
    label: "Mixed-Media",
    value: "mixed-media",
  },
  {
    label: "NFT",
    value: "nft",
  },
  {
    label: "Other",
    value: "other",
  },
  {
    label: "Painting",
    value: "painting",
  },
  {
    label: "Performance Art",
    value: "performance-art",
  },
  {
    label: "Photography",
    value: "photography",
  },
  {
    label: "Poster",
    value: "poster",
  },
  {
    label: "Prints",
    value: "prints",
  },
  {
    label: "Reproduction",
    value: "reproduction",
  },
  {
    label: "Sculpture",
    value: "sculpture",
  },
  {
    label: "Textile Arts",
    value: "textile-arts",
  },
  {
    label: "Film/Video",
    value: "film-slash-video",
  },
]
