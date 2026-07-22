import { renderHook } from "@testing-library/react-native"
import {
  NEW_WORKS_FOR_YOU_SECTION_ID,
  RECOMMENDED_ARTWORKS_SECTION_ID,
  useEnableLiveHomeRecommendations,
  useEnableLiveNewWorksForYou,
  useLiveHomeViewSectionIDs,
} from "app/Scenes/HomeView/hooks/useLiveHomeViewSectionIDs"
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

type Variant = { name: string; enabled: boolean }

const DISABLED: Variant = { name: "disabled", enabled: false }

const setupFlags = ({
  gravity = true,
  wtyl = DISABLED,
  nwfy = DISABLED,
}: {
  gravity?: boolean
  wtyl?: Variant
  nwfy?: Variant
}) => {
  mockUseExperimentFlag.mockImplementation((name: string) =>
    name === "onyx_artwork-recommendations-gravity" ? gravity : false
  )
  mockUseExperimentVariant.mockImplementation((name: string) => {
    const variant =
      name === "onyx_artwork-recommendations-refresh-eigen"
        ? wtyl
        : name === "onyx_nwfy-refresh-eigen"
          ? nwfy
          : DISABLED
    return { variant, trackExperiment: jest.fn() }
  })
}

describe("useEnableLiveHomeRecommendations", () => {
  afterEach(() => jest.clearAllMocks())

  it("enables the behavior only for the treatment arm when Gravity is ready", () => {
    setupFlags({ gravity: true, wtyl: { name: "variant", enabled: true } })

    const { result } = renderHook(() => useEnableLiveHomeRecommendations())

    expect(result.current.enabled).toBe(true)
  })

  it("does not enable the behavior for the control arm", () => {
    setupFlags({ gravity: true, wtyl: { name: "control", enabled: true } })

    const { result } = renderHook(() => useEnableLiveHomeRecommendations())

    expect(result.current.enabled).toBe(false)
  })

  it("is disabled when Gravity is not ready, even for the treatment arm", () => {
    setupFlags({ gravity: false, wtyl: { name: "variant", enabled: true } })

    const { result } = renderHook(() => useEnableLiveHomeRecommendations())

    expect(result.current.enabled).toBe(false)
  })

  it("is disabled when the user has not been assigned a variant", () => {
    setupFlags({ gravity: true, wtyl: DISABLED })

    const { result } = renderHook(() => useEnableLiveHomeRecommendations())

    expect(result.current.enabled).toBe(false)
  })
})

describe("useEnableLiveNewWorksForYou", () => {
  afterEach(() => jest.clearAllMocks())

  it("enables the behavior only for the experiment arm", () => {
    setupFlags({ nwfy: { name: "experiment", enabled: true } })

    const { result } = renderHook(() => useEnableLiveNewWorksForYou())

    expect(result.current.enabled).toBe(true)
  })

  it("does not enable the behavior for the control arm", () => {
    setupFlags({ nwfy: { name: "control", enabled: true } })

    const { result } = renderHook(() => useEnableLiveNewWorksForYou())

    expect(result.current.enabled).toBe(false)
  })

  it("is disabled when Gravity is not ready, even for the experiment arm", () => {
    setupFlags({ gravity: false, nwfy: { name: "experiment", enabled: true } })

    const { result } = renderHook(() => useEnableLiveNewWorksForYou())

    expect(result.current.enabled).toBe(false)
  })

  it("is disabled when the user has not been assigned a variant", () => {
    setupFlags({ nwfy: DISABLED })

    const { result } = renderHook(() => useEnableLiveNewWorksForYou())

    expect(result.current.enabled).toBe(false)
  })
})

describe("useLiveHomeViewSectionIDs", () => {
  afterEach(() => jest.clearAllMocks())

  const TREATMENT_WTYL: Variant = { name: "variant", enabled: true }
  const TREATMENT_NWFY: Variant = { name: "experiment", enabled: true }

  it("returns no section IDs when both experiments are off", () => {
    setupFlags({ wtyl: DISABLED, nwfy: DISABLED })

    const { result } = renderHook(() => useLiveHomeViewSectionIDs())

    expect(result.current).toEqual([])
  })

  it("returns only WTYL when only its experiment is on", () => {
    setupFlags({ wtyl: TREATMENT_WTYL, nwfy: DISABLED })

    const { result } = renderHook(() => useLiveHomeViewSectionIDs())

    expect(result.current).toEqual([RECOMMENDED_ARTWORKS_SECTION_ID])
  })

  it("returns only NWFY when only its experiment is on", () => {
    setupFlags({ wtyl: DISABLED, nwfy: TREATMENT_NWFY })

    const { result } = renderHook(() => useLiveHomeViewSectionIDs())

    expect(result.current).toEqual([NEW_WORKS_FOR_YOU_SECTION_ID])
  })

  it("returns both when both experiments are on", () => {
    setupFlags({ wtyl: TREATMENT_WTYL, nwfy: TREATMENT_NWFY })

    const { result } = renderHook(() => useLiveHomeViewSectionIDs())

    expect(result.current).toEqual([RECOMMENDED_ARTWORKS_SECTION_ID, NEW_WORKS_FOR_YOU_SECTION_ID])
  })
})
