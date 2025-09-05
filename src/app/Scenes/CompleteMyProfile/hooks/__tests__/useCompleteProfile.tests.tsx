import { useNavigation, useRoute } from "@react-navigation/native"
import { act, renderHook } from "@testing-library/react-native"
import { useToast } from "app/Components/Toast/toastHook"
import { CompleteMyProfileStore } from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { useCompleteProfile } from "app/Scenes/CompleteMyProfile/hooks/useCompleteProfile"
import { goBack as ArtsyGoBack } from "app/system/navigation/navigate"
import { useUpdateMyProfile } from "app/utils/mutations/useUpdateMyProfile"

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}))

jest.mock("app/utils/mutations/useUpdateMyProfile", () => ({
  useUpdateMyProfile: jest.fn(),
}))

jest.mock("app/system/navigation/navigate", () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
}))

jest.mock("app/Components/Toast/toastHook", () => ({
  useToast: jest.fn(),
}))

jest.mock("app/Scenes/CompleteMyProfile/hooks/useCompleteMyProfileSteps", () => ({
  getNextRoute: jest.fn().mockReturnValue("ChangesSummary"),
}))

const steps = ["LocationStep", "AvatarStep", "ChangesSummary"]

describe("useCompleteProfile", () => {
  const state = {
    steps,
    isLoading: false,
    progressState: {},
    progressStateWithoutUndefined: {},
  }
  const mockNavigate = jest.fn()
  const mockGoBack = jest.fn()
  const mockShow = jest.fn()
  const setIsLoading = jest.fn()
  const useNavigationMock = useNavigation as jest.Mock
  const useRouteMock = useRoute as jest.Mock
  const commitMutationMock = jest.fn()
  const useUpdateMyProfileMock = useUpdateMyProfile as jest.Mock
  const useToastMock = useToast as jest.Mock
  jest
    .spyOn(CompleteMyProfileStore, "useStoreActions")
    .mockImplementation((callback) => callback({ setIsLoading } as any))

  beforeEach(() => {
    useNavigationMock.mockReturnValue({
      navigate: mockNavigate,
      goBack: mockGoBack,
      canGoBack: jest.fn().mockReturnValue(true),
    })
    useUpdateMyProfileMock.mockReturnValue([commitMutationMock, false])
    useRouteMock.mockReturnValue({ name: "LocationStep" })
    useToastMock.mockReturnValue({ show: mockShow })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should not navigate to next route if loading", () => {
    jest
      .spyOn(require("app/utils/mutations/useUpdateMyProfile"), "useUpdateMyProfile")
      .mockReturnValue([jest.fn(), true])
    jest
      .spyOn(CompleteMyProfileStore, "useStoreState")
      .mockImplementation((callback) => callback({ ...state, isLoading: true } as any))

    const { result } = renderHook(() => useCompleteProfile())

    act(() => {
      result.current.goNext()
    })

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it("should go back to the previous screen on goBack", () => {
    jest
      .spyOn(CompleteMyProfileStore, "useStoreState")
      .mockImplementation((callback) => callback(state as any))
    const { result } = renderHook(() => useCompleteProfile())

    act(() => {
      result.current.goBack()
    })

    expect(mockGoBack).toHaveBeenCalled()
  })

  it('should navigate back to "/my-profile" if cannot go back', () => {
    useNavigationMock.mockReturnValue({
      navigate: mockNavigate,
      goBack: mockGoBack,
      canGoBack: jest.fn().mockReturnValue(false),
    })
    jest
      .spyOn(CompleteMyProfileStore, "useStoreState")
      .mockImplementation((callback) => callback(state as any))

    const { result } = renderHook(() => useCompleteProfile())

    act(() => {
      result.current.goBack()
    })

    expect(ArtsyGoBack).toHaveBeenCalled()
  })

  it("should save and exit correctly", () => {
    const location = { city: "TestCity", state: "TestState" }
    jest
      .spyOn(CompleteMyProfileStore, "useStoreState")
      .mockImplementation((callback) =>
        callback({ ...state, progressStateWithoutUndefined: { location } } as any)
      )
    const { result } = renderHook(() => useCompleteProfile())

    act(() => {
      result.current.saveAndExit()
    })

    expect(setIsLoading).toHaveBeenCalledWith(true)
    expect(commitMutationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: {
            location,
          },
        },
      })
    )
  })

  it("should save and exit when submitting all the 4 steps data", () => {
    const location = { city: "TestCity", state: "TestState" }
    const progressStateWithoutUndefined = {
      location,
      profession: "Sales Rep",
      iconUrl: { localPath: "localPath", geminiUrl: "geminiUrl" },
      isIdentityVerified: true,
    }
    jest
      .spyOn(CompleteMyProfileStore, "useStoreState")
      .mockImplementation((callback) =>
        callback({ ...state, progressStateWithoutUndefined } as any)
      )
    const { result } = renderHook(() => useCompleteProfile())

    act(() => {
      result.current.saveAndExit()
    })

    expect(commitMutationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: {
            iconUrl: "geminiUrl",
            profession: "Sales Rep",
            location,
          },
        },
      })
    )
  })

  it("should show an error toast on updateProfile error", () => {
    jest
      .spyOn(CompleteMyProfileStore, "useStoreState")
      .mockImplementation((callback) =>
        callback({ ...state, progressStateWithoutUndefined: { profession: "Typer" } } as any)
      )

    const updateProfileMock = jest.fn().mockImplementation(({ onError }) => {
      onError(new Error("Test error"))
    })
    jest
      .spyOn(require("app/utils/mutations/useUpdateMyProfile"), "useUpdateMyProfile")
      .mockReturnValue([updateProfileMock, false])

    const { result } = renderHook(() => useCompleteProfile())

    act(() => {
      result.current.saveAndExit()
    })

    expect(mockShow).toHaveBeenCalledWith("An error occurred", "bottom")
  })

  it("should calculate progress correctly", () => {
    const { result } = renderHook(() => useCompleteProfile())

    expect(result.current.progress).toBe(50)
  })
})
