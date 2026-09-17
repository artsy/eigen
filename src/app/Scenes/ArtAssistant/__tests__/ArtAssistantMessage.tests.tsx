import { screen } from "@testing-library/react-native"
import { ArtAssistantMessage } from "app/Scenes/ArtAssistant/Components/ArtAssistantMessage"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ArtAssistantMessage", () => {
  it("renders user messages like Inbox", () => {
    renderWithWrappers(
      <ArtAssistantMessage message={{ id: "user-1", role: "user", text: "Blue painting" }} />
    )

    expect(screen.getByTestId("art-assistant-user-message")).toHaveStyle({
      alignSelf: "flex-end",
      backgroundColor: "#000000",
    })
    expect(screen.getByText("Blue painting")).toHaveStyle({ color: "#FFFFFF" })
  })

  it("renders assistant messages like Inbox", () => {
    renderWithWrappers(
      <ArtAssistantMessage
        message={{
          id: "assistant-1",
          role: "assistant",
          text: "I found a few works.",
          phase: "complete",
          progress: [],
        }}
      />
    )

    expect(screen.getByTestId("art-assistant-assistant-message")).toHaveStyle({
      alignSelf: "flex-start",
      backgroundColor: "#E7E7E7",
    })
    expect(screen.getByText("I found a few works.")).toHaveStyle({ color: "#000000" })
  })

  it("renders the latest progress while responding", () => {
    renderWithWrappers(
      <ArtAssistantMessage
        message={{
          id: "assistant-1",
          role: "assistant",
          text: "",
          phase: "responding",
          progress: ["Understanding your request…", "Searching Artsy…"],
        }}
      />
    )

    expect(screen.getByText("Searching Artsy…")).toBeOnTheScreen()
  })

  it("renders an assistant error", () => {
    renderWithWrappers(
      <ArtAssistantMessage
        message={{
          id: "assistant-1",
          role: "assistant",
          text: "",
          phase: "error",
          progress: [],
          errorMessage: "Please try again later.",
        }}
      />
    )

    expect(screen.getByText("Please try again later.")).toBeOnTheScreen()
  })
})
