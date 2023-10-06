import { OwnerType } from "@artsy/cohesion"
import { fireEvent } from "@testing-library/react-native"
import { SavedSearchEntity } from "app/Components/ArtworkFilter/SavedSearch/types"
import { NewArtworkFilterAppliedFilters } from "app/Components/NewArtworkFilter/NewArtworkFilterAppliedFilters"
import {
  NewArtworkFiltersStoreProvider,
  getNewArtworkFilterStoreModel,
} from "app/Components/NewArtworkFilter/NewArtworkFilterStore"
import { NewFilterParamName } from "app/Components/NewArtworkFilter/helpers"
import {
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("NewArtworkFilterAppliedFilters", () => {
  it("shows all selected filters", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider
        runtimeModel={{
          ...savedSearchModel,
          entity: savedSearchEntity,
        }}
      >
        <NewArtworkFiltersStoreProvider runtimeModel={initialData}>
          <NewArtworkFilterAppliedFilters includeArtistNames />
        </NewArtworkFiltersStoreProvider>
      </SavedSearchStoreProvider>
    )

    expect(getByText("Unique")).toBeDefined()
    expect(getByText("Limited Edition")).toBeDefined()
    expect(getByText("Banksy")).toBeDefined()
  })

  it("doesn't show the artist name when includeArtistNames is not specified", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider
        runtimeModel={{
          ...savedSearchModel,
          entity: savedSearchEntity,
        }}
      >
        <NewArtworkFiltersStoreProvider runtimeModel={initialData}>
          <NewArtworkFilterAppliedFilters />
        </NewArtworkFiltersStoreProvider>
      </SavedSearchStoreProvider>
    )

    expect(() => getByText("Banksy")).toThrow()
  })

  it("removes filter when tapped", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider
        runtimeModel={{
          ...savedSearchModel,
          entity: savedSearchEntity,
        }}
      >
        <NewArtworkFiltersStoreProvider runtimeModel={initialData}>
          <NewArtworkFilterAppliedFilters />
        </NewArtworkFiltersStoreProvider>
      </SavedSearchStoreProvider>
    )

    expect(getByText("Unique")).toBeDefined()

    fireEvent.press(getByText("Unique"), "onPress")

    expect(() => getByText("Unique")).toThrow()
  })

  it("can't remove artist pill", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider
        runtimeModel={{
          ...savedSearchModel,
          entity: savedSearchEntity,
        }}
      >
        <NewArtworkFiltersStoreProvider runtimeModel={initialData}>
          <NewArtworkFilterAppliedFilters includeArtistNames />
        </NewArtworkFiltersStoreProvider>
      </SavedSearchStoreProvider>
    )

    expect(getByText("Banksy")).toBeDefined()

    fireEvent.press(getByText("Unique"), "onPress")

    expect(getByText("Banksy")).toBeDefined()
  })
})

const initialData = {
  ...getNewArtworkFilterStoreModel(),
  selectedFilters: [
    {
      paramName: NewFilterParamName.attributionClass,
      paramValue: {
        value: "unique",
        displayLabel: "Unique",
      },
    },
    {
      paramName: NewFilterParamName.attributionClass,
      paramValue: {
        value: "limited edition",
        displayLabel: "Limited Edition",
      },
    },
  ],
}

const savedSearchEntity: SavedSearchEntity = {
  artists: [{ id: "artistID", name: "Banksy" }],
  owner: {
    type: OwnerType.artist,
    id: "ownerId",
    slug: "ownerSlug",
  },
}
