import { Text } from "@artsy/palette-mobile"
import { screen, waitFor } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { PrefetchableLink, PrefetchableLinkProps } from "app/system/navigation/PrefetchableLink"
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

describe("PrefetchableLink", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({
      AREnableViewPortPrefetching: true,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const TestComponent = (props: Partial<PrefetchableLinkProps>) => (
    <PrefetchableLink to="/test-route" {...props}>
      <Text>Test Link</Text>
    </PrefetchableLink>
  )

  it("renders", () => {
    renderWithWrappers(<TestComponent />)

    expect(screen.getByText("Test Link")).toBeDefined()
  })

  it("prefetches", async () => {
    renderWithWrappers(<TestComponent />)

    await waitFor(() => {
      expect(mockPrefetch).toHaveBeenCalledWith("/test-route", undefined)
    })
  })

  it("prefetches given prefetchVariables", async () => {
    renderWithWrappers(<TestComponent prefetchVariables={{ slug: "banksy" }} />)

    await waitFor(() => {
      expect(mockPrefetch).toHaveBeenCalledWith("/test-route", { slug: "banksy" })
    })
  })

  describe("when AREnableViewPortPrefetching is disabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableViewPortPrefetching: false,
      })
    })

    it("does not prefetch", async () => {
      renderWithWrappers(<TestComponent />)

      await waitFor(() => {
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
