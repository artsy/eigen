import { screen } from "@testing-library/react-native"
import { useEnableLiveHomeRecommendations } from "app/Scenes/HomeView/hooks/useEnableLiveHomeRecommendations"
import { useExperimentFlag } from "app/system/flags/hooks/useExperimentFlag"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"

jest.mock("app/system/flags/hooks/useExperimentFlag", () => ({
  useExperimentFlag: jest.fn(),
}))

const mockUseExperimentFlag = useExperimentFlag as jest.Mock

const TestComponent: React.FC = () => {
  const enabled = useEnableLiveHomeRecommendations()
  return <Text>{enabled ? "enabled" : "disabled"}</Text>
}

const isEnabled = ({
  eigenFlag,
  gravityFlag,
}: {
  eigenFlag: boolean
  gravityFlag: boolean
}): boolean => {
  mockUseExperimentFlag.mockImplementation((name: string) =>
    name === "onyx_artwork-recommendations-refresh-eigen" ? eigenFlag : gravityFlag
  )

  renderWithWrappers(<TestComponent />)
  return screen.queryByText("enabled") !== null
}

describe("useEnableLiveHomeRecommendations", () => {
  afterEach(() => {
    mockUseExperimentFlag.mockReset()
  })

  it("is enabled only when both Unleash flags are on", () => {
    expect(isEnabled({ eigenFlag: true, gravityFlag: true })).toBe(true)
  })

  it("is disabled when only the eigen flag is on", () => {
    expect(isEnabled({ eigenFlag: true, gravityFlag: false })).toBe(false)
  })

  it("is disabled when only the gravity flag is on", () => {
    expect(isEnabled({ eigenFlag: false, gravityFlag: true })).toBe(false)
  })

  it("is disabled when both flags are off", () => {
    expect(isEnabled({ eigenFlag: false, gravityFlag: false })).toBe(false)
  })
})
