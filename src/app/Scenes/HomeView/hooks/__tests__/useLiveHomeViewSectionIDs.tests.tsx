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
  wtylGravity = gravity,
  nwfyGravity = gravity,
  wtyl = DISABLED,
  nwfy = DISABLED,
}: {
  // Convenience default for both gravity flags; override per-couple with wtylGravity / nwfyGravity.
  gravity?: boolean
  wtylGravity?: boolean
  nwfyGravity?: boolean
  wtyl?: Variant
  nwfy?: Variant
}) => {
  mockUseExperimentFlag.mockImplementation((name: string) => {
    // Each rail is gated by its own gravity flag, coupled with its own refresh experiment:
    //   WTYL: onyx_artwork-recommendations-gravity + onyx_artwork-recommendations-refresh-eigen
    //   NWFY: onyx_nwfy-gravity + onyx_nwfy-refresh-eigen
    if (name === "onyx_artwork-recommendations-gravity") return wtylGravity
    if (name === "onyx_nwfy-gravity") return nwfyGravity
    return false
  })
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

  it("is disabled when its Gravity flag is not ready, even for the treatment arm", () => {
    // WTYL's own gravity off, NWFY's gravity on — WTYL must still be disabled.
    setupFlags({ wtylGravity: false, nwfyGravity: true, wtyl: { name: "variant", enabled: true } })

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

  it("is disabled when its Gravity flag is not ready, even for the experiment arm", () => {
    // NWFY's own gravity off, WTYL's gravity on — NWFY must still be disabled.
    setupFlags({
      nwfyGravity: false,
      wtylGravity: true,
      nwfy: { name: "experiment", enabled: true },
    })

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

  it("requires each rail's own gravity flag — one couple's gravity does not enable the other", () => {
    // Both refresh experiments in their enabled arm, but only WTYL's gravity flag is on.
    setupFlags({
      wtylGravity: true,
      nwfyGravity: false,
      wtyl: TREATMENT_WTYL,
      nwfy: TREATMENT_NWFY,
    })

    const { result } = renderHook(() => useLiveHomeViewSectionIDs())

    // Only WTYL goes live; NWFY stays off because onyx_nwfy-gravity is off.
    expect(result.current).toEqual([RECOMMENDED_ARTWORKS_SECTION_ID])
  })

  it("does not enable a rail from gravity alone without its refresh experiment", () => {
    // Both gravity flags on, but neither refresh experiment is in its enabled arm.
    setupFlags({ wtylGravity: true, nwfyGravity: true, wtyl: DISABLED, nwfy: DISABLED })

    const { result } = renderHook(() => useLiveHomeViewSectionIDs())

    expect(result.current).toEqual([])
  })
})
