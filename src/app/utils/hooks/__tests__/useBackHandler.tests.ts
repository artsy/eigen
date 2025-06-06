import { renderHook } from "@testing-library/react-hooks"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { BackHandler } from "react-native"

jest.mock("react-native", () => ({
  BackHandler: {
    addEventListener: jest.fn(),
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
  const removeEventListenerMock = BackHandler.removeEventListener as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("useBackHandler", () => {
    it("should add back press listener on mount", () => {
      const handler = jest.fn()

      renderHook((props) => useBackHandler(props.handler), {
        initialProps: { handler },
      })

      expect(addEventListenerMock).toBeCalledTimes(1)
      expect(addEventListenerMock).toBeCalledWith("hardwareBackPress", handler)
    })

    it("should resubscribe when passed handler will change", () => {
      const handler = jest.fn()
      const handler2 = jest.fn()

      const { rerender } = renderHook((props) => useBackHandler(props.handler), {
        initialProps: { handler },
      })

      expect(addEventListenerMock).toBeCalledWith("hardwareBackPress", handler)

      rerender({ handler: handler2 })

      expect(removeEventListenerMock).toBeCalledWith("hardwareBackPress", handler)
      expect(addEventListenerMock).toBeCalledWith("hardwareBackPress", handler2)
    })

    it("should remove back press listener on unmount", () => {
      const handler = jest.fn()

      const { unmount } = renderHook((props) => useBackHandler(props.handler), {
        initialProps: { handler },
      })

      expect(removeEventListenerMock).toBeCalledTimes(0)

      unmount()

      expect(removeEventListenerMock).toBeCalledTimes(1)
      expect(removeEventListenerMock).toBeCalledWith("hardwareBackPress", handler)
    })
  })
})
