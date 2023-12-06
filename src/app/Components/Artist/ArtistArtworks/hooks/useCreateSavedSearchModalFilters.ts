import { ScreenOwnerType } from "@artsy/cohesion"
import { getUnitedSelectedAndAppliedFilters } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { getSearchCriteriaFromFilters } from "app/Components/ArtworkFilter/SavedSearch/searchCriteriaHelpers"
import { SavedSearchEntity } from "app/Components/ArtworkFilter/SavedSearch/types"

// A hook that returns the required props to be injected in order to use the CreateSavedSearchModal
export const useCreateSavedSearchModalFilters = ({
  entityId,
  entitySlug,
  entityName,
  entityOwnerType,
}: {
  entityId: string
  entitySlug: string
  entityName: string
  entityOwnerType: ScreenOwnerType
}) => {
  const savedSearchEntity: SavedSearchEntity = {
    artists: [{ id: entityId, name: entityName }],
    owner: {
      type: entityOwnerType,
      id: entityId,
      slug: entitySlug,
    },
  }

  const filterState = ArtworksFiltersStore.useStoreState((state) => state)
  const unitedFilters = getUnitedSelectedAndAppliedFilters(filterState)
  const attributes = getSearchCriteriaFromFilters(savedSearchEntity, unitedFilters)

  return {
    attributes,
    savedSearchEntity,
    sizeMetric: filterState.sizeMetric,
  }
}
