import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { SansMedium12, SansMedium14 } from "../../Elements/Typography"
import { Timer } from "../Timer"

const SECONDS = 1000
const MINUTES = 60 * SECONDS

const dateNow = 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds

const getTimerLabel = timerComponent => timerComponent.root.findByType(SansMedium12).props.children.join("")

const getTimerText = timerComponent => timerComponent.root.findByType(SansMedium14).props.children.join("")

beforeEach(() => {
  jest.useFakeTimers()

  // Thursday, May 10, 2018 8:22:32.000 PM UTC
  Date.now = () => dateNow
})

const orgDateTimeFormat: any = Intl.DateTimeFormat

afterEach(() => {
  Intl.DateTimeFormat = orgDateTimeFormat
})

it("formats the remaining time in '00d  00h  00m  00s'", () => {
  let timer

  // Thursday, May 14, 2018 10:24:31.000 AM UTC
  timer = renderer.create(<Timer endsAt="2018-05-14T10:24:31+00:00" />)

  expect(getTimerText(timer)).toEqual("03d  14h  01m  59s")

  // Thursday, May 10, 2018 8:42:32.000 PM UTC
  timer = renderer.create(<Timer endsAt="2018-05-10T20:42:32+00:00" />)

  expect(getTimerText(timer)).toEqual("00d  00h  20m  00s")

  // Thursday, May 10, 2018 8:22:42.000 PM UTC
  timer = renderer.create(<Timer endsAt="2018-05-10T20:22:42+00:00" />)

  expect(getTimerText(timer)).toEqual("00d  00h  00m  10s")
})

it("shows 'Ends' when the endsAt prop is given", () => {
  const timer = renderer.create(<Timer endsAt="2018-05-14T20:00:00+00:00" />)

  expect(getTimerLabel(timer)).toContain("Ends")
})

it("shows 'Live' when the liveStartsAt prop is given", () => {
  const timer = renderer.create(<Timer liveStartsAt="2018-05-14T20:00:00+00:00" />)

  expect(getTimerLabel(timer)).toContain("Live")
})

it("counts down to zero", () => {
  const timer = renderer.create(<Timer endsAt="2018-05-14T10:23:10+00:00" />)

  expect(getTimerText(timer)).toEqual("03d  14h  00m  38s")

  jest.advanceTimersByTime(2 * SECONDS)

  expect(getTimerText(timer)).toEqual("03d  14h  00m  36s")

  jest.advanceTimersByTime(1 * MINUTES)

  expect(getTimerText(timer)).toEqual("03d  13h  59m  36s")
})

it("shows month, date, and hour adjusted for the timezone where the user is", () => {
  const mutatedResolvedOptions: any = Intl.DateTimeFormat().resolvedOptions()
  const mutatedDateTimeFormat: any = Intl.DateTimeFormat()

  mutatedResolvedOptions.timeZone = "America/Los_Angeles"
  mutatedDateTimeFormat.resolvedOptions = () => mutatedResolvedOptions
  Intl.DateTimeFormat = (() => mutatedDateTimeFormat) as any

  // Thursday, May 14, 2018 8:00:00.000 PM UTC
  // Thursday, May 14, 2018 1:00:00.000 PM PDT in LA
  const timer = renderer.create(<Timer endsAt="2018-05-14T20:00:00+00:00" />)

  expect(getTimerLabel(timer)).toEqual("Ends May 14, 1pm")
})
