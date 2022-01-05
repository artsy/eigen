import { ArtworkFormValues } from "../State/MyCollectionArtworkModel"
import { cleanArtworkPayload, explicitlyClearedFields } from "./cleanArtworkPayload"

describe("cleanArtworkPayload", () => {
  describe("with a payload including a key with a null value", () => {
    it("removes that key from the cleaned payload", () => {
      const initialPayload = { attribute: null }
      const cleanedPayload = cleanArtworkPayload(initialPayload)
      expect(cleanedPayload).not.toHaveProperty("attribute")
    })
  })

  describe("with a payload including a key with a undefined value", () => {
    it("removes that key from the cleaned payload", () => {
      const initialPayload = { attribute: undefined }
      const cleanedPayload = cleanArtworkPayload(initialPayload)
      expect(cleanedPayload).not.toHaveProperty("attribute")
    })
  })

  describe("with a payload including a key thats an empty string", () => {
    it("removes that key from the cleaned payload", () => {
      const initialPayload = { attribute: "" }
      const cleanedPayload = cleanArtworkPayload(initialPayload)
      expect(cleanedPayload).not.toHaveProperty("attribute")
    })
  })

  describe("with a payload including a key with a false value", () => {
    it("passes that value through to the cleaned payload", () => {
      const initialPayload = { attribute: false }
      const cleanedPayload = cleanArtworkPayload(initialPayload)
      expect(cleanedPayload).toHaveProperty("attribute", false)
    })
  })

  describe("with a payload including a key with a true value", () => {
    it("passes that value through to the cleaned payload", () => {
      const initialPayload = { attribute: true }
      const cleanedPayload = cleanArtworkPayload(initialPayload)
      expect(cleanedPayload).toHaveProperty("attribute", true)
    })
  })
})

describe("explicitlyClearedFields", () => {
  describe("with a payload with a field changed to empty", () => {
    const artworkFormValues: () => ArtworkFormValues = () => {
      return {
        width: "10",
        depth: "10",
        height: "10",
        artist: "some-artist",
        artistIds: [],
        medium: "some-medium",
        category: "some-category",
        editionNumber: "some-edition-number",
        isEdition: false,
        title: "some-title",
        artistSearchResult: {} as any,
        pricePaidDollars: "100",
        pricePaidCurrency: "USD",
        date: "some-date",
        editionSize: "some-edition-size",
        metric: "in",
        artworkLocation: "some-location",
        photos: [],
        provenance: "some-provenance",
        attributionClass: "Unique",
      }
    }

    it("returns a payload with removed field", () => {
      const initialPayload = artworkFormValues()
      const updatedPayload: Partial<ArtworkFormValues> = artworkFormValues()
      delete updatedPayload.width
      const explicitlyClearedPayload = explicitlyClearedFields(updatedPayload, initialPayload)
      expect(explicitlyClearedPayload).toHaveProperty("width")
    })

    it("returns multiple removed fields", () => {
      const initialPayload = artworkFormValues()
      const updatedPayload: Partial<ArtworkFormValues> = artworkFormValues()
      delete updatedPayload.width
      delete updatedPayload.height
      const explicitlyClearedPayload = explicitlyClearedFields(updatedPayload, initialPayload)
      expect(explicitlyClearedPayload).toHaveProperty("width")
      expect(explicitlyClearedPayload).toHaveProperty("height")
    })

    it("doesn't return fields previously empty", () => {
      const initialPayload = artworkFormValues()
      initialPayload.width = ""
      const updatedPayload: Partial<ArtworkFormValues> = artworkFormValues()
      delete updatedPayload.width
      delete updatedPayload.height
      const explicitlyClearedPayload = explicitlyClearedFields(updatedPayload, initialPayload)
      expect(explicitlyClearedPayload).not.toHaveProperty("width")
      expect(explicitlyClearedPayload).toHaveProperty("height")
    })
  })
})
