export type ArtAssistantArtworkRailState =
  | { status: "loading" }
  | {
      status: "ready"
      artworkIDs: string[]
    }
  | { status: "empty" }
  | { status: "error"; message?: string }

export type ArtAssistantMessage =
  | {
      id: string
      role: "user"
      text: string
    }
  | {
      id: string
      role: "assistant"
      text: string
      phase: "responding" | "complete" | "error"
      progress: string[]
      artworkRail?: ArtAssistantArtworkRailState
      errorMessage?: string
    }
