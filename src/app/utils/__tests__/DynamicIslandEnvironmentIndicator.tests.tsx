import { screen } from "@testing-library/react-native"
import { DynamicIslandEnvironmentIndicator } from "app/utils/DynamicIslandStagingIndicator"
import { useEnvironmentColor } from "app/utils/hooks/useEnvironmentColor"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Platform, StyleSheet, useWindowDimensions } from "react-native"
import DeviceInfo from "react-native-device-info"

jest.mock("app/utils/hooks/useEnvironmentColor", () => ({
  useEnvironmentColor: jest.fn(),
}))

const mockInsets = { top: 0, bottom: 0, left: 0, right: 0 }
jest.mock("react-native-safe-area-context", () => ({
  ...jest.requireActual("react-native-safe-area-context/jest/mock").default,
  useSafeAreaInsets: () => mockInsets,
}))

jest.mock("react-native-screens", () => ({
  FullWindowOverlay: ({ children }: { children: React.ReactNode }) => children,
}))

jest.mock("react-native/Libraries/Utilities/useWindowDimensions", () => ({
  __esModule: true,
  default: jest.fn(),
}))

const mockUseEnvironmentColor = useEnvironmentColor as jest.Mock

describe("DynamicIslandEnvironmentIndicator", () => {
  beforeEach(() => {
    Platform.OS = "ios"
    mockInsets.top = 62
    mockUseEnvironmentColor.mockReturnValue("orange100")
    ;(useWindowDimensions as jest.Mock).mockReturnValue({ width: 402, height: 874 })
    DeviceInfo.getDeviceId = jest.fn(() => "iPhone18,1")
  })

  it("renders nothing outside staging and previews", () => {
    mockUseEnvironmentColor.mockReturnValue(null)
    renderWithWrappers(<DynamicIslandEnvironmentIndicator />)

    expect(screen.queryByTestId("EnvironmentIndicatorRing")).not.toBeOnTheScreen()
  })

  it("rings the Dynamic Island, placed from the top inset", () => {
    renderWithWrappers(<DynamicIslandEnvironmentIndicator />)

    const ring = screen.getByTestId("EnvironmentIndicatorRing")
    expect(StyleSheet.flatten(ring.props.style).top).toBeCloseTo(12.83)
    expect(ring).toHaveStyle({ left: 136.5, width: 129, backgroundColor: "#DA6722" })
  })

  it("uses the known island width of models that differ", () => {
    DeviceInfo.getDeviceId = jest.fn(() => "iPhone19,2")
    renderWithWrappers(<DynamicIslandEnvironmentIndicator />)

    expect(screen.getByTestId("EnvironmentIndicatorRing")).toHaveStyle({ left: 151.5, width: 99 })
  })

  it("uses the staging colour", () => {
    mockUseEnvironmentColor.mockReturnValue("devpurple")
    renderWithWrappers(<DynamicIslandEnvironmentIndicator />)

    expect(screen.getByTestId("EnvironmentIndicatorRing")).toHaveStyle({
      backgroundColor: "#6E1EFF",
    })
  })

  it("renders nothing on iPhones without a Dynamic Island", () => {
    mockInsets.top = 47
    renderWithWrappers(<DynamicIslandEnvironmentIndicator />)

    expect(screen.queryByTestId("EnvironmentIndicatorRing")).not.toBeOnTheScreen()
  })

  it("renders nothing on Android", () => {
    Platform.OS = "android"
    renderWithWrappers(<DynamicIslandEnvironmentIndicator />)

    expect(screen.queryByTestId("EnvironmentIndicatorRing")).not.toBeOnTheScreen()
  })
})
