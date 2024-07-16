import { screen, fireEvent } from "@testing-library/react-native"
import { ProfessionStep } from "app/Scenes/CompleteMyProfile/ProfessionStep"
import * as useCompleteProfile from "app/Scenes/CompleteMyProfile/hooks/useCompleteProfile"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ProfessionStep", () => {
  const mockSetField = jest.fn()

  const useCompleteMyProfileSpy = (
    jest.spyOn(useCompleteProfile, "useCompleteProfile") as jest.SpyInstance<any>
  ).mockReturnValue({
    goNext: jest.fn(),
    isCurrentRouteDirty: false,
    field: undefined,
    setField: mockSetField,
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders", () => {
    renderWithWrappers(<ProfessionStep />)

    expect(screen.getByText("Add your profession")).toBeOnTheScreen()
    expect(
      screen.getByText(
        "Accelerate conversations with galleries by providing quick insights into your background."
      )
    ).toBeOnTheScreen()
    expect(screen.getByLabelText("Profession")).toBeOnTheScreen()
  })

  it("calls setField on input change", () => {
    renderWithWrappers(<ProfessionStep />)

    const input = screen.getByLabelText("Profession")
    fireEvent(input, "changeText", "Artist")

    expect(mockSetField).toHaveBeenCalledWith("Artist")
  })

  it("shows the input value from field state", () => {
    useCompleteMyProfileSpy.mockReturnValue({
      goNext: jest.fn(),
      isCurrentRouteDirty: false,
      field: "Curator",
      setField: mockSetField,
    })

    renderWithWrappers(<ProfessionStep />)

    expect(screen.getByLabelText("Profession")).toHaveAccessibilityValue("Curator")
  })
})
