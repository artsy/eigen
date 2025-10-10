import { Text } from "@artsy/palette-mobile"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { RouterLink, RouterLinkProps } from "app/system/navigation/RouterLink"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useEffect } from "react"
import { TouchableWithoutFeedback, View } from "react-native"

let mockIsNewArchitectureEnabled = false

jest.mock("app/utils/queryPrefetching", () => ({
  usePrefetch: () => mockPrefetch,
}))

jest.mock("app/utils/Sentinel", () => ({
  __esModule: true,
  Sentinel: (props: any) => <MockedVisibleSentinel {...props} />,
}))

jest.mock("app/utils/isNewArchitectureEnabled", () => ({
  get isNewArchitectureEnabled() {
    return mockIsNewArchitectureEnabled
  },
}))

describe("RouterLink", () => {
  const touchableOnPress = jest.fn()
  beforeAll(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({
      AREnableViewPortPrefetching: true,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const TestComponent = (props: Partial<RouterLinkProps>) => (
    <RouterLink to="/test-route" navigationProps={{ id: "test-id" }} {...props}>
      <Text>Test Link</Text>
    </RouterLink>
  )

  const TestTouchableComponent = (props: Partial<RouterLinkProps>) => {
    return (
      <RouterLink
        to="/test-route"
        navigationProps={{ id: "test-id" }}
        onPress={touchableOnPress}
        {...props}
      >
        <TouchableWithoutFeedback accessibilityRole="button">
          <Text>Test Link</Text>
        </TouchableWithoutFeedback>
      </RouterLink>
    )
  }

  it("renders", () => {
    renderWithWrappers(<TestComponent />)

    expect(screen.getByText("Test Link")).toBeDefined()
  })

  it("navigates to route on press (with prefetching)", async () => {
    renderWithWrappers(<TestComponent />)

    fireEvent.press(screen.getByText("Test Link"))

    expect(navigate).toHaveBeenCalledExactlyOnceWith("/test-route", {
      passProps: { id: "test-id" },
    })
  })

  it("navigates to route on press (without prefetching)", () => {
    renderWithWrappers(<TestComponent disablePrefetch />)

    fireEvent.press(screen.getByText("Test Link"))

    expect(navigate).toHaveBeenCalledExactlyOnceWith("/test-route", {
      passProps: { id: "test-id" },
    })
  })

  describe("with hasChildTouchable", () => {
    it("navigates and calls onPress on press", () => {
      renderWithWrappers(<TestTouchableComponent hasChildTouchable />)

      fireEvent.press(screen.getByText("Test Link"))

      expect(navigate).toHaveBeenCalled()
      expect(touchableOnPress).toHaveBeenCalled()
    })

    describe("when prefetching is disabled", () => {
      it("calls onPress, navigates and does not prefetch", () => {
        renderWithWrappers(<TestTouchableComponent hasChildTouchable disablePrefetch />)

        fireEvent.press(screen.getByText("Test Link"))

        expect(touchableOnPress).toHaveBeenCalled()
        expect(navigate).toHaveBeenCalled()

        expect(mockPrefetch).not.toHaveBeenCalled()
      })

      describe("when `to` is `undefined`", () => {
        it("calls onPress and does not navigate or prefetch", () => {
          renderWithWrappers(<TestTouchableComponent hasChildTouchable to={undefined} />)

          fireEvent.press(screen.getByText("Test Link"))

          expect(touchableOnPress).toHaveBeenCalled()

          expect(navigate).not.toHaveBeenCalled()
          expect(mockPrefetch).not.toHaveBeenCalled()
        })
      })
    })
  })

  describe("prefetching", () => {
    it("prefetches", async () => {
      renderWithWrappers(<TestComponent />)

      await waitFor(() => {
        expect(mockPrefetch).toHaveBeenCalledWith("/test-route", undefined, expect.any(Function))
      })
    })

    it("prefetches given prefetchVariables", async () => {
      renderWithWrappers(<TestComponent prefetchVariables={{ slug: "banksy" }} />)

      await waitFor(() => {
        expect(mockPrefetch).toHaveBeenCalledWith(
          "/test-route",
          { slug: "banksy" },
          expect.any(Function)
        )
      })
    })

    describe("when disablePrefetch is true", () => {
      renderWithWrappers(<TestComponent disablePrefetch />)

      it("does not prefetch", () => {
        expect(mockPrefetch).not.toHaveBeenCalledWith("/test-route", expect.any(Function))
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

    describe("when isNewArchitectureEnabled is true", () => {
      beforeAll(() => {
        mockIsNewArchitectureEnabled = true
      })

      afterAll(() => {
        mockIsNewArchitectureEnabled = false
      })

      it("does not prefetch", () => {
        renderWithWrappers(<TestComponent />)

        expect(mockPrefetch).not.toHaveBeenCalled()
      })
    })
  })
})

const mockPrefetch = jest.fn()
const MockedVisibleSentinel: React.FC<any> = ({ children, onChange }) => {
  useEffect(() => onChange(true), [])

  return <View>{children}</View>
}
