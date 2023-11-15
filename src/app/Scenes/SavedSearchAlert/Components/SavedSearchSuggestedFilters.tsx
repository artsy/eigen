import { ChevronIcon, Flex, Text, Touchable } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import {
  SavedSearchSuggestedFiltersFetchQuery,
  SavedSearchSuggestedFiltersFetchQuery$data,
} from "__generated__/SavedSearchSuggestedFiltersFetchQuery.graphql"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { SavedSearchFilterPill } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterPill"
import { CreateSavedSearchAlertNavigationStack } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import {
  handlePressForArrayValues,
  handlePressForStringValues,
  isValueSelected,
} from "app/Scenes/SavedSearchAlert/helpers"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { useEffect, useState } from "react"
import { fetchQuery, graphql } from "react-relay"

type SuggestedFilterT = NonNullable<
  NonNullable<SavedSearchSuggestedFiltersFetchQuery$data>["previewSavedSearch"]
>["suggestedFilters"][0]

const SUPPORTED_SEARCH_CRITERIA = [
  SearchCriteria.additionalGeneIDs,
  SearchCriteria.attributionClass,
  SearchCriteria.priceRange,
]

export const SavedSearchSuggestedFilters: React.FC<{}> = () => {
  const navigation =
    useNavigation<NavigationProp<CreateSavedSearchAlertNavigationStack, "CreateSavedSearchAlert">>()

  const attributes = SavedSearchStore.useStoreState((state) => state.attributes)
  const [suggestedFilters, setSuggestedFilters] = useState<SuggestedFilterT[]>([])

  const addValueToAttributesByKeyAction = SavedSearchStore.useStoreActions(
    (actions) => actions.addValueToAttributesByKeyAction
  )
  const removeValueFromAttributesByKeyAction = SavedSearchStore.useStoreActions(
    (actions) => actions.removeValueFromAttributesByKeyAction
  )

  // Get list of suggested filters
  useEffect(() => {
    getSuggestedFilters()
  }, [attributes])

  const getSuggestedFilters = async () => {
    const response = await fetchQuery<SavedSearchSuggestedFiltersFetchQuery>(
      getRelayEnvironment(),
      savedSearchSuggestedFiltersFetchQuery,
      {
        attributes,
      }
    ).toPromise()

    if (response?.previewSavedSearch?.suggestedFilters) {
      setSuggestedFilters(
        response.previewSavedSearch.suggestedFilters.filter((filter) => {
          // Adding this check to make sure we don't add a filter type that's not
          // supported in the app
          return SUPPORTED_SEARCH_CRITERIA.indexOf(filter.field as SearchCriteria) > -1
        })
      )
    }
  }

  const handlePress = (field: SearchCriteria, value: string) => {
    switch (field) {
      // These are all array values
      case SearchCriteria.attributionClass:
      case SearchCriteria.additionalGeneIDs:
        handlePressForArrayValues({
          selectedAttributes: attributes[field] || [],
          value: value,
          addValueToAttributesByKeyAction,
          removeValueFromAttributesByKeyAction,
          criterion: field,
        })
        break

      // These are all string values
      case SearchCriteria.priceRange:
        handlePressForStringValues({
          selectedAttributes: attributes[field] || [],
          value: value,
          addValueToAttributesByKeyAction,
          removeValueFromAttributesByKeyAction,
          criterion: field,
        })

        break

      default:
        break
    }
  }

  return (
    <Flex flexDirection="row" flexWrap="wrap" mt={1} mx={-0.5}>
      {suggestedFilters.map((pill) => (
        <SavedSearchFilterPill
          key={pill.name + pill.value}
          m={0.5}
          accessibilityLabel={"Select " + pill.displayValue + " as a " + pill.name}
          selected={isValueSelected({
            selectedAttributes: attributes[pill.field as SearchCriteria] || [],
            value: pill.value,
          })}
          onPress={() => {
            handlePress(pill.field as SearchCriteria, pill.value)
          }}
        >
          {pill.displayValue}
        </SavedSearchFilterPill>
      ))}

      <Touchable
        onPress={() => {
          navigation.navigate("SavedSearchFilterScreen")
        }}
      >
        <Flex px={1} flexDirection="row" alignItems="center">
          <Text color="blue" variant="xs">
            More Filters
          </Text>
          <ChevronIcon
            height={14}
            width={14}
            direction="right"
            fill="blue100"
            ml={0.5}
            // More filters has no characters that extend below the baseline,
            // adding one pixel here for more visually appealing vertical centering that matches the design
            top="1px"
          />
        </Flex>
      </Touchable>
    </Flex>
  )
}

const savedSearchSuggestedFiltersFetchQuery = graphql`
  query SavedSearchSuggestedFiltersFetchQuery($attributes: PreviewSavedSearchAttributes!) {
    previewSavedSearch(attributes: $attributes) {
      suggestedFilters {
        displayValue
        field
        name
        value
      }
    }
  }
`
