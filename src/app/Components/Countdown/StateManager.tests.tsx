// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import moment from "moment"
import React from "react"
import { StateManager } from "./StateManager"

describe("StateManager", () => {
  const Countdown = () => null
  beforeEach(() => {
    jest.useFakeTimers()
    Date.now = () => 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds
  })

  it("Manages a DurationProvider", () => {
    const comp = mount(
      <StateManager
        CountdownComponent={Countdown}
        onCurrentTickerState={() => ({
          state: "foo",
          date: new Date(Date.now() + 1000).toISOString(),
          label: "foo",
        })}
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        onNextTickerState={jest.fn(() => ({ label: "bar", date: null, state: "foo" }))}
      />
    )

    expect(comp.find(Countdown).props().duration.toString()).toEqual(
      moment.duration(1000).toString()
    )
  })

  it("Transitions state when duration expires", () => {
    const onNextTickerState = jest.fn(() => ({ label: "bar", date: null, state: "foo" }))
    mount(
      <StateManager
        CountdownComponent={Countdown}
        onCurrentTickerState={() => ({
          state: "foo",
          date: new Date(Date.now() + 1000).toISOString(),
          label: "foo",
        })}
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        onNextTickerState={onNextTickerState}
      />
    )

    jest.advanceTimersByTime(1000)
    expect(onNextTickerState).toHaveBeenCalled()
  })
})
