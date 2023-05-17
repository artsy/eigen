import { fireEvent } from "@testing-library/react-native"
import { ArtistArtworksTestsQuery } from "__generated__/ArtistArtworksTestsQuery.graphql"
import { ArtistArtworksPaginationContainer } from "app/Components/Artist/ArtistArtworks/ArtistArtworks"
import { FilterArray } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { QueryRenderer, graphql } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

describe("MyCollectionArtworkListItem", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer: React.FC<{
    predefinedFilter: FilterArray
    searchCriteria: SearchCriteriaAttributes | null
  }> = ({ predefinedFilter, searchCriteria }) => {
    return (
      <StickyTabPage
        tabs={[
          {
            title: "Artworks",
            content: (
              <QueryRenderer<ArtistArtworksTestsQuery>
                environment={mockEnvironment}
                query={graphql`
                  query ArtistArtworksTestsQuery @relay_test_operation {
                    artist(id: "artist-id") {
                      ...ArtistArtworks_artist
                    }
                  }
                `}
                variables={{}}
                render={({ props }) => {
                  if (props?.artist) {
                    return (
                      <ArtistArtworksPaginationContainer
                        artist={props.artist!}
                        predefinedFilters={predefinedFilter}
                        searchCriteria={searchCriteria}
                      />
                    )
                  }
                  return null
                }}
              />
            ),
          },
        ]}
      ></StickyTabPage>
    )
  }

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should convert the criteria attributes to the filter params format", async () => {
    const searchCriteria = {
      acquireable: true,
      additionalGeneIDs: '<mock-value-for-field-"additionalGeneIDs">',
      atAuction: null,
      attributionClass: ["limited edition", "open edition"],
      colors: '<mock-value-for-field-"colors">',
      dimensionRange: '<mock-value-for-field-"dimensionRange">',
      height: null,
      inquireableOnly: true,
      locationCities: '<mock-value-for-field-"locationCities">',
      majorPeriods: '<mock-value-for-field-"majorPeriods">',
      materialsTerms: '<mock-value-for-field-"materialsTerms">',
      offerable: null,
      partnerIDs: '<mock-value-for-field-"partnerIDs">',
      priceRange: '<mock-value-for-field-"priceRange">',
      width: null,
      sizes: '<mock-value-for-field-"sizes">',
    } as any
    const { getByText } = renderWithWrappers(
      <TestRenderer predefinedFilter={[]} searchCriteria={searchCriteria} />
    )

    resolveMostRecentRelayOperation(mockEnvironment)

    fireEvent.press(getByText("Sort & Filter"))

    expect(getByText("Sort By • 1")).toBeTruthy()
    expect(getByText("Rarity • 2")).toBeTruthy()
    expect(getByText("Ways to Buy • 2")).toBeTruthy()
  })
})
