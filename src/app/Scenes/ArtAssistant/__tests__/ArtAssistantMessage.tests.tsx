import { Theme } from "@artsy/palette-mobile"
import { fireEvent, render, screen } from "@testing-library/react-native"
import { ArtAssistantMessage } from "app/Scenes/ArtAssistant/Components/ArtAssistantMessage"
import { ART_ASSISTANT_ERRORS } from "app/Scenes/ArtAssistant/utils/artAssistantErrors"
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

  it("renders a rail per section, dispatching on the section type", () => {
    renderWithWrappers(
      <ArtAssistantMessage
        message={{
          id: "assistant-1",
          role: "assistant",
          text: "Here's what we found.",
          phase: "complete",
          sections: [
            { type: "artworks", artworkIDs: ["artwork-id"] },
            { type: "artists", artistIDs: ["artist-id"] },
          ],
        }}
      />
    )

    expect(screen.getByTestId("art-assistant-artwork-rail-loading")).toBeOnTheScreen()
    expect(screen.getByTestId("art-assistant-artist-rail-loading")).toBeOnTheScreen()
  })

  it("renders no rail for a text-only answer", () => {
    renderWithWrappers(
      <ArtAssistantMessage
        message={{
          id: "assistant-1",
          role: "assistant",
          text: "That's not something we can show you.",
          phase: "complete",
        }}
      />
    )

    expect(screen.queryByTestId("art-assistant-artwork-rail-loading")).not.toBeOnTheScreen()
    expect(screen.queryByTestId("art-assistant-artist-rail-loading")).not.toBeOnTheScreen()
  })

  describe("errors", () => {
    const failed = {
      id: "assistant-1",
      role: "assistant" as const,
      text: ART_ASSISTANT_ERRORS.conversation_limit.message,
      phase: "error" as const,
      error: "conversation_limit" as const,
    }

    it("renders the error with its actions", () => {
      const onSelectErrorAction = jest.fn()
      renderWithWrappers(
        <ArtAssistantMessage message={failed} onSelectErrorAction={onSelectErrorAction} />
      )

      expect(screen.getByText(ART_ASSISTANT_ERRORS.conversation_limit.message)).toBeOnTheScreen()

      fireEvent.press(screen.getByText("Yes! Open a new chat window"))
      fireEvent.press(screen.getByText("No, I'm done for now"))

      expect(onSelectErrorAction.mock.calls).toEqual([["newChat"], ["close"]])
    })

    it("does not offer actions on an earlier error", () => {
      renderWithWrappers(<ArtAssistantMessage message={failed} />)

      expect(screen.getByText(ART_ASSISTANT_ERRORS.conversation_limit.message)).toBeOnTheScreen()
      expect(screen.queryByTestId("art-assistant-error-actions")).not.toBeOnTheScreen()
    })
  })

  it("shows an attached image without an empty bubble", () => {
    renderWithWrappers(
      <ArtAssistantMessage
        message={{
          id: "user-1",
          role: "user",
          text: "",
          image: { s3Bucket: "bucket", s3Key: "key", uri: "file:///photo.jpg" },
        }}
      />
    )

    expect(screen.getByTestId("art-assistant-attached-image")).toBeOnTheScreen()
    expect(screen.queryByTestId("art-assistant-user-message")).not.toBeOnTheScreen()
  })

  it("shows an attached image above the text sent with it", () => {
    renderWithWrappers(
      <ArtAssistantMessage
        message={{
          id: "user-1",
          role: "user",
          text: "Something like this",
          image: { s3Bucket: "bucket", s3Key: "key", uri: "file:///photo.jpg" },
        }}
      />
    )

    expect(screen.getByTestId("art-assistant-attached-image")).toBeOnTheScreen()
    expect(screen.getByText("Something like this")).toBeOnTheScreen()
  })

  describe("suggested replies", () => {
    const answered = {
      id: "assistant-1",
      role: "assistant" as const,
      text: "I found a few works.",
      phase: "complete" as const,
      suggestedReplies: ["Show me cheaper ones", "Only paintings"],
    }

    it("sends the tapped reply", () => {
      const onSelectSuggestedReply = jest.fn()
      renderWithWrappers(
        <ArtAssistantMessage message={answered} onSelectSuggestedReply={onSelectSuggestedReply} />
      )

      expect(screen.getByText("Suggestions")).toBeOnTheScreen()

      fireEvent.press(screen.getByText("Only paintings"))

      expect(onSelectSuggestedReply).toHaveBeenCalledWith("Only paintings", 1, "assistant-1")
    })

    it("are not offered on an earlier answer", () => {
      renderWithWrappers(<ArtAssistantMessage message={answered} />)

      expect(screen.queryByTestId("art-assistant-suggested-replies")).not.toBeOnTheScreen()
    })
  })
})
