import moment from "moment"
import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { SansMedium12, SansMedium16t } from "../../Elements/Typography"
import { Timer } from "../Timer"

const SECONDS = 1000
const MINUTES = 60 * SECONDS

const dateNow = 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds

const getTimerLabel = timerComponent => timerComponent.root.findByType(SansMedium12).props.children

const getTimerText = timerComponent => timerComponent.root.findByType(SansMedium16t).props.children.join("")

const mockTimezone = timezone => {
  const mutatedResolvedOptions: any = Intl.DateTimeFormat().resolvedOptions()
  const mutatedDateTimeFormat: any = Intl.DateTimeFormat()

  mutatedResolvedOptions.timeZone = timezone
  mutatedDateTimeFormat.resolvedOptions = () => mutatedResolvedOptions
  Intl.DateTimeFormat = (() => mutatedDateTimeFormat) as any
}

let pastTime
let futureTime

beforeEach(() => {
  jest.useFakeTimers()

  // Thursday, May 10, 2018 8:22:32.000 PM UTC
  Date.now = () => dateNow
  futureTime = moment(dateNow)
    .add(1, "second")
    .toISOString()

  pastTime = moment(dateNow)
    .subtract(1, "second")
    .toISOString()
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

it("shows 'Ends' when it's an online-only sale with an ending time", () => {
  const timer = renderer.create(<Timer endsAt="2018-05-14T20:00:00+00:00" />)

  expect(getTimerLabel(timer)).toContain("Ends")
})

it("shows 'Live' when the liveStartsAt prop is given", () => {
  const timer = renderer.create(<Timer liveStartsAt="2018-05-14T20:00:00+00:00" />)

  expect(getTimerLabel(timer)).toContain("Live")
})

it("shows 'Starts' the sale has not started yet", () => {
  const timer = renderer.create(
    <Timer startsAt="2018-04-14T20:00:00+00:00" isPreview={true} liveStartsAt="2018-05-14T20:00:00+00:00" />
  )

  expect(getTimerLabel(timer)).toContain("Starts")
})

it("shows 'Bidding closed' when the auction is closed", () => {
  const timer = renderer.create(
    <Timer
      startsAt="2018-04-14T20:00:00+00:00"
      isPreview={false}
      liveStartsAt="2018-05-14T20:00:00+00:00"
      isClosed={true}
    />
  )

  expect(getTimerLabel(timer)).toContain("Bidding closed")
})

it("shows 'In progress' when the auction is in live auction integration mode", () => {
  const timer = renderer.create(
    <Timer startsAt="2018-04-14T20:00:00+00:00" isPreview={false} liveStartsAt={pastTime} isClosed={false} />
  )

  expect(getTimerLabel(timer)).toContain("In progress")
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
  mockTimezone("America/Los_Angeles")

  // Thursday, May 14, 2018 8:00:00.000 PM UTC
  // Thursday, May 14, 2018 1:00:00.000 PM PDT in LA
  const timer = renderer.create(<Timer endsAt="2018-05-14T20:00:00+00:00" />)

  expect(getTimerLabel(timer)).toEqual("Ends May 14, 1 PM")
})

describe("timer transitions", () => {
  it("transitions state from preview --> closing when the timer ends", () => {
    const timer = renderer.create(<Timer isPreview={true} startsAt={futureTime} endsAt={futureTime} />)

    expect(getTimerLabel(timer)).toContain("Starts")
    expect(getTimerText(timer)).toEqual("00d  00h  00m  01s")

    jest.advanceTimersByTime(1 * SECONDS)

    expect(getTimerLabel(timer)).toContain("Ends")
    expect(getTimerText(timer)).toEqual("00d  00h  00m  01s")
  })

  it("transitions state from preview --> live upcoming when the timer ends", () => {
    const timer = renderer.create(<Timer isPreview={true} startsAt={futureTime} liveStartsAt={futureTime} />)

    expect(getTimerLabel(timer)).toContain("Starts")
    expect(getTimerText(timer)).toEqual("00d  00h  00m  01s")

    jest.advanceTimersByTime(1 * SECONDS)

    expect(getTimerLabel(timer)).toContain("Live")
    expect(getTimerText(timer)).toEqual("00d  00h  00m  01s")
  })

  it("transitions state from live upcoming --> live ongoing when the timer ends", () => {
    const timer = renderer.create(<Timer isPreview={false} startsAt={pastTime} liveStartsAt={futureTime} />)

    expect(getTimerLabel(timer)).toContain("Live")
    expect(getTimerText(timer)).toEqual("00d  00h  00m  01s")

    jest.advanceTimersByTime(1 * SECONDS)

    expect(getTimerLabel(timer)).toContain("In progress")
    expect(getTimerText(timer)).toContain("00d  00h  00m")
  })

  it("transitions state from closing --> closed when the timer ends", () => {
    const timer = renderer.create(<Timer isPreview={false} startsAt={pastTime} endsAt={futureTime} />)

    expect(getTimerLabel(timer)).toContain("Ends")
    expect(getTimerText(timer)).toEqual("00d  00h  00m  01s")

    jest.advanceTimersByTime(1 * SECONDS)

    expect(getTimerLabel(timer)).toContain("Bidding closed")
    expect(getTimerText(timer)).toContain("00d  00h  00m")
  })
})
