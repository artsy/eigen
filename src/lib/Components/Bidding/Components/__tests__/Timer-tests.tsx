import { shallow } from "enzyme"
import moment from "moment"
import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { SansMedium12, SansMedium14 } from "../../Elements/Typography"
import { AuctionTimerState, Timer } from "../Timer"

const SECONDS = 1000
const MINUTES = 60 * SECONDS

const dateNow = 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds

const getTimerLabel = timerComponent => timerComponent.root.findByType(SansMedium12).props.children

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

it("shows 'Starts' when the startsAt and isPreview props are given", () => {
  const timer = renderer.create(
    <Timer startsAt="2018-04-14T20:00:00+00:00" isPreview={true} liveStartsAt="2018-05-14T20:00:00+00:00" />
  )

  expect(getTimerLabel(timer)).toContain("Starts")
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

describe("timer methods", () => {
  let futureTime
  let pastTime
  let timer

  beforeEach(() => {
    futureTime = moment(dateNow)
      .add(1, "hour")
      .toISOString()

    pastTime = moment(dateNow)
      .subtract(1, "hour")
      .toISOString()

    timer = shallow(<Timer />).instance()
  })

  describe("timer", () => {
    it("transitions state from preview --> closing when the timer ends", () => {
      const statefulTimer = renderer.create(<Timer isPreview={true} startsAt={futureTime} endsAt={futureTime} />)
      statefulTimer.root.instance.setState({
        timeLeftInMilliseconds: 1000,
        label: "label",
        timerState: AuctionTimerState.PREVIEW,
      })
      statefulTimer.root.instance.timer()
      expect(statefulTimer.root.instance.state.label).toEqual("Ends May 10, 5pm")
      expect(statefulTimer.root.instance.state.timerState).toEqual(AuctionTimerState.CLOSING)
    })

    it("transitions state from preview --> live upcoming when the timer ends", () => {
      const statefulTimer = renderer.create(<Timer isPreview={true} startsAt={futureTime} liveStartsAt={futureTime} />)
      statefulTimer.root.instance.setState({
        timeLeftInMilliseconds: 1000,
        label: "label",
        timerState: AuctionTimerState.PREVIEW,
      })
      statefulTimer.root.instance.timer()
      expect(statefulTimer.root.instance.state.label).toEqual("Live May 10, 5pm")
      expect(statefulTimer.root.instance.state.timerState).toEqual(AuctionTimerState.LIVE_INTEGRATION_UPCOMING)
    })

    it("transitions state from live upcoming --> live ongoing when the timer ends", () => {
      const statefulTimer = renderer.create(<Timer isPreview={false} startsAt={pastTime} liveStartsAt={pastTime} />)
      statefulTimer.root.instance.setState({
        timeLeftInMilliseconds: 1000,
        label: "label",
        timerState: AuctionTimerState.LIVE_INTEGRATION_UPCOMING,
      })
      statefulTimer.root.instance.timer()
      expect(statefulTimer.root.instance.state.label).toEqual("In progress")
      expect(statefulTimer.root.instance.state.timerState).toEqual(AuctionTimerState.LIVE_INTEGRATION_ONGOING)
    })

    it("transitions state from closing --> closed when the timer ends", () => {
      const statefulTimer = renderer.create(<Timer isPreview={false} startsAt={futureTime} endsAt={futureTime} />)
      statefulTimer.root.instance.setState({
        timeLeftInMilliseconds: 1000,
        label: "label",
        timerState: AuctionTimerState.CLOSING,
      })
      statefulTimer.root.instance.timer()
      expect(statefulTimer.root.instance.state.label).toEqual("Bidding closed")
      expect(statefulTimer.root.instance.state.timerState).toEqual(AuctionTimerState.CLOSED)
    })
  })

  describe("currentState", () => {
    it("gives the correct state for a sale in preview", () => {
      expect(timer.currentState(true, false, null)).toEqual(AuctionTimerState.PREVIEW)
    })

    it("gives the correct state for a timed sale that will close", () => {
      expect(timer.currentState(false, false, null)).toEqual(AuctionTimerState.CLOSING)
    })

    it("gives the correct state for a sale that will open live", () => {
      expect(timer.currentState(false, false, futureTime)).toEqual(AuctionTimerState.LIVE_INTEGRATION_UPCOMING)
    })

    it("gives the correct state for a sale that is already live", () => {
      expect(timer.currentState(false, false, pastTime)).toEqual(AuctionTimerState.LIVE_INTEGRATION_ONGOING)
    })

    it("gives the correct state for a sale that is closed", () => {
      expect(timer.currentState(false, true, pastTime)).toEqual(AuctionTimerState.CLOSED)
    })
  })

  describe("nextState", () => {
    it("gives the correct next state for a sale in preview that is timed", () => {
      expect(timer.nextState(AuctionTimerState.PREVIEW, null)).toEqual(AuctionTimerState.CLOSING)
    })

    it("gives the correct next state for a sale in preview that will go live", () => {
      expect(timer.nextState(AuctionTimerState.PREVIEW, futureTime)).toEqual(
        AuctionTimerState.LIVE_INTEGRATION_UPCOMING
      )
    })

    it("gives the correct next state for a sale that has closed", () => {
      expect(timer.nextState(AuctionTimerState.CLOSED, null)).toEqual(AuctionTimerState.CLOSED)
    })

    it("gives the correct next state for a sale that is about to close", () => {
      expect(timer.nextState(AuctionTimerState.CLOSING, null)).toEqual(AuctionTimerState.CLOSED)
    })

    it("gives the correct next state for a sale that is about to go live", () => {
      expect(timer.nextState(AuctionTimerState.LIVE_INTEGRATION_UPCOMING, futureTime)).toEqual(
        AuctionTimerState.LIVE_INTEGRATION_ONGOING
      )
    })

    it("gives the correct next state for a sale that is currently live", () => {
      expect(timer.nextState(AuctionTimerState.LIVE_INTEGRATION_ONGOING, pastTime)).toEqual(
        AuctionTimerState.LIVE_INTEGRATION_ONGOING
      )
    })
  })

  describe("upcomingLabel", () => {
    it("shows the correct label for a sale in preview", () => {
      const { label, relevantDate } = timer.upcomingLabel(AuctionTimerState.PREVIEW, null, futureTime, null)
      expect(label).toEqual("Starts May 10, 5pm")
      expect(relevantDate).toEqual(futureTime)
    })

    it("shows the correct label for a sale that is going to end", () => {
      const { label, relevantDate } = timer.upcomingLabel(AuctionTimerState.CLOSING, null, pastTime, futureTime)
      expect(label).toEqual("Ends May 10, 5pm")
      expect(relevantDate).toEqual(futureTime)
    })

    it("shows the correct label for a sale that is going to go live", () => {
      const { label, relevantDate } = timer.upcomingLabel(
        AuctionTimerState.LIVE_INTEGRATION_UPCOMING,
        futureTime,
        pastTime,
        null
      )
      expect(label).toEqual("Live May 10, 5pm")
      expect(relevantDate).toEqual(futureTime)
    })

    it("shows the correct label for a sale that is already live", () => {
      const { label, relevantDate } = timer.upcomingLabel(
        AuctionTimerState.LIVE_INTEGRATION_ONGOING,
        pastTime,
        pastTime,
        null
      )
      expect(label).toEqual("In progress")
      expect(relevantDate).toEqual(null)
    })

    it("shows the correct label for a sale that has closed", () => {
      const { label, relevantDate } = timer.upcomingLabel(AuctionTimerState.CLOSED, pastTime, pastTime, pastTime)
      expect(label).toEqual("Bidding closed")
      expect(relevantDate).toEqual(null)
    })
  })
})
