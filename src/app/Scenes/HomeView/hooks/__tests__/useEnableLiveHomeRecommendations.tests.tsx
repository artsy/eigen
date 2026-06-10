import { screen } from "@testing-library/react-native"
import { useFlag } from "@unleash/proxy-client-react"
import { useEnableLiveHomeRecommendations } from "app/Scenes/HomeView/hooks/useEnableLiveHomeRecommendations"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"

const mockUseFlag = useFlag as jest.Mock

const TestComponent: React.FC = () => {
  const enabled = useEnableLiveHomeRecommendations()
  return <Text>{enabled ? "enabled" : "disabled"}</Text>
}

const isEnabled = ({
  featureFlag,
  unleashFlag,
}: {
  featureFlag: boolean
  unleashFlag: boolean
}): boolean => {
  __globalStoreTestUtils__?.injectFeatureFlags({ AREnableLiveHomeRecommendations: featureFlag })
  mockUseFlag.mockReturnValue(unleashFlag)

  renderWithWrappers(<TestComponent />)
  return screen.queryByText("enabled") !== null
}

describe("useEnableLiveHomeRecommendations", () => {
  afterEach(() => {
    mockUseFlag.mockReturnValue(false)
  })

  it("is enabled only when both the feature flag and the Unleash flag are on", () => {
    expect(isEnabled({ featureFlag: true, unleashFlag: true })).toBe(true)
  })

  it("is disabled when only the feature flag is on", () => {
    expect(isEnabled({ featureFlag: true, unleashFlag: false })).toBe(false)
  })

  it("is disabled when only the Unleash flag is on", () => {
    expect(isEnabled({ featureFlag: false, unleashFlag: true })).toBe(false)
  })

  it("is disabled when both flags are off", () => {
    expect(isEnabled({ featureFlag: false, unleashFlag: false })).toBe(false)
  })
})
