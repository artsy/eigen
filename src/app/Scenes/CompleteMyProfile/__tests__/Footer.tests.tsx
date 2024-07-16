import { screen, fireEvent } from "@testing-library/react-native"
import { Footer } from "app/Scenes/CompleteMyProfile/Footer"
import * as useCompleteProfile from "app/Scenes/CompleteMyProfile/hooks/useCompleteProfile"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("Footer", () => {
  const mockGoBack = jest.fn()

  ;(jest.spyOn(useCompleteProfile, "useCompleteProfile") as jest.SpyInstance<any>).mockReturnValue({
    isLoading: false,
    goBack: mockGoBack,
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders correctly", () => {
    renderWithWrappers(<Footer onGoNext={() => {}} isFormDirty={false} />)

    expect(screen.getByText("Back")).toBeOnTheScreen()
    expect(screen.getByText("Skip")).toBeOnTheScreen()
  })

  it("renders given isFormDirty", () => {
    renderWithWrappers(<Footer onGoNext={() => {}} isFormDirty={true} />)

    expect(screen.getByText("Continue")).toBeOnTheScreen()
  })

  it("triggers navigation functions", () => {
    const mockGoNext = jest.fn()
    renderWithWrappers(<Footer onGoNext={mockGoNext} isFormDirty={true} />)

    fireEvent.press(screen.getByText("Back"))
    fireEvent.press(screen.getByText("Continue"))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
    expect(mockGoNext).toHaveBeenCalledTimes(1)
  })
})
