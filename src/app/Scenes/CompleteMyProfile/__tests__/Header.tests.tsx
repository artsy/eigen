import { screen, fireEvent } from "@testing-library/react-native"
import { Header } from "app/Scenes/CompleteMyProfile/Header"
import * as useCompleteProfile from "app/Scenes/CompleteMyProfile/hooks/useCompleteProfile"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
  useRoute: () => ({ name: "LocationStep" }),
}))

const stateMocked = {
  steps: ["LocationStep", "ProfessionStep", "AvatarStep"],
  progressStateWithoutUndefined: {},
}

jest.mock("app/Scenes/CompleteMyProfile/CompleteMyProfileProvider", () => ({
  CompleteMyProfileStore: {
    useStoreState: () => stateMocked,
  },
}))

describe("Header", () => {
  const mockSaveAndExit = jest.fn()

  ;(jest.spyOn(useCompleteProfile, "useCompleteProfile") as jest.SpyInstance<any>).mockReturnValue({
    currentStep: "1",
    lastStep: "3",
    progress: 75,
    saveAndExit: mockSaveAndExit,
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders correctly", () => {
    renderWithWrappers(<Header />)

    expect(screen.getByText("1 of 3")).toBeOnTheScreen()
    expect(screen.getByText("Save & Exit")).toBeOnTheScreen()
  })

  it("calls saveAndExit", () => {
    renderWithWrappers(<Header />)

    fireEvent.press(screen.getByText("Save & Exit"))

    expect(mockSaveAndExit).toHaveBeenCalledTimes(1)
  })
})
