import { renderHook } from "@testing-library/react-hooks"
import { useEventTiming } from "app/utils/useEventTiming"
import { DateTime } from "luxon"

type Time = Partial<{
  day: number
  hours: number
  minutes: number
  seconds: number
}>

interface WrapperProps {
  currentTime: Time
  startAt: Time
  endAt: Time
}

const makeObj = ({ currentTime, startAt, endAt }: WrapperProps) => ({
  currentTime: DateTime.fromObject({
    year: 2000,
    ...currentTime,
  }).toISO(),
  startAt: DateTime.fromObject({
    year: 2000,
    ...startAt,
  }).toISO(),
  endAt: DateTime.fromObject({
    year: 2000,
    ...endAt,
  }).toISO(),
})

describe("useEventTiming", () => {
  it("returns 'Closed' when everything defaults to now", () => {
    const { result } = renderHook(() =>
      useEventTiming(
        makeObj({
          currentTime: { seconds: 0 },
          startAt: { seconds: 0 },
          endAt: { seconds: 0 },
        })
      )
    )
    expect(result.current).toStrictEqual({
      closesSoon: false,
      closesToday: false,
      daysTilEnd: 0,
      hoursTillEnd: 0,
      durationTilEnd: "PT0S",
      formattedTime: "Closed",
      hasEnded: true,
      hasStarted: false,
      hours: "00",
      minutes: "00",
      seconds: "00",
      secondsTilEnd: 0,
    })
  })

  it("returns the correct values if the event is already over", () => {
    const { result } = renderHook(() =>
      useEventTiming(
        makeObj({
          currentTime: { seconds: 21 },
          startAt: { seconds: 0 },
          endAt: { seconds: 20 },
        })
      )
    )
    expect(result.current).toStrictEqual({
      closesSoon: false,
      closesToday: false,
      daysTilEnd: -0.000011574074074074073,
      hoursTillEnd: -0.0002777777777777778,
      durationTilEnd: "PT-1S",
      formattedTime: "Closed",
      hasEnded: true,
      hasStarted: true,
      hours: "00",
      minutes: "00",
      seconds: "00",
      secondsTilEnd: -1,
    })
  })

  it("returns the correct value if the event is opening soon", () => {
    const { result } = renderHook(() =>
      useEventTiming(
        makeObj({
          currentTime: { seconds: 0 },
          startAt: { seconds: 10 },
          endAt: { seconds: 20 },
        })
      )
    )
    expect(result.current).toStrictEqual({
      closesSoon: false,
      closesToday: true,
      daysTilEnd: 0.0002314814814814815,
      hoursTillEnd: 0.005555555555555556,
      durationTilEnd: "PT20S",
      formattedTime: "Opening Soon",
      hasEnded: false,
      hasStarted: false,
      hours: "00",
      minutes: "00",
      seconds: "20",
      secondsTilEnd: 20,
    })
  })

  it("returns the correct values if the event is ending soon", () => {
    const { result } = renderHook(() =>
      useEventTiming(
        makeObj({
          currentTime: { seconds: 10 },
          startAt: { seconds: 0 },
          endAt: { day: 2, seconds: 10 },
        })
      )
    )
    expect(result.current).toStrictEqual({
      closesSoon: true,
      closesToday: false,
      daysTilEnd: 1,
      hoursTillEnd: 24,
      durationTilEnd: "PT86400S",
      formattedTime: "Closes in 1 day",
      hasEnded: false,
      hasStarted: true,
      hours: "00",
      minutes: "00",
      seconds: "00",
      secondsTilEnd: 86400,
    })
  })

  it("returns the correct values if the event is ending today", () => {
    const { result } = renderHook(() =>
      useEventTiming(
        makeObj({
          currentTime: { seconds: 10 },
          startAt: { seconds: 0 },
          endAt: { seconds: 20 },
        })
      )
    )
    expect(result.current).toStrictEqual({
      closesSoon: false,
      closesToday: true,
      daysTilEnd: 0.00011574074074074075,
      hoursTillEnd: 0.002777777777777778,
      durationTilEnd: "PT10S",
      formattedTime: "Closes in 00 : 00 : 10",
      hasEnded: false,
      hasStarted: true,
      hours: "00",
      minutes: "00",
      seconds: "10",
      secondsTilEnd: 10,
    })
  })
})
