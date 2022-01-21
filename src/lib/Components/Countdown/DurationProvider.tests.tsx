// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { shallow } from "enzyme"
import moment from "moment"
import React from "react"
import { DurationProvider } from "./DurationProvider"

describe("DurationProvider", () => {
  const DurationConsumer: React.FC<any> = jest.fn()

  beforeEach(() => {
    jest.useFakeTimers()
    Date.now = () => 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds
  })

  it("provides a duration", () => {
    const startAt = new Date(Date.now() + 1000).toISOString()
    const comp = shallow(
      <DurationProvider startAt={startAt}>
        <DurationConsumer />
      </DurationProvider>
    )

    expect(comp.find(DurationConsumer).props().duration.toString()).toEqual(
      moment.duration(1000).toString()
    )
  })

  it("updates duration every second", () => {
    const startAt = new Date(Date.now() + 1000).toISOString()
    const comp = shallow(
      <DurationProvider startAt={startAt}>
        <DurationConsumer />
      </DurationProvider>
    )
    jest.advanceTimersByTime(1000)
    expect(comp.find(DurationConsumer).props().duration.toString()).toEqual(
      moment.duration(0).toString()
    )
  })
})
