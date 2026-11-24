import { screen } from "@testing-library/react-native"
import { ShareSheet } from "app/Components/ShareSheet/ShareSheet"
import { ShareSheetItem } from "app/Components/ShareSheet/types"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

let mockItem: ShareSheetItem | null = null
jest.mock("app/Components/ShareSheet/ShareSheetContext", () => ({
  useShareSheet: () => ({
    isVisible: true,
    item: mockItem,
    showShareSheet: jest.fn(),
    hideShareSheet: jest.fn(),
  }),
}))

// As if WhatsApp and Instagram were installed, so the test sees every row the sheet can show
jest.mock("app/utils/useCanOpenURL", () => ({
  useCanOpenURL: () => true,
}))

jest.mock("app/Scenes/Artwork/Components/InstagramStoryViewShot", () => ({
  InstagramStoryViewShot: () => null,
}))

describe("ShareSheet", () => {
  it("doesn't offer Instagram Stories for a page without an image", async () => {
    mockItem = {
      type: "default",
      href: "/show/the-big-show",
      internalID: "show-id",
      slug: "the-big-show",
      title: "The Big Show",
    }

    await renderWithWrappers(<ShareSheet />)

    expect(screen.getByText("Copy link")).toBeOnTheScreen()
    expect(screen.getByText("More")).toBeOnTheScreen()
    expect(screen.getByText("WhatsApp")).toBeOnTheScreen()
    expect(screen.queryByText("Instagram Stories")).not.toBeOnTheScreen()
  })

  it("offers Instagram Stories for an artist", async () => {
    mockItem = {
      type: "artist",
      href: "/artist/kaws",
      internalID: "artist-id",
      slug: "kaws",
      title: "KAWS",
      artists: [{ name: "KAWS" }],
      currentImageUrl: "https://example.com/kaws.jpg",
    }

    await renderWithWrappers(<ShareSheet />)

    expect(screen.getByText("Instagram Stories")).toBeOnTheScreen()
  })
})
