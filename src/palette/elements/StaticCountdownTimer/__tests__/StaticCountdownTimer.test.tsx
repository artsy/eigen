import { mount } from "enzyme"
import { Settings } from "luxon"
import React from "react"
import { StaticCountdownTimer } from "../StaticCountdownTimer"

describe("StaticCountdownTimer", () => {
  const defaultZone = Settings.defaultZoneName

  beforeEach(() => {
    Settings.defaultZoneName = "America/New_York"
  })

  afterEach(() => {
    Settings.defaultZoneName = defaultZone
  })

  it("renders time in the future with a day in the future and a countdown clock", () => {
    const wrapper = mount(
      <StaticCountdownTimer
        action="Respond"
        note="Before it's too late."
        countdownStart="2019-01-01T12:00:00.000-04:00"
        countdownEnd="2019-01-14T15:30:00.000-04:00"
        currentTime="2019-01-05T12:00:30.000-04:00"
      />
    )
    expect(wrapper.html()).toContain("Respond by Jan 14, 2:30pm EST")
    expect(wrapper.html()).toContain("09d 03h 29m 30s left")
  })

  it("renders time in the past and returning 0 days", () => {
    const wrapper = mount(
      <StaticCountdownTimer
        action="Respond"
        note="Before it's too late."
        countdownStart="2019-01-01T12:00:00.000-04:00"
        countdownEnd="2019-01-14T12:00:00.000-04:00"
        currentTime="2019-01-15T12:00:00.000-04:00"
      />
    )
    expect(wrapper.html()).toContain("0 days left")
  })

  it("renders the hour as 12 if noon", () => {
    const wrapper = mount(
      <StaticCountdownTimer
        action="Respond"
        note="Before it's too late."
        countdownStart="2019-01-01T13:00:00.000-04:00"
        countdownEnd="2019-01-14T13:00:00.000-04:00"
        currentTime="2019-01-05T13:00:30.000-04:00"
      />
    )
    expect(wrapper.html()).toContain("Jan 14, 12:00pm EST")
  })
})
