import { screen } from "@testing-library/react-native"
import { SingleIndexEmptyResultsMessage } from "app/Scenes/Search/components/SingleIndexEmptyResultsMessage"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("SingleIndexEmptyResultsMessage", () => {
  it("shoud render correctly with the an article for artist", () => {
    renderWithWrappers(
      <SingleIndexEmptyResultsMessage
        query="query"
        selectedPill={{
          key: "artist",
          displayName: "artist",
        }}
      />
    )

    expect(screen.queryByText(/Sorry, we couldn’t find an artist for “query.”/))
    expect(screen.queryByText("Please try searching again with a different spelling."))
  })

  it("shoud render correctly with the a article for artist", () => {
    renderWithWrappers(
      <SingleIndexEmptyResultsMessage
        query="query"
        selectedPill={{
          key: "marketing_collection",
          displayName: "collection",
        }}
      />
    )

    expect(screen.queryByText(/Sorry, we couldn’t find a collection for “query.”/))
    expect(screen.queryByText("Please try searching again with a different spelling."))
  })
})
