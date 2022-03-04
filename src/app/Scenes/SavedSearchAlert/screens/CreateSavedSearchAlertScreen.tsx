import { StackScreenProps } from "@react-navigation/stack"
import { getUnitedSelectedAndAppliedFilters } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { getSearchCriteriaFromFilters } from "app/Components/ArtworkFilter/SavedSearch/searchCriteriaHelpers"
import { Box } from "palette"
import React from "react"
import { CreateSavedSearchAlertContentQueryRenderer } from "../containers/CreateSavedSearchContentContainerV2"
import { CreateSavedSearchAlertNavigationStack } from "../SavedSearchAlertModel"
import { SavedSearchStoreProvider } from "../SavedSearchStore"

type Props = StackScreenProps<CreateSavedSearchAlertNavigationStack, "CreateSavedSearchAlert">

export const CreateSavedSearchAlertScreen: React.FC<Props> = (props) => {
  const { route, navigation } = props
  const { artistId, artistName, onClosePress, onComplete } = route.params
  const filterState = ArtworksFiltersStore.useStoreState((state) => state)
  const unitedFilters = getUnitedSelectedAndAppliedFilters(filterState)
  const attributes = getSearchCriteriaFromFilters(artistId, unitedFilters)

  return (
    <SavedSearchStoreProvider initialData={{ attributes, aggregations: filterState.aggregations }}>
      <Box flex={1}>
        <CreateSavedSearchAlertContentQueryRenderer
          navigation={navigation}
          artistId={artistId}
          artistName={artistName}
          onClosePress={onClosePress}
          onComplete={onComplete}
        />
      </Box>
    </SavedSearchStoreProvider>
  )
}
