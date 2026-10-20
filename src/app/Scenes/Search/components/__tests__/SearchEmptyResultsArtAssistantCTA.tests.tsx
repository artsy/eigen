import { ContextModule } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { SearchEmptyResultsArtAssistantCTA } from "app/Scenes/Search/components/SearchEmptyResultsArtAssistantCTA"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/system/navigation/navigate", () => ({
  navigate: jest.fn(),
}))

describe("SearchEmptyResultsArtAssistantCTA", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("opens Art Assistant with the search query and tracks the tap", () => {
    renderWithWrappers(
      <SearchEmptyResultsArtAssistantCTA
        contextModule={ContextModule.artworksTab}
        query=" moody seascapes "
      />
    )

    expect(screen.getByText("Not finding what you’re looking for?")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Ask Art Assistant"))

    expect(navigate).toHaveBeenCalledWith("/art-assistant", {
      passProps: { initialPrompt: "moody seascapes" },
    })
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedArtAssistant",
      context_module: "artworksTab",
      context_screen_owner_type: "search",
      destination_screen_owner_type: "artAssistant",
      type: "button",
    })
  })
})
