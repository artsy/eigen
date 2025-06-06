import {
  ArtworkListEntity,
  getArtworkListsCountByType,
} from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/useUpdateArtworkListsForArtwork"

describe("getArtworkListsCountByType", () => {
  describe("should return correct count of default artwork lists", () => {
    it("one default", () => {
      const artworkLists = [
        {
          default: true,
          internalID: "default-artwork-list-one",
        },
      ] as unknown as ArtworkListEntity

      const result = getArtworkListsCountByType(artworkLists)

      expect(result).toEqual({
        custom: 0,
        default: 1,
      })
    })

    it("multiple defaults", () => {
      const artworkLists = [
        {
          default: true,
          internalID: "default-artwork-list-one",
        },
        {
          default: true,
          internalID: "default-artwork-list-two",
        },
      ] as unknown as ArtworkListEntity

      const result = getArtworkListsCountByType(artworkLists)

      expect(result).toEqual({
        custom: 0,
        default: 2,
      })
    })
  })

  describe("should return correct count of custom artwork lists", () => {
    it("one custom", () => {
      const artworkLists = [
        {
          default: false,
          internalID: "custom-artwork-list-one",
        },
      ] as unknown as ArtworkListEntity

      const result = getArtworkListsCountByType(artworkLists)

      expect(result).toEqual({
        custom: 1,
        default: 0,
      })
    })

    it("multiple customs", () => {
      const artworkLists = [
        {
          default: false,
          internalID: "custom-artwork-list-one",
        },
        {
          default: false,
          internalID: "custom-artwork-list-two",
        },
      ] as unknown as ArtworkListEntity

      const result = getArtworkListsCountByType(artworkLists)

      expect(result).toEqual({
        custom: 2,
        default: 0,
      })
    })
  })

  describe("should return correct count of artwork lists", () => {
    it("one custom and default", () => {
      const artworkLists = [
        {
          default: true,
          internalID: "default-artwork-list-one",
        },
        {
          default: false,
          internalID: "custom-artwork-list-one",
        },
      ] as unknown as ArtworkListEntity

      const result = getArtworkListsCountByType(artworkLists)

      expect(result).toEqual({
        custom: 1,
        default: 1,
      })
    })

    it("multiple customs and defaults", () => {
      const artworkLists = [
        {
          default: true,
          internalID: "default-artwork-list-one",
        },
        {
          default: true,
          internalID: "default-artwork-list-two",
        },
        {
          default: false,
          internalID: "custom-artwork-list-one",
        },
        {
          default: false,
          internalID: "custom-artwork-list-one",
        },
      ] as unknown as ArtworkListEntity

      const result = getArtworkListsCountByType(artworkLists)

      expect(result).toEqual({
        custom: 2,
        default: 2,
      })
    })
  })
})
