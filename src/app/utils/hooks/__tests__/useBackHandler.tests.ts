import { renderHook } from "@testing-library/react-native"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { BackHandler } from "react-native"

const mockRemove = jest.fn()
const mockSubscription = { remove: mockRemove }

jest.mock("react-native", () => ({
  BackHandler: {
    addEventListener: jest.fn(() => mockSubscription),
    removeEventListener: jest.fn(),
  },
  Platform: {
    OS: "ios",
    select: (obj: { ios: any; android: any }) => obj.ios,
  },
  NativeModules: {
    ArtsyNativeModule: {
      gitCommitShortHash: "1234567",
    },
  },
}))

describe("useBackHandler Hooks", () => {
  const addEventListenerMock = BackHandler.addEventListener as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("useBackHandler", () => {
    it("should add back press listener on mount", () => {
      const handler = jest.fn()

      renderHook((props) => useBackHandler(props.handler), {
        initialProps: { handler },
      })

      expect(addEventListenerMock).toHaveBeenCalledTimes(1)
      expect(addEventListenerMock).toHaveBeenCalledWith("hardwareBackPress", handler)
    })

    it("should resubscribe when passed handler will change", () => {
      const handler = jest.fn()
      const handler2 = jest.fn()

      const { rerender } = renderHook((props) => useBackHandler(props.handler), {
        initialProps: { handler },
      })

      expect(addEventListenerMock).toHaveBeenCalledWith("hardwareBackPress", handler)

      rerender({ handler: handler2 })

      expect(addEventListenerMock).toHaveBeenCalledWith("hardwareBackPress", handler2)
    })
  })
})
