import { act, renderHook } from "@testing-library/react-native"
import {
  hasPendingItinerarySave,
  isItineraryDeleted,
  markItineraryDeleted,
  queueItinerarySave,
  useHasPendingItinerarySave,
} from "app/Scenes/CityGuide/utils/itinerarySaveQueue"

const deferred = () => {
  let resolve: () => void = () => {}
  let reject: (error: Error) => void = () => {}
  const promise = new Promise<void>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

describe("itinerarySaveQueue", () => {
  it("runs saves for the same itinerary one after another", async () => {
    const first = deferred()
    const order: string[] = []

    queueItinerarySave("queue-1", async () => {
      order.push("first started")
      await first.promise
      order.push("first finished")
    })
    const done = queueItinerarySave("queue-1", async () => {
      order.push("second started")
    })

    await Promise.resolve()
    expect(order).toEqual(["first started"])

    first.resolve()
    await done

    expect(order).toEqual(["first started", "first finished", "second started"])
  })

  it("doesn't hold up saves for another itinerary", async () => {
    const second = jest.fn(() => Promise.resolve())

    queueItinerarySave("queue-2", () => new Promise(() => {}))
    await queueItinerarySave("queue-3", second)

    expect(second).toHaveBeenCalled()
  })

  it("runs the next save after a failed one", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {})
    const second = jest.fn(() => Promise.resolve())

    queueItinerarySave("queue-4", () => Promise.reject(new Error("failed")))
    await queueItinerarySave("queue-4", second)

    expect(second).toHaveBeenCalled()
  })

  it("tells a save whether a newer one was queued after it", async () => {
    const first = deferred()
    const latest: boolean[] = []

    queueItinerarySave("queue-5", async (isLatest) => {
      latest.push(isLatest())
      await first.promise
      latest.push(isLatest())
    })
    await Promise.resolve()
    const done = queueItinerarySave("queue-5", async (isLatest) => {
      latest.push(isLatest())
    })

    first.resolve()
    await done

    expect(latest).toEqual([true, false, true])
  })

  it("reports a pending save until the queue empties", async () => {
    const first = deferred()
    const { result } = renderHook(() => useHasPendingItinerarySave("queue-6"))

    expect(result.current).toBe(false)

    let done: Promise<void> = Promise.resolve()
    act(() => {
      done = queueItinerarySave("queue-6", () => first.promise)
    })

    expect(result.current).toBe(true)
    expect(hasPendingItinerarySave("queue-6")).toBe(true)

    await act(async () => {
      first.resolve()
      await done
    })

    expect(result.current).toBe(false)
    expect(hasPendingItinerarySave("queue-6")).toBe(false)
  })

  it("remembers deleted itineraries", () => {
    expect(isItineraryDeleted("queue-7")).toBe(false)

    markItineraryDeleted("queue-7")

    expect(isItineraryDeleted("queue-7")).toBe(true)
  })
})
