// useCompleteProfile.test.js
import { useNavigation, useRoute } from "@react-navigation/native"
import { renderHook, act } from "@testing-library/react-hooks"
import { waitFor } from "@testing-library/react-native"
import { useToast } from "app/Components/Toast/toastHook"
import {
  model,
  CompleteMyProfileStore,
} from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { useCompleteProfile } from "app/Scenes/CompleteMyProfile/hooks/useCompleteProfile"
import { useUpdateMyProfile } from "app/Scenes/CompleteMyProfile/hooks/useUpdateMyProfile"
import { navigate as artsyNavigate } from "app/system/navigation/navigate"
import { createContextStore } from "easy-peasy"

const Store = createContextStore({
  ...model,
  steps: ["LocationStep", "AvatarStep", "ChangesSummary"],
})

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}))

jest.mock("app/Scenes/CompleteMyProfile/hooks/useUpdateMyProfile", () => ({
  useUpdateMyProfile: jest.fn(),
}))

jest.mock("app/system/navigation/navigate", () => ({
  navigate: jest.fn(),
}))

jest.mock("app/Components/Toast/toastHook", () => ({
  useToast: jest.fn(),
}))

jest.mock("app/Scenes/CompleteMyProfile/hooks/useCompleteMyProfileSteps", () => ({
  getNextRoute: jest.fn().mockReturnValue("ChangesSummary"),
}))

// jest.mock("app/Scenes/CompleteMyProfile/CompleteMyProfileProvider", () => ({
//   ...jest.requireActual("app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"),
//   CompleteMyProfileStore: Store,
// }))

describe("useCompleteProfile", () => {
  const mockNavigate = jest.fn()
  const mockGoBack = jest.fn()
  const mockShow = jest.fn()
  const useNavigationMock = useNavigation as jest.Mock
  const useRouteMock = useRoute as jest.Mock
  const commitMutationMock = jest.fn()
  const useUpdateMyProfileMock = useUpdateMyProfile as jest.Mock
  const useToastMock = useToast as jest.Mock
  jest.spyOn(CompleteMyProfileStore, "useStoreState").mockImplementation(Store.useStoreState as any)
  jest
    .spyOn(CompleteMyProfileStore, "useStoreActions")
    .mockImplementation(Store.useStoreActions as any)

  const wrapper = ({ children }: any) => <Store.Provider>{children}</Store.Provider>

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

  it("should initialize field state correctly", async () => {
    const { result } = renderHook(() => useCompleteProfile(), { wrapper })

    await waitFor(() => expect(result.current.field).toBeUndefined())
  })

  it("should set field state and navigate to next route on goNext", () => {
    const { result } = renderHook(() => useCompleteProfile(), { wrapper })

    act(() => {
      result.current.setField("TestField")
      result.current.goNext()
    })

    expect(result.current.field).toBe("TestField")
    expect(mockNavigate).toHaveBeenCalled()
  })

  it("should not navigate to next route if loading", () => {
    jest
      .spyOn(require("app/Scenes/CompleteMyProfile/hooks/useUpdateMyProfile"), "useUpdateMyProfile")
      .mockReturnValue([jest.fn(), true])

    const { result } = renderHook(() => useCompleteProfile(), { wrapper })

    act(() => {
      result.current.goNext()
    })

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it("should go back to the previous screen on goBack", () => {
    const { result } = renderHook(() => useCompleteProfile(), { wrapper })

    act(() => {
      result.current.goBack()
    })

    expect(mockGoBack).toHaveBeenCalled()
  })

  it('should navigate to "/my-profile" if cannot go back', () => {
    useNavigationMock.mockReturnValue({
      navigate: mockNavigate,
      goBack: mockGoBack,
      canGoBack: jest.fn().mockReturnValue(false),
    })

    const { result } = renderHook(() => useCompleteProfile(), { wrapper })

    act(() => {
      result.current.goBack()
    })

    expect(artsyNavigate).toHaveBeenCalledWith("/my-profile")
  })

  it("should save and exit correctly", () => {
    const location = { city: "TestCity", state: "TestState" }
    const { result } = renderHook(() => useCompleteProfile(), { wrapper })

    act(() => {
      result.current.setField(location)
    })

    expect(result.current.field).toMatchObject(location)

    act(() => {
      result.current.saveAndExit()
    })

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

  it("should save and exit when submitting with a field change but no update to the context yet", async () => {
    const location = { city: "TestCity", state: "TestState" }
    const { result, rerender } = renderHook(() => useCompleteProfile(), { wrapper })

    act(() => {
      result.current.setField(location)
    })

    await waitFor(() => expect(result.current.field).toBe(location))

    act(() => {
      result.current.goNext()
    })

    act(() => {
      useRouteMock.mockReturnValue({ name: "ProfessionStep" })
    })

    await (() => expect(result.current.nextRoute).toBe("AvatarStep"))
    rerender()

    act(() => {
      result.current.setField("Sales Rep")
    })

    await waitFor(() => expect(result.current.field).toBe("Sales Rep"))

    act(() => {
      result.current.saveAndExit()
    })

    expect(commitMutationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: {
            location,
            profession: "Sales Rep",
          },
        },
      })
    )
  })

  it("should save and exit when submitting all the 4 steps data", async () => {
    const location = { city: "TestCity", state: "TestState" }
    const { result, rerender } = renderHook(() => useCompleteProfile(), { wrapper })

    act(() => {
      result.current.setField(location)
    })

    await waitFor(() => expect(result.current.field).toBe(location))

    act(() => {
      result.current.goNext()
      useRouteMock.mockReturnValue({ name: "ProfessionStep" })
    })

    await (() => expect(result.current.nextRoute).toBe("AvatarStep"))
    rerender()

    act(() => {
      result.current.setField("Sales Rep")
    })

    await waitFor(() => expect(result.current.field).toBe("Sales Rep"))

    act(() => {
      result.current.goNext()
      useRouteMock.mockReturnValue({ name: "AvatarStep" })
    })

    await (() => expect(result.current.nextRoute).toBe("isIdentityVerifiedStep"))
    rerender()

    act(() => {
      result.current.setField({ localPath: "localPath", geminiUrl: "geminiUrl" })
    })

    act(() => {
      result.current.goNext()
      useRouteMock.mockReturnValue({ name: "IdentityVerificationStep" })
    })

    await (() => expect(result.current.nextRoute).toBe("ChangesSummary"))
    rerender()

    act(() => {
      result.current.setField(true)
    })

    await waitFor(() => expect(result.current.field).toBe(true))

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
    const updateProfileMock = jest.fn().mockImplementation(({ onError }) => {
      onError(new Error("Test error"))
    })
    jest
      .spyOn(require("app/Scenes/CompleteMyProfile/hooks/useUpdateMyProfile"), "useUpdateMyProfile")
      .mockReturnValue([updateProfileMock, false])

    const { result } = renderHook(() => useCompleteProfile(), { wrapper })

    act(() => {
      result.current.saveAndExit()
    })

    expect(mockShow).toHaveBeenCalledWith("An error occurred", "bottom")
  })

  it("should calculate progress correctly", () => {
    const { result } = renderHook(() => useCompleteProfile(), { wrapper })

    expect(result.current.progress).toBe(50)
  })
})
