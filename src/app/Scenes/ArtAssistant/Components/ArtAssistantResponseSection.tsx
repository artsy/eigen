import { AIAgentSectionType } from "__generated__/ArtAssistantAgentTurnSubscription.graphql"
import { ArtAssistantArtistRail } from "app/Scenes/ArtAssistant/Components/ArtAssistantArtistRail"
import { ArtAssistantArtworkRail } from "app/Scenes/ArtAssistant/Components/ArtAssistantArtworkRail"
import { ArtAssistantSection } from "app/Scenes/ArtAssistant/types"

interface ArtAssistantResponseSectionProps {
  section: ArtAssistantSection
}

/**
 * The Metaphysics capability each renderable section maps to. Keyed by our own section type, so a
 * new member of `ArtAssistantSection` can't be added without answering for it here — and the
 * answer is only allowed to be a capability once the switch below actually renders it. The agent
 * writes its prose assuming the cards it asked for will appear, so a type declared without a
 * renderer reads as a broken answer rather than a missing rail.
 */
const SECTION_CAPABILITIES: Record<ArtAssistantSection["type"], AIAgentSectionType> = {
  artworks: "ARTWORKS",
  artists: "ARTISTS",
}

/** A build constant, deliberately not per-turn state: it describes the renderers, not the turn. */
export const ART_ASSISTANT_SUPPORTED_SECTIONS = Object.values(SECTION_CAPABILITIES)

/**
 * Dispatches on this client's own section discriminator rather than on the GraphQL `__typename`,
 * which is translated once, on the terminal event. Each renderer owns its loading and error
 * states so one slow or failing rail can't take the rest of the answer down with it.
 */
export const ArtAssistantResponseSection: React.FC<ArtAssistantResponseSectionProps> = ({
  section,
}) => {
  switch (section.type) {
    case "artworks":
      return <ArtAssistantArtworkRail artworkIDs={section.artworkIDs} />
    case "artists":
      return <ArtAssistantArtistRail artistIDs={section.artistIDs} />
  }
}
