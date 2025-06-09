import { screen } from "@testing-library/react-native"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { useIsStaging } from "app/utils/hooks/useIsStaging"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/system/navigation/navigate", () => ({
  goBack: jest.fn(),
}))

jest.mock("app/utils/hooks/useDevToggle", () => ({
  useDevToggle: jest.fn(),
}))

jest.mock("app/utils/hooks/useIsStaging", () => ({
  useIsStaging: jest.fn(),
}))

describe("LoadFailureView", () => {
  const mockError = new Error("Test error message")
  const mockRetry = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useDevToggle as jest.Mock).mockReturnValue(false)
    ;(useIsStaging as jest.Mock).mockReturnValue(false)
  })

  it("renders basic error state", () => {
    renderWithWrappers(<LoadFailureView />)

    expect(screen.getByText("Unable to load")).toBeTruthy()
    expect(screen.getByText("Please try again")).toBeTruthy()
  })

  it("renders with retry function", () => {
    renderWithWrappers(<LoadFailureView error={mockError} onRetry={mockRetry} />)

    expect(screen.getByText("Unable to load")).toBeTruthy()
    expect(screen.getByText("Please try again")).toBeTruthy()
  })

  it("shows error message when in development environment", () => {
    // @ts-ignore
    const originalDev = global.__DEV__
    // @ts-ignore - Modifying readonly property for test
    global.__DEV__ = true

    renderWithWrappers(<LoadFailureView error={mockError} />)

    expect(screen.getByText("Error: Test error message")).toBeTruthy()

    // Restore original value
    // @ts-ignore - Modifying readonly property for test
    global.__DEV__ = originalDev
  })

  it("shows error message when in staging environment", () => {
    ;(useIsStaging as jest.Mock).mockReturnValue(true)

    renderWithWrappers(<LoadFailureView error={mockError} />)

    expect(screen.getByText("Error: Test error message")).toBeTruthy()
  })
})
