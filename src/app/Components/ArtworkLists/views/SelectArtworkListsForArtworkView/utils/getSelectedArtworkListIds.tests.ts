import { getSelectedArtworkListIds } from "./getSelectedArtworkListIds"

describe("getSelectedArtworkListIds", () => {
  it("empty array", () => {
    const result = getSelectedArtworkListIds({
      artworkLists: [],
      addToArtworkListIDs: [],
      removeFromArtworkListIDs: [],
    })

    expect(result).toEqual([])
  })

  it("only selected ids", () => {
    const result = getSelectedArtworkListIds({
      artworkLists,
      addToArtworkListIDs: [],
      removeFromArtworkListIDs: [],
    })

    // for `bbb` artwork list the value of `isSavedArtwork` is set to `false`
    expect(result).toEqual(["aaa", "ccc", "ddd"])
  })

  it("with `addToArtworkListIDs`", () => {
    const result = getSelectedArtworkListIds({
      artworkLists,
      addToArtworkListIDs: ["aaa", "eee"],
      removeFromArtworkListIDs: [],
    })

    expect(result).toEqual(["aaa", "ccc", "ddd", "eee"])
  })

  it("without `removeFromArtworkListIDs`", () => {
    const result = getSelectedArtworkListIds({
      artworkLists,
      addToArtworkListIDs: [],
      removeFromArtworkListIDs: ["aaa", "ddd"],
    })

    expect(result).toEqual(["ccc"])
  })

  it("with `addToArtworkListIDs` and without `removeFromArtworkListIDs`", () => {
    const result = getSelectedArtworkListIds({
      artworkLists,
      addToArtworkListIDs: ["aaa", "eee"],
      removeFromArtworkListIDs: ["ccc", "ddd"],
    })

    expect(result).toEqual(["aaa", "eee"])
  })
})

const artworkLists = [
  {
    isSavedArtwork: true,
    internalID: "aaa",
  },
  {
    isSavedArtwork: false,
    internalID: "bbb",
  },
  {
    isSavedArtwork: true,
    internalID: "ccc",
  },
  {
    isSavedArtwork: true,
    internalID: "ddd",
  },
]
