import { OwnerType } from "@artsy/cohesion"
import { ArtAssistantSection } from "app/Scenes/ArtAssistant/types"

interface SectionItems {
  /** The entity type, named after the matching `OwnerType` as the analytics schema expects */
  itemType: OwnerType
  itemIDs: string[]
}

// Adding a section type to `ArtAssistantSection` fails to compile here until it is mapped, which
// is what keeps new entity types from silently dropping out of the tracked item counts.
const toSectionItems = (section: ArtAssistantSection): SectionItems => {
  switch (section.type) {
    case "artworks":
      return { itemType: OwnerType.artwork, itemIDs: section.artworkIDs }
    case "artists":
      return { itemType: OwnerType.artist, itemIDs: section.artistIDs }
  }
}

/**
 * Everything an answer showed alongside its prose, flattened for analytics: IDs in display order
 * across all sections, and the entity type when every item shares one. `item_type` on the
 * `receivedArtAssistantResponse` event holds a single type, so a mixed answer leaves it out
 * rather than naming only one of the types that were shown.
 */
export const getArtAssistantItems = (
  sections: readonly ArtAssistantSection[] = []
): { itemIDs: string[]; itemType?: OwnerType } => {
  const items = sections.map(toSectionItems).filter(({ itemIDs }) => itemIDs.length > 0)
  const itemTypes = new Set(items.map(({ itemType }) => itemType))

  return {
    itemIDs: items.flatMap(({ itemIDs }) => itemIDs),
    itemType: itemTypes.size === 1 ? [...itemTypes][0] : undefined,
  }
}
