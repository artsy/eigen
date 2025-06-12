import { fireEvent, screen } from "@testing-library/react-native"
import { SearchResult, SearchResultItemProps } from "app/Scenes/Search/components/SearchResult"
import { ARTIST_PILL } from "app/Scenes/Search/constants"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const initialProps: SearchResultItemProps = {
  selectedPill: ARTIST_PILL,
  result: {
    __typename: "Artist",
    displayLabel: "Banksy",
    href: "/artist/banksy",
    imageUrl: "https://oneimage.jpg",
    slug: "banksy",
    internalID: "banksy12512",
  },
  position: 1,
  query: "Banksy",
}

describe("EntitySearchResult", () => {
  it("renders the expected information", () => {
    renderWithWrappers(<SearchResult {...initialProps} />)

    expect(screen.getByText("Banksy")).toBeTruthy()
    expect(screen.getByTestId("search-result-image-Banksy")).toBeTruthy()
  })

  it("navigates to the artist page when the result is pressed", () => {
    renderWithWrappers(<SearchResult {...initialProps} />)

    fireEvent.press(screen.getByText("Banksy"))

    // navigates to the artist page
    expect(navigate).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith("/artist/banksy")
  })

  it("tracks the tap event", () => {
    renderWithWrappers(<SearchResult {...initialProps} />)

    fireEvent.press(screen.getByText("Banksy"))

    // tracks the press event
    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "action": "selectedResultFromSearchScreen",
          "context_module": "artistsTab",
          "context_screen": "Search",
          "context_screen_owner_type": "Search",
          "position": 1,
          "query": "Banksy",
          "selected_object_slug": "banksy",
          "selected_object_type": "Artist",
        },
      ]
    `)
  })
})
