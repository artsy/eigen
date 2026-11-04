import { ArtAssistantSection } from "app/Scenes/ArtAssistant/types"
import { getArtAssistantItems } from "app/Scenes/ArtAssistant/utils/artAssistantItems"

describe("getArtAssistantItems", () => {
  const artworks: ArtAssistantSection = { type: "artworks", artworkIDs: ["a1", "a2"] }
  const artists: ArtAssistantSection = { type: "artists", artistIDs: ["x1", "x2", "x3"] }

  it("returns the artwork IDs and type for an artworks-only answer", () => {
    expect(getArtAssistantItems([artworks])).toEqual({
      itemIDs: ["a1", "a2"],
      itemType: "artwork",
    })
  })

  it("returns the artist IDs and type for an artists-only answer", () => {
    expect(getArtAssistantItems([artists])).toEqual({
      itemIDs: ["x1", "x2", "x3"],
      itemType: "artist",
    })
  })

  it("combines every section in display order and leaves the type out for a mixed answer", () => {
    expect(getArtAssistantItems([artists, artworks])).toEqual({
      itemIDs: ["x1", "x2", "x3", "a1", "a2"],
      itemType: undefined,
    })
  })

  it("keeps the type when several sections share it", () => {
    expect(getArtAssistantItems([artworks, { type: "artworks", artworkIDs: ["a3"] }])).toEqual({
      itemIDs: ["a1", "a2", "a3"],
      itemType: "artwork",
    })
  })

  it("ignores empty sections when picking the type", () => {
    expect(getArtAssistantItems([{ type: "artists", artistIDs: [] }, artworks])).toEqual({
      itemIDs: ["a1", "a2"],
      itemType: "artwork",
    })
  })

  it.each([[undefined], [[]]])("returns no items for %p", (sections) => {
    expect(getArtAssistantItems(sections)).toEqual({ itemIDs: [], itemType: undefined })
  })
})
