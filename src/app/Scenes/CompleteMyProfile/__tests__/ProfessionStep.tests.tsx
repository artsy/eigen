import { screen, fireEvent } from "@testing-library/react-native"
import { CompleteMyProfileStore } from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { ProfessionStep } from "app/Scenes/CompleteMyProfile/ProfessionStep"
import * as useCompleteProfile from "app/Scenes/CompleteMyProfile/hooks/useCompleteProfile"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ProfessionStep", () => {
  const setProgressState = jest.fn()
  ;(jest.spyOn(useCompleteProfile, "useCompleteProfile") as jest.SpyInstance<any>).mockReturnValue({
    goNext: jest.fn(),
  })
  jest
    .spyOn(CompleteMyProfileStore, "useStoreActions")
    .mockImplementation((callback) => callback({ setProgressState } as any))
  const stateSpy = jest
    .spyOn(CompleteMyProfileStore, "useStoreState")
    .mockImplementation((callback) => callback({ progressState: {} } as any))

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

    expect(setProgressState).toHaveBeenCalledWith({ type: "profession", value: "Artist" })
  })

  it("shows the input value from field state", () => {
    stateSpy.mockImplementation((callback) =>
      callback({ progressState: { profession: "Curator" } } as any)
    )

    renderWithWrappers(<ProfessionStep />)

    expect(screen.getByLabelText("Profession")).toHaveAccessibilityValue("Curator")
  })
})
