import {
  ARTWORK_MEDIUM_QUERY,
  ArtworkMediumFragmentContainer,
} from "app/Scenes/ArtworkMedium/ArtworkMedium"
import { extractText } from "app/utils/tests/extractText"
import { setupTestWrapper_LEGACY } from "app/utils/tests/setupTestWrapper"

const { getWrapper } = setupTestWrapper_LEGACY({
  Component: ArtworkMediumFragmentContainer,
  query: ARTWORK_MEDIUM_QUERY,
})

describe("ArtworkMedium", () => {
  it("renders correctly", () => {
    const wrapper = getWrapper({
      ArtworkMedium: () => ({
        name: "Painting",
        longDescription: "Paint on a support, presumably.",
      }),
    })

    const text = extractText(wrapper.root)

    expect(text).toContain("Painting")
    expect(text).toContain("Paint on a support, presumably.")
    expect(text).toContain(
      "Artsy has nineteen medium types. Medium types are categories that define the material or format used to create the artwork."
    )
  })
})
