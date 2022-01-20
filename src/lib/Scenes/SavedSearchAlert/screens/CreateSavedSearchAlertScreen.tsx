import { StackScreenProps } from "@react-navigation/stack"
import { getUnitedSelectedAndAppliedFilters } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { getSearchCriteriaFromFilters } from "lib/Components/ArtworkFilter/SavedSearch/searchCriteriaHelpers"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { Box } from "palette"
import React from "react"
import { CreateSavedSearchContentContainerV1 } from "../containers/CreateSavedSearchContentContainerV1"
import { CreateSavedSearchAlertContentQueryRenderer } from "../containers/CreateSavedSearchContentContainerV2"
import { CreateSavedSearchAlertNavigationStack } from "../SavedSearchAlertModel"
import { SavedSearchStoreProvider } from "../SavedSearchStore"

type Props = StackScreenProps<CreateSavedSearchAlertNavigationStack, "CreateSavedSearchAlert">

export const CreateSavedSearchAlertScreen: React.FC<Props> = (props) => {
  const { route, navigation } = props
  const { me, filters, aggregations, ...other } = route.params
  const isEnabledImprovedAlertsFlow = useFeatureFlag("AREnableImprovedAlertsFlow")

  if (isEnabledImprovedAlertsFlow) {
    const filterState = ArtworksFiltersStore.useStoreState((state) => state)
    const unitedFilters = getUnitedSelectedAndAppliedFilters(filterState)
    const attributes = getSearchCriteriaFromFilters(route.params.artistId, unitedFilters)

    return (
      <SavedSearchStoreProvider initialData={{ attributes, aggregations: filterState.aggregations }}>
        <Box flex={1}>
          <CreateSavedSearchAlertContentQueryRenderer
            navigation={navigation}
            artistId={route.params.artistId}
            artistName={route.params.artistName}
            onClosePress={route.params.onClosePress}
            onComplete={route.params.onComplete}
          />
        </Box>
      </SavedSearchStoreProvider>
    )
  }

  const attributesFromFilters = getSearchCriteriaFromFilters(route.params.artistId, filters!)

  return (
    <SavedSearchStoreProvider initialData={{ attributes: attributesFromFilters, aggregations }}>
      <Box flex={1}>
        <CreateSavedSearchContentContainerV1 navigation={navigation} me={me} {...other} />
      </Box>
    </SavedSearchStoreProvider>
  )
}
