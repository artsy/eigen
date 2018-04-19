import { shallow } from "enzyme"
import React from "react"

import { Timer } from "../Timer"

const SECONDS = 1000
const MINUTES = 60 * SECONDS
const HOURS = 60 * MINUTES
const DAYS = 24 * HOURS

const getTimerText = timerComponent =>
  timerComponent
    .find("Sans14")
    .first()
    .props()
    .children.join("")

it("formats the remaining time in '00d  00h  00m  00s'", () => {
  jest.useFakeTimers()
  let timer

  timer = shallow(<Timer timeLeftInMilliseconds={3 * DAYS + 14 * HOURS + 1 * MINUTES + 59 * SECONDS} />)

  expect(getTimerText(timer)).toEqual("03d  14h  01m  59s")

  timer = shallow(<Timer timeLeftInMilliseconds={20 * MINUTES} />)

  expect(getTimerText(timer)).toEqual("00d  00h  20m  00s")

  timer = shallow(<Timer timeLeftInMilliseconds={10 * SECONDS} />)

  expect(getTimerText(timer)).toEqual("00d  00h  00m  10s")
  expect(setInterval).toHaveBeenCalled()
})
