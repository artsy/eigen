import { act, screen } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { Sentinel } from "app/utils/Sentinel"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"

jest.unmock("app/utils/Sentinel")

const mockOnChange = jest.fn()

const TestComponentWithSentinel = () => {
  return (
    <Sentinel onChange={mockOnChange}>
      <Text testID="child-content">Test Child</Text>
    </Sentinel>
  )
}

describe("Sentinel", () => {
  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it("renders child components", () => {
    renderWithWrappers(<TestComponentWithSentinel />)
    expect(screen.getByTestId("child-content")).toBeDefined()
  })

  describe("with IntersectionObserver", () => {
    const mockObserve = jest.fn()
    const mockDisconnect = jest.fn()
    let mockConstructor: jest.Mock
    let triggerIntersection: (isIntersecting: boolean) => void

    beforeEach(() => {
      mockObserve.mockClear()
      mockDisconnect.mockClear()
      mockConstructor = jest.fn((callback) => {
        triggerIntersection = (isIntersecting) =>
          callback([{ isIntersecting, intersectionRatio: isIntersecting ? 1 : 0 }])
        return { observe: mockObserve, unobserve: jest.fn(), disconnect: mockDisconnect }
      })
      global.IntersectionObserver = mockConstructor as any
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableIntersectionObserverSentinel: true })
    })

    afterEach(() => {
      global.IntersectionObserver = undefined
    })

    it("observes the view and reports visibility changes", () => {
      renderWithWrappers(<TestComponentWithSentinel />)

      expect(mockObserve).toHaveBeenCalledTimes(1)
      expect(mockConstructor).toHaveBeenCalledWith(expect.any(Function), { threshold: 1 })

      act(() => triggerIntersection(true))
      expect(mockOnChange).toHaveBeenLastCalledWith(true)

      act(() => triggerIntersection(false))
      expect(mockOnChange).toHaveBeenLastCalledWith(false)
    })

    it("uses a threshold of 0 when there are no children", () => {
      renderWithWrappers(<Sentinel onChange={mockOnChange} threshold={0.5} />)

      expect(mockConstructor).toHaveBeenCalledWith(expect.any(Function), { threshold: 0 })
    })

    it("disconnects the observer on unmount", () => {
      const { unmount } = renderWithWrappers(<TestComponentWithSentinel />)

      unmount()

      expect(mockDisconnect).toHaveBeenCalledTimes(1)
    })

    it("doesn't use IntersectionObserver when the feature flag is disabled", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableIntersectionObserverSentinel: false })

      renderWithWrappers(<TestComponentWithSentinel />)

      expect(mockConstructor).not.toHaveBeenCalled()
    })
  })
})
