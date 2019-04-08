// Mock moment to always give back a formatted time string
jest.mock("moment", () => () => ({ format: format => (format.length > 3 ? "Mon" : "7pm") }))

import { render } from "enzyme"
import React from "react"
import { CountdownTimer } from "../CountdownTimer"

const dateString = m => new Date(m).toISOString()

describe("CountdownTimer", () => {
  beforeEach(() => {
    jest.useFakeTimers()
    Date.now = () => 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds
  })

  it("renders upcoming properly", () => {
    const comp = render(
      <CountdownTimer
        formattedOpeningHours="Opens May 10 at 8:22pm"
        startAt="2018-05-10T20:22:42+00:00"
        endAt="2018-05-14T10:24:31+00:00"
      />
    )
    expect(comp.text()).toContain("Opens May 10 at 8:22pm")
  })

  it("renders current properly", () => {
    const comp = render(
      <CountdownTimer
        formattedOpeningHours="Opens April 14 at 8:00pm"
        startAt="2018-04-14T20:00:00+00:00"
        endAt="2018-05-14T20:00:00+00:00"
      />
    )
    expect(comp.text()).toContain("Opens April 14 at 8:00pm")
  })

  it("renders closed properly", () => {
    const comp = render(
      <CountdownTimer
        formattedOpeningHours="Closed"
        startAt={dateString(Date.now() - 2000)}
        endAt={dateString(Date.now() - 1000)}
      />
    )
    expect(comp.text()).toContain("")
  })
})
