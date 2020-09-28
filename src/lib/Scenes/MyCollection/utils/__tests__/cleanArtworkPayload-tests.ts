import { cleanArtworkPayload } from "../cleanArtworkPayload"

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
