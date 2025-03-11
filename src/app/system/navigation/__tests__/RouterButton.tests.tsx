import { Text } from "@artsy/palette-mobile"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { RouterButton, RouterButtonProps } from "app/system/navigation/RouterButton"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useEffect } from "react"
import { View } from "react-native"

jest.mock("app/utils/queryPrefetching", () => ({
  usePrefetch: () => mockPrefetch,
}))

jest.mock("app/utils/Sentinel", () => ({
  __esModule: true,
  Sentinel: (props: any) => <MockedVisibleSentinel {...props} />,
}))

describe("RouterButton", () => {
  beforeAll(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({
      AREnableViewPortPrefetching: true,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const TestComponent = (props: Partial<RouterButtonProps>) => (
    <RouterButton to="/test-route" navigationProps={{ id: "test-id" }} {...props}>
      <Text>Test Button</Text>
    </RouterButton>
  )

  it("renders", () => {
    renderWithWrappers(<TestComponent />)

    expect(screen.getByText("Test Button")).toBeDefined()
  })

  it("navigates to route on press (with prefetching)", async () => {
    renderWithWrappers(<TestComponent />)

    fireEvent.press(screen.getByText("Test Button"))

    expect(navigate).toHaveBeenCalledWith("/test-route", {
      passProps: { id: "test-id" },
    })
  })

  it("navigates to route on press (without prefetching)", () => {
    renderWithWrappers(<TestComponent disablePrefetch />)

    fireEvent.press(screen.getByText("Test Button"))

    expect(navigate).toHaveBeenCalledExactlyOnceWith("/test-route", {
      passProps: { id: "test-id" },
    })
  })

  it("calls onPress on press", () => {
    const onPress = jest.fn()
    renderWithWrappers(<TestComponent onPress={onPress} />)

    fireEvent.press(screen.getByText("Test Button"))

    expect(onPress).toHaveBeenCalledExactlyOnceWith()
  })

  describe("prefetching", () => {
    it("prefetches", async () => {
      renderWithWrappers(<TestComponent />)

      await waitFor(() => {
        expect(mockPrefetch).toHaveBeenCalledWith("/test-route", undefined)
      })
    })

    describe("when disablePrefetch is true", () => {
      renderWithWrappers(<TestComponent disablePrefetch />)

      it("does not prefetch", () => {
        expect(mockPrefetch).not.toHaveBeenCalledWith("/test-route")
      })
    })

    describe("when AREnableViewPortPrefetching is disabled", () => {
      beforeAll(() => {
        __globalStoreTestUtils__?.injectFeatureFlags({
          AREnableViewPortPrefetching: false,
        })
      })

      renderWithWrappers(<TestComponent disablePrefetch />)

      it("does not prefetch", () => {
        expect(mockPrefetch).not.toHaveBeenCalledWith("/test-route")
      })
    })
  })
})

const mockPrefetch = jest.fn()
const MockedVisibleSentinel: React.FC<any> = ({ children, onChange }) => {
  useEffect(() => onChange(true), [])

  return <View>{children}</View>
}
