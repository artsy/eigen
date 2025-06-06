import { SearchCriteriaQueryRenderer } from "app/Scenes/Artist/SearchCriteria"
import { rejectMostRecentRelayOperation } from "app/utils/tests/rejectMostRecentRelayOperation"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"

describe("SearchCriteria", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("should not query the search criteria when searchCriteriaId is not passed", () => {
    const mockRenderComponent = jest.fn(() => <></>)

    renderWithWrappers(
      <SearchCriteriaQueryRenderer
        render={{ renderComponent: mockRenderComponent, renderPlaceholder: jest.fn() }}
      />
    )

    expect(mockRenderComponent).toBeCalledWith({
      fetchCriteriaError: null,
      savedSearchCriteria: null,
    })
  })

  it("should query the search criteria", () => {
    const mockRenderComponent = jest.fn(() => <></>)

    renderWithWrappers(
      <SearchCriteriaQueryRenderer
        alertId="alert-id"
        render={{ renderComponent: mockRenderComponent, renderPlaceholder: jest.fn() }}
        environment={mockEnvironment}
      />
    )

    resolveMostRecentRelayOperation(mockEnvironment)

    expect(mockRenderComponent).toBeCalledWith({
      fetchCriteriaError: null,
      savedSearchCriteria: mockResponse,
    })
  })

  it("should call renderPlaceholder when query is loading", () => {
    const mockRenderPlaceholder = jest.fn(() => <></>)

    renderWithWrappers(
      <SearchCriteriaQueryRenderer
        alertId="alert-id"
        render={{ renderComponent: jest.fn(() => <></>), renderPlaceholder: mockRenderPlaceholder }}
        environment={mockEnvironment}
      />
    )

    expect(mockRenderPlaceholder).toBeCalled()
  })

  it("should return error if something went wrong during query", () => {
    const mockRenderComponent = jest.fn(() => <></>)

    renderWithWrappers(
      <SearchCriteriaQueryRenderer
        alertId="alert-id"
        render={{ renderComponent: mockRenderComponent, renderPlaceholder: jest.fn() }}
        environment={mockEnvironment}
      />
    )

    rejectMostRecentRelayOperation(mockEnvironment, new Error())

    expect(mockRenderComponent).toBeCalledWith({
      fetchCriteriaError: new Error(),
      savedSearchCriteria: null,
    })
  })
})

const mockResponse = {
  acquireable: "acquireable-1",
  additionalGeneIDs: "additionalGeneIDs-1",
  atAuction: "atAuction-1",
  attributionClass: "attributionClass-1",
  colors: "colors-1",
  dimensionRange: "dimensionRange-1",
  height: "height-1",
  inquireableOnly: "inquireableOnly-1",
  locationCities: "locationCities-1",
  majorPeriods: "majorPeriods-1",
  materialsTerms: "materialsTerms-1",
  offerable: "offerable-1",
  partnerIDs: "partnerIDs-1",
  priceRange: "priceRange-1",
  width: "width-1",
  sizes: "sizes-1",
}
