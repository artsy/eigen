import { renderHook } from "@testing-library/react-native"
import { useEnableLiveHomeRecommendations } from "app/Scenes/HomeView/hooks/useEnableLiveHomeRecommendations"
import { useExperimentFlag } from "app/system/flags/hooks/useExperimentFlag"
import { useExperimentVariant } from "app/system/flags/hooks/useExperimentVariant"

jest.mock("app/system/flags/hooks/useExperimentFlag", () => ({
  useExperimentFlag: jest.fn(),
}))

jest.mock("app/system/flags/hooks/useExperimentVariant", () => ({
  useExperimentVariant: jest.fn(),
}))

const mockUseExperimentFlag = useExperimentFlag as jest.Mock
const mockUseExperimentVariant = useExperimentVariant as jest.Mock

const setup = ({
  gravityFlag,
  variantName,
  variantEnabled,
}: {
  gravityFlag: boolean
  variantName: string
  variantEnabled: boolean
}) => {
  mockUseExperimentFlag.mockImplementation((name: string) =>
    name === "onyx_artwork-recommendations-gravity" ? gravityFlag : false
  )
  mockUseExperimentVariant.mockReturnValue({
    variant: { name: variantName, enabled: variantEnabled },
    trackExperiment: jest.fn(),
  })

  return renderHook(() => useEnableLiveHomeRecommendations())
}

describe("useEnableLiveHomeRecommendations", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("enables the behavior only for the treatment arm when Gravity is ready", () => {
    const { result } = setup({ gravityFlag: true, variantName: "variant", variantEnabled: true })

    expect(result.current.enabled).toBe(true)
  })

  it("does not enable the behavior for the control arm", () => {
    const { result } = setup({ gravityFlag: true, variantName: "control", variantEnabled: true })

    expect(result.current.enabled).toBe(false)
  })

  it("is disabled when Gravity is not ready, even for the treatment arm", () => {
    const { result } = setup({ gravityFlag: false, variantName: "variant", variantEnabled: true })

    expect(result.current.enabled).toBe(false)
  })

  it("is disabled when the user has not been assigned a variant", () => {
    const { result } = setup({ gravityFlag: true, variantName: "disabled", variantEnabled: false })

    expect(result.current.enabled).toBe(false)
  })
})
