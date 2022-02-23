import { goBack } from "app/navigation/navigate"
import { extractText } from "app/tests/extractText"
import { setupTestWrapper } from "app/tests/setupTestWrapper"
import { Button, Text } from "palette"
import {
  ARTWORK_ATTRIBUTION_CLASS_FAQ_QUERY,
  ArtworkAttributionClassFAQ,
} from "./ArtworkAttributionClassFAQ"

jest.unmock("react-relay")

const { getWrapper } = setupTestWrapper({
  Component: ArtworkAttributionClassFAQ,
  query: ARTWORK_ATTRIBUTION_CLASS_FAQ_QUERY,
})

describe("ArtworkAttributionClassFAQ", () => {
  it("renders the header", () => {
    const wrapper = getWrapper()
    expect(extractText(wrapper.root.findAllByType(Text)[0])).toEqual("Artwork classifications")
  })

  it("renders the OK button", () => {
    const wrapper = getWrapper()
    expect(extractText(wrapper.root.findAllByType(Button)[0].props.children)).toEqual("OK")
  })

  // FIXME: Unable to mock out AttributionClasses in anyway for some reason?
  it.skip("renders attribution classes", () => {
    const wrapper = getWrapper({
      Query: () => ({
        artworkAttributionClasses: () => ATTRIBUTION_CLASSES,
      }),
    })

    const text = extractText(wrapper.root)

    expect(text).toContain("Unique")
    expect(text).toContain("One of a kind piece, created by the artist.")
  })

  it("returns to previous page when ok button is clicked", () => {
    const wrapper = getWrapper()
    const ok = wrapper.root.findAllByType(Button)[0]

    ok.props.onPress()

    expect(goBack).toHaveBeenCalledTimes(1)
  })
})

const ATTRIBUTION_CLASSES = [
  {
    name: "Unique",
    longDescription: "One of a kind piece, created by the artist.",
  },
  {
    name: "Limited edition",
    longDescription:
      "Original works created in multiple with direct involvement of the artist. Generally, less than 150 pieces total.",
  },
  {
    name: "Made-to-order",
    longDescription:
      "A piece that is made-to-order, taking into account the collector’s preferences.",
  },
  {
    name: "Reproduction",
    longDescription:
      "Reproduction of an original work authorized by artist’s studio or estate. The artist was not directly involved in production.",
  },
  {
    name: "Editioned multiple",
    longDescription:
      "Pieces created in larger limited editions, authorized by the artist’s studio or estate. Not produced with direct involvement of the artist.",
  },
  {
    name: "Non-editioned multiple",
    longDescription:
      "Works made in unlimited or unknown numbers of copies, authorized by the artist’s studio or estate. Not produced with direct involvement of the artist.",
  },
  {
    name: "Ephemera",
    longDescription:
      "Items related to the artist, created or manufactured for a specific, limited use. This includes exhibition materials, memorabilia, autographs, etc.",
  },
]
