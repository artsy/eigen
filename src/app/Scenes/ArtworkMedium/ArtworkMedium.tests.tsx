import { ARTWORK_MEDIUM_QUERY, ArtworkMediumFragmentContainer } from "app/Scenes/ArtworkMedium"
import { extractText } from "app/tests/extractText"
import { setupTestWrapper } from "app/tests/setupTestWrapper"

jest.unmock("react-relay")

const { getWrapper } = setupTestWrapper({
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
