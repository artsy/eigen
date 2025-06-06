import { pluralizeMedium } from "app/Scenes/MyCollection/utils/pluralizeArtworkMedium"

describe("pluralizeArtworkMedium", () => {
  it("pluralize medium correctly", () => {
    expect(pluralizeMedium("Painting")).toBe("paintings")
    expect(pluralizeMedium("Photography")).toBe("photographs")
    expect(pluralizeMedium("some other medium")).toBe("other")
  })
})
