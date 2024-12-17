import { Text } from "@artsy/palette-mobile"
import { fireEvent, screen } from "@testing-library/react-native"
import { RouterLink } from "app/Components/RouterLink"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useEffect } from "react"
import { View } from "react-native"

const mockPrefetch = jest.fn()
const MockedVisibleSentinel: React.FC<any> = ({ children, onVisible }) => {
  useEffect(() => onVisible(), [])

  return <View>{children}</View>
}

jest.mock("app/utils/queryPrefetching", () => ({
  usePrefetch: () => mockPrefetch,
}))
jest.mock("app/utils/ElementInView", () => ({
  ElementInView: (props: any) => <MockedVisibleSentinel {...props} />,
}))

describe("RouterLink", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const TestComponent = (props: any) => (
    <RouterLink to="/test-route" {...props}>
      <Text>Test Link</Text>
    </RouterLink>
  )

  it("renders", () => {
    renderWithWrappers(<TestComponent />)

    expect(screen.getByText("Test Link")).toBeDefined()
  })

  it("navigates to route on press", () => {
    renderWithWrappers(<TestComponent />)

    fireEvent.press(screen.getByText("Test Link"))

    expect(navigate).toHaveBeenCalledWith("/test-route", { passProps: undefined })
  })

  describe("prefetching", () => {
    it("prefetches ", () => {
      renderWithWrappers(<TestComponent />)

      expect(mockPrefetch).toHaveBeenCalledWith("/test-route")
    })

    describe("when disablePrefetch is true", () => {
      renderWithWrappers(<TestComponent disablePrefetch />)

      it("does not prefetch", () => {
        expect(mockPrefetch).not.toHaveBeenCalledWith("/test-route")
      })
    })
  })
})
