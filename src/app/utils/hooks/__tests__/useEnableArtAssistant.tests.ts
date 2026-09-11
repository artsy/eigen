import { renderHook } from "@testing-library/react-native"
import { useExperimentFlag } from "app/system/flags/hooks/useExperimentFlag"
import { useEnableArtAssistant } from "app/utils/hooks/useEnableArtAssistant"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

jest.mock("app/system/flags/hooks/useExperimentFlag", () => ({
  useExperimentFlag: jest.fn(),
}))

jest.mock("app/utils/hooks/useFeatureFlag", () => ({
  useFeatureFlag: jest.fn(),
}))

describe("useEnableArtAssistant", () => {
  it.each([
    { echo: false, unleash: false, expected: false },
    { echo: false, unleash: true, expected: false },
    { echo: true, unleash: false, expected: false },
    { echo: true, unleash: true, expected: true },
  ])(
    "returns $expected when Echo is $echo and Unleash is $unleash",
    ({ echo, unleash, expected }) => {
      jest.mocked(useFeatureFlag).mockReturnValue(echo)
      jest.mocked(useExperimentFlag).mockReturnValue(unleash)

      const { result } = renderHook(() => useEnableArtAssistant())

      expect(result.current).toBe(expected)
      expect(useFeatureFlag).toHaveBeenCalledWith("AREnableArtAssistant")
      expect(useExperimentFlag).toHaveBeenCalledWith("onyx_art-assistant-app")
    }
  )
})
