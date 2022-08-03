import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import {
  rejectMostRecentRelayOperation,
  resolveMostRecentRelayOperation,
} from "app/tests/resolveMostRecentRelayOperation"
import { SearchCriteriaQueryRenderer } from "./SearchCriteria"

describe("SearchCriteria", () => {
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
        searchCriteriaId="search-criter-id"
        render={{ renderComponent: mockRenderComponent, renderPlaceholder: jest.fn() }}
        environment={getRelayEnvironment()}
      />
    )

    resolveMostRecentRelayOperation()

    expect(mockRenderComponent).toBeCalledWith({
      fetchCriteriaError: null,
      savedSearchCriteria: mockResponse,
    })
  })

  it("should call renderPlaceholder when query is loading", () => {
    const mockRenderPlaceholder = jest.fn(() => <></>)

    renderWithWrappers(
      <SearchCriteriaQueryRenderer
        searchCriteriaId="search-criter-id"
        render={{ renderComponent: jest.fn(() => <></>), renderPlaceholder: mockRenderPlaceholder }}
        environment={getRelayEnvironment()}
      />
    )

    expect(mockRenderPlaceholder).toBeCalled()
  })

  it("should return error if something went wrong during query", () => {
    const mockRenderComponent = jest.fn(() => <></>)

    renderWithWrappers(
      <SearchCriteriaQueryRenderer
        searchCriteriaId="search-criter-id"
        render={{ renderComponent: mockRenderComponent, renderPlaceholder: jest.fn() }}
        environment={getRelayEnvironment()}
      />
    )

    rejectMostRecentRelayOperation(new Error())

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
