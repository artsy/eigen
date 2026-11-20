import { screen } from "@testing-library/react-native"
import { CareerHighlightBottomSheetItem } from "app/Scenes/MyCollection/Screens/Insights/Components/CareerHighlightBottomSheetItem"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { createMockEnvironment } from "relay-test-utils"

describe(CareerHighlightBottomSheetItem, () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
    jest.clearAllMocks()
  })

  it("renders the right section header title for each when only one highlight", async () => {
    const year = 2022
    const highlights = {
      Review: ["ArtForum"],
      "Group Show": ["ArtMuseum"],
      "Solo Show": ["Penguin"],
      "Biennial Inclusion": ["Documenta"],
    }
    await renderWithHookWrappersTL(
      <CareerHighlightBottomSheetItem year={year} highlights={highlights} />,
      mockEnvironment
    )
    expect(screen.getByText("Solo show at a major institution")).toBeDefined()
    expect(screen.getByText("Group show at a major institution")).toBeDefined()
    expect(screen.getByText("Reviewed by a major art publication")).toBeDefined()
    expect(screen.getByText("Included in a major biennial")).toBeDefined()
  })

  it("renders the right section header title for each when more than one highlight", async () => {
    const year = 2022
    const highlights = {
      Review: ["ArtForum", "ArtMuseum"],
      "Group Show": ["ArtMuseum", "ArtMuseumX"],
      "Solo Show": ["Penguin", "ArtMuseum"],
      "Biennial Inclusion": ["Documenta", "ArtMuseum"],
    }
    await renderWithHookWrappersTL(
      <CareerHighlightBottomSheetItem year={year} highlights={highlights} />,
      mockEnvironment
    )
    expect(screen.getByText("Solo shows at major institutions")).toBeDefined()
    expect(screen.getByText("Group shows at major institutions")).toBeDefined()
    expect(screen.getByText("Reviewed by major art publications")).toBeDefined()
    expect(screen.getByText("Included in multiple major biennials")).toBeDefined()
  })
})
