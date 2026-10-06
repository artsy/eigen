/**
 * What an answer showed alongside its prose, reduced to the entity type and the IDs in display
 * order. Metaphysics sends full `Artwork`/`Artist` nodes on the subscription payload, but we keep
 * only this: it is serializable, survives being persisted, and leaves the rails to fetch display
 * data through an ordinary Relay query instead of relying on subscription retain/GC behaviour.
 */
export type ArtAssistantSection =
  | { type: "artworks"; artworkIDs: string[] }
  | { type: "artists"; artistIDs: string[] }

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
      activity?: string
      sections?: ArtAssistantSection[]
    }
