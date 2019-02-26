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
      <CountdownTimer startAt={dateString(Date.now() + 1000)} endAt={dateString(Date.now() + 2000)} />
    )
    expect(comp.text()).toContain("Opens May 10 at 8pm")
  })

  it("renders current properly", () => {
    const comp = render(<CountdownTimer startAt={dateString(Date.now())} endAt={dateString(Date.now() + 1000)} />)
    expect(comp.text()).toContain("Closes May 10 at 8pm")
  })

  it("renders closed properly", () => {
    const comp = render(
      <CountdownTimer startAt={dateString(Date.now() - 2000)} endAt={dateString(Date.now() - 1000)} />
    )
    expect(comp.text()).toContain("")
  })
})
