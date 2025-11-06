import { Text } from "@artsy/palette-mobile"
import { screen } from "@testing-library/react-native"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const TestComponent: React.FC = () => {
  const isFeatureFlagEnabled = useFeatureFlag("AREnableFailingTestEcho")

  return (
    <>
      <Text>This is a test component</Text>
      {!isFeatureFlagEnabled && <Text>The failing test echo flag is enabled</Text>}
    </>
  )
}

describe("Failing test to test out echo eigen test integration", () => {
  it("This should pass and fail when we deploy echo", () => {
    renderWithWrappers(<TestComponent />)

    expect(screen.getByText("This is a test component")).toBeOnTheScreen()
    expect(screen.getByText("The failing test echo flag is enabled")).toBeOnTheScreen()
  })
})
