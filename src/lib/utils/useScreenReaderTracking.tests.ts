import { renderHook } from "@testing-library/react-hooks"
import { SegmentTrackingProvider } from "./track/SegmentTrackingProvider"
import { useScreenReaderTracking } from "./useScreenReaderTracking"

jest.mock("react-native", () => ({
  AccessibilityInfo: { isScreenReaderEnabled: jest.fn().mockResolvedValue(true) },
}))

import { AccessibilityInfo } from "react-native"
import { useEffect, useRef, useState } from "react"

const isEnabled = (v) => new Promise((res, rej) => setTimeout(() => res(v), 100))

const useTest = () => {
  const [a, setA] = useState(1)
  useEffect(() => {
    const doIt = async () => {
      const b = await isEnabled(3)
      setA(b)
    }
    doIt()
  }, [])
  return a
}

const useSequence = (values: string[], intervalMs = 50) => {
  const [first, ...otherValues] = values
  const [value, setValue] = useState(() => first)
  const index = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(otherValues[index.current++])
      if (index.current >= otherValues.length) {
        clearInterval(interval)
      }
    }, intervalMs)
    return () => {
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, otherValues)

  return value
}

describe("useScreenReaderTracking", () => {
  xit("works", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useTest())
    expect(result.current).toBe(1)
    await waitForNextUpdate()
    expect(result.current).toBe(2)
  })
  test("should wait for next update", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSequence(["first", "second"]))

    expect(result.current).toBe("first")

    await waitForNextUpdate()

    expect(result.current).toBe("second")
  })

  test("should wait for multiple updates", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSequence(["first", "second", "third"]))

    expect(result.current).toBe("first")

    await waitForNextUpdate()

    expect(result.current).toBe("second")

    await waitForNextUpdate()

    expect(result.current).toBe("third")
  })

  xit("Should track the status of the screen reader of a user", async () => {
    expect(await AccessibilityInfo.isScreenReaderEnabled()).toBe(true)

    const { waitForNextUpdate, waitFor } = renderHook(() => useScreenReaderTracking())

    // await waitForNextUpdate({ timeout: 4000 })

    await waitFor(() => expect(SegmentTrackingProvider.identify).toHaveBeenCalledTimes(1))
    // expect(SegmentTrackingProvider.identify).toHaveBeenCalledWith(null, { "screen reader status": "disabled" })
  })
})
