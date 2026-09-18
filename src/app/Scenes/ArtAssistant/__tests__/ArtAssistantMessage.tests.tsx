import { Theme } from "@artsy/palette-mobile"
import { render, screen } from "@testing-library/react-native"
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
      maxWidth: "75%",
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
        }}
      />
    )

    expect(screen.getByTestId("art-assistant-assistant-message")).toHaveStyle({
      alignSelf: "flex-start",
      backgroundColor: "#E7E7E7",
      maxWidth: "75%",
    })
    expect(screen.getByText("I found a few works.")).toHaveStyle({ color: "#000000" })
  })

  it("renders activity separately from assistant messages", () => {
    renderWithWrappers(
      <ArtAssistantMessage
        message={{
          id: "assistant-1",
          role: "assistant",
          text: "",
          phase: "responding",
          activity: "Searching Artsy…",
        }}
      />
    )

    expect(screen.queryByTestId("art-assistant-assistant-message")).not.toBeOnTheScreen()
    expect(screen.getByTestId("art-assistant-activity-status")).toHaveProp(
      "accessibilityLiveRegion",
      "polite"
    )
    expect(screen.getByTestId("art-assistant-activity-status")).toHaveStyle({
      backgroundColor: "#F7F7F7",
    })
    expect(screen.getByText("Searching Artsy…")).toHaveStyle({ color: "#707070" })
  })

  it("uses dark theme colors for activity", () => {
    render(
      <Theme theme="v3dark">
        <ArtAssistantMessage
          message={{
            id: "assistant-1",
            role: "assistant",
            text: "",
            phase: "responding",
            activity: "Thinking...",
          }}
        />
      </Theme>
    )

    expect(screen.getByTestId("art-assistant-activity-status")).toHaveStyle({
      backgroundColor: "#1a1a1a",
    })
    expect(screen.getByText("Thinking...")).toHaveStyle({ color: "#C2C2C2" })
  })

  it("renders an assistant error", () => {
    renderWithWrappers(
      <ArtAssistantMessage
        message={{
          id: "assistant-1",
          role: "assistant",
          text: "",
          phase: "error",
          errorMessage: "Please try again later.",
        }}
      />
    )

    expect(screen.getByText("Please try again later.")).toBeOnTheScreen()
  })
})
