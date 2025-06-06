import { CareerHighlightBottomSheetItem } from "app/Scenes/MyCollection/Screens/Insights/Components/CareerHighlightBottomSheetItem"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { createMockEnvironment } from "relay-test-utils"

describe(CareerHighlightBottomSheetItem, () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
    jest.clearAllMocks()
  })

  it("renders the right section header title for each when only one highlight", () => {
    const year = 2022
    const highlights = {
      Review: ["ArtForum"],
      "Group Show": ["ArtMuseum"],
      "Solo Show": ["Penguin"],
      "Biennial Inclusion": ["Documenta"],
    }
    const { getByText } = renderWithHookWrappersTL(
      <CareerHighlightBottomSheetItem year={year} highlights={highlights} />,
      mockEnvironment
    )
    expect(getByText("Solo show at a major institution")).toBeDefined()
    expect(getByText("Group show at a major institution")).toBeDefined()
    expect(getByText("Reviewed by a major art publication")).toBeDefined()
    expect(getByText("Included in a major biennial")).toBeDefined()
  })

  it("renders the right section header title for each when more than one highlight", () => {
    const year = 2022
    const highlights = {
      Review: ["ArtForum", "ArtMuseum"],
      "Group Show": ["ArtMuseum", "ArtMuseumX"],
      "Solo Show": ["Penguin", "ArtMuseum"],
      "Biennial Inclusion": ["Documenta", "ArtMuseum"],
    }
    const { getByText } = renderWithHookWrappersTL(
      <CareerHighlightBottomSheetItem year={year} highlights={highlights} />,
      mockEnvironment
    )
    expect(getByText("Solo shows at major institutions")).toBeDefined()
    expect(getByText("Group shows at major institutions")).toBeDefined()
    expect(getByText("Reviewed by major art publications")).toBeDefined()
    expect(getByText("Included in multiple major biennials")).toBeDefined()
  })
})
