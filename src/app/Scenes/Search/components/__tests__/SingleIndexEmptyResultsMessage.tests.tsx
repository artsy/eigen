import { screen } from "@testing-library/react-native"
import { SingleIndexEmptyResultsMessage } from "app/Scenes/Search/components/SingleIndexEmptyResultsMessage"
import { useEnableArtAssistant } from "app/utils/hooks/useEnableArtAssistant"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/utils/hooks/useEnableArtAssistant", () => ({
  useEnableArtAssistant: jest.fn(),
}))

describe("SingleIndexEmptyResultsMessage", () => {
  beforeEach(() => {
    jest.mocked(useEnableArtAssistant).mockReturnValue(false)
  })

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

  it("shows the Art Assistant suggestion instead of the message when it is enabled", () => {
    jest.mocked(useEnableArtAssistant).mockReturnValue(true)

    renderWithWrappers(
      <SingleIndexEmptyResultsMessage
        query="query"
        selectedPill={{
          key: "artist",
          displayName: "Artist",
        }}
      />
    )

    expect(screen.getByText("Ask Art Assistant")).toBeOnTheScreen()
    expect(screen.queryByText(/Sorry, we couldn’t find/)).not.toBeOnTheScreen()
  })
})
