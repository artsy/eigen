import { act, screen } from "@testing-library/react-native"
import { mockTimezone } from "app/utils/tests/mockTimezone"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import moment from "moment"
import { Countdown, Timer } from "./Timer"

describe("Timer", () => {
  const SECONDS = 1000
  const DATE_NOW = 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds
  const orgDateTimeFormat = Intl.DateTimeFormat

  let pastTime: string
  let futureTime: string

  beforeEach(() => {
    jest.useFakeTimers({
      legacyFakeTimers: true,
    })

    // Thursday, May 10, 2018 8:22:32.000 PM UTC
    Date.now = jest.fn(() => DATE_NOW)

    futureTime = moment(DATE_NOW).add(1, "second").toISOString()
    pastTime = moment(DATE_NOW).subtract(1, "second").toISOString()
  })

  afterEach(() => {
    Intl.DateTimeFormat = orgDateTimeFormat
  })

  describe("formats the remaining time", () => {
    it("when there are a few days left", () => {
      // Thursday, May 14, 2018 10:24:31.000 AM UTC
      renderWithWrappers(<Timer lotEndAt="2018-05-14T10:24:31+00:00" />)

      expect(screen.getByText("03d  14h  01m  59s")).toBeTruthy()
    })

    it("when there are a few hours left", () => {
      // Thursday, May 10, 2018 10:42:32.000 PM UTC
      renderWithWrappers(<Timer lotEndAt="2018-05-10T22:42:32+00:00" />)

      expect(screen.getByText("00d  02h  20m  00s")).toBeTruthy()
    })

    it("when there are a few minutes left", () => {
      // Thursday, May 10, 2018 8:42:32.000 PM UTC
      renderWithWrappers(<Timer lotEndAt="2018-05-10T20:42:32+00:00" />)

      expect(screen.getByText("00d  00h  20m  00s")).toBeTruthy()
    })

    it("when a few seconds are left", () => {
      // Thursday, May 10, 2018 8:22:42.000 PM UTC
      renderWithWrappers(<Timer lotEndAt="2018-05-10T20:22:42+00:00" />)

      expect(screen.getByText("00d  00h  00m  10s")).toBeTruthy()
    })
  })

  it("shows 'Closes' when it's an online-only sale with an ending time", () => {
    renderWithWrappers(<Timer lotEndAt="2018-05-14T20:00:00+00:00" />)

    expect(screen.getByText(/Closes/)).toBeTruthy()
  })

  it("shows 'Live' when the liveStartsAt prop is given", () => {
    renderWithWrappers(<Timer liveStartsAt="2018-05-14T20:00:00+00:00" />)

    expect(screen.getByText(/Live/)).toBeTruthy()
  })

  it("shows 'Starts' the sale has not started yet", () => {
    renderWithWrappers(
      <Timer
        startsAt="2018-04-14T20:00:00+00:00"
        isPreview
        liveStartsAt="2018-05-14T20:00:00+00:00"
      />
    )

    expect(screen.getByText(/Starts/)).toBeTruthy()
  })

  it("shows 'Bidding closed' when the auction is closed", () => {
    renderWithWrappers(
      <Timer
        startsAt="2018-04-14T20:00:00+00:00"
        isPreview={false}
        liveStartsAt="2018-05-14T20:00:00+00:00"
        isClosed
      />
    )

    expect(screen.getByText("Bidding closed")).toBeTruthy()
  })

  it("shows 'In progress' when the auction is in live auction integration mode", () => {
    renderWithWrappers(
      <Timer
        startsAt="2018-04-14T20:00:00+00:00"
        isPreview={false}
        liveStartsAt={pastTime}
        isClosed={false}
      />
    )

    expect(screen.getByText("In progress")).toBeTruthy()
  })

  it("shows month, date, and hour adjusted for the timezone where the user is", () => {
    mockTimezone("America/Los_Angeles")

    // Thursday, May 14, 2018 8:00:00.000 PM UTC
    // Thursday, May 14, 2018 1:00:00.000 PM PDT in LA
    renderWithWrappers(<Timer lotEndAt="2018-05-14T20:00:00+00:00" />)

    expect(screen.getByText("Closes May 14, 1 PM PDT")).toBeTruthy()
  })

  describe("displays the minutes when the sale does not end on the hour", () => {
    mockTimezone("America/New_York")
    renderWithWrappers(<Timer lotEndAt="2018-05-14T20:01:00+00:00" />)

    expect(screen.getByText("Closes May 14, 4:01 PM EDT")).toBeTruthy()
  })

  it("omits the minutes when the sale ends on the hour", () => {
    mockTimezone("America/New_York")
    renderWithWrappers(<Timer lotEndAt="2018-05-14T20:00:00+00:00" />)

    expect(screen.getByText("Closes May 14, 4 PM EDT")).toBeTruthy()
  })

  describe("timer transitions", () => {
    it("transitions state from preview --> closing when the timer ends", () => {
      renderWithWrappers(<Timer isPreview startsAt={futureTime} lotEndAt={futureTime} />)

      expect(screen.getByText(/Starts/)).toBeTruthy()

      act(() => {
        jest.advanceTimersByTime(1 * SECONDS)
      })
      expect(screen.getByText(/Closes/)).toBeTruthy()
    })

    it("transitions state from preview --> live upcoming when the timer ends", () => {
      renderWithWrappers(<Timer isPreview startsAt={futureTime} liveStartsAt={futureTime} />)

      expect(screen.getByText(/Starts/)).toBeTruthy()

      act(() => {
        jest.advanceTimersByTime(1 * SECONDS)
      })
      expect(screen.getByText(/Live/)).toBeTruthy()
    })

    it("transitions state from live upcoming --> live ongoing when the timer ends", () => {
      renderWithWrappers(<Timer isPreview={false} startsAt={pastTime} liveStartsAt={futureTime} />)

      expect(screen.getByText(/Live/)).toBeTruthy()

      act(() => {
        jest.advanceTimersByTime(1 * SECONDS)
      })
      expect(screen.getByText(/In progress/)).toBeTruthy()
    })

    it("transitions state from closing --> closed when the timer ends", () => {
      renderWithWrappers(<Timer isPreview={false} startsAt={pastTime} lotEndAt={futureTime} />)

      expect(screen.getByText(/Closes/)).toBeTruthy()

      act(() => {
        jest.advanceTimersByTime(1 * SECONDS)
      })
      expect(screen.getByText(/Bidding closed/)).toBeTruthy()
    })
  })
})

describe("Countdown", () => {
  // 10h 3m
  const duration = moment.duration(36180000)

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("shows extended bidding info when extendedBiddingPeriodMinutes is present", () => {
    renderWithWrappers(
      <Countdown
        duration={duration}
        label="A label"
        cascadingEndTimeIntervalMinutes={1}
        extendedBiddingPeriodMinutes={2}
      />
    )

    const textBlock = screen.getByText(
      "*Closure times may be extended to accommodate last-minute bids"
    )
    expect(textBlock).toBeDefined()
  })

  it("shows the new ticker if the sale has cascading end times", () => {
    renderWithWrappers(
      <Countdown
        duration={duration}
        label="This is the label"
        hasStarted
        cascadingEndTimeIntervalMinutes={1}
      />
    )

    expect(screen.getByLabelText("Modern Ticker")).toBeTruthy()
    expect(screen.queryByLabelText("Simple Ticker")).toBeFalsy()
  })

  it("does not shows the new ticker if the sale does not have cascading end times", () => {
    renderWithWrappers(<Countdown duration={duration} label="This is the label" />)

    expect(screen.getByLabelText("Simple Ticker")).toBeTruthy()
    expect(screen.queryByLabelText("Modern Ticker")).toBeFalsy()
  })
})
