import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockTimezone } from "app/tests/mockTimezone"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import moment from "moment"
import { Countdown, Timer } from "./Timer"

describe("Timer", () => {
  const SECONDS = 1000
  const MINUTES = 60 * SECONDS
  const DATE_NOW = 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds
  const orgDateTimeFormat = Intl.DateTimeFormat

  let pastTime: string
  let futureTime: string

  beforeEach(() => {
    jest.useFakeTimers()

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
      const { getByText } = renderWithWrappers(<Timer lotEndAt="2018-05-14T10:24:31+00:00" />)

      expect(getByText("03d  14h  01m  59s")).toBeTruthy()
    })

    it("when there are a few hours left", () => {
      // Thursday, May 10, 2018 10:42:32.000 PM UTC
      const { getByText } = renderWithWrappers(<Timer lotEndAt="2018-05-10T22:42:32+00:00" />)

      expect(getByText("00d  02h  20m  00s")).toBeTruthy()
    })

    it("when there are a few minutes left", () => {
      // Thursday, May 10, 2018 8:42:32.000 PM UTC
      const { getByText } = renderWithWrappers(<Timer lotEndAt="2018-05-10T20:42:32+00:00" />)

      expect(getByText("00d  00h  20m  00s")).toBeTruthy()
    })

    it("when a few seconds are left", () => {
      // Thursday, May 10, 2018 8:22:42.000 PM UTC
      const { getByText } = renderWithWrappers(<Timer lotEndAt="2018-05-10T20:22:42+00:00" />)

      expect(getByText("00d  00h  00m  10s")).toBeTruthy()
    })
  })

  it("shows 'Closes' when it's an online-only sale with an ending time", () => {
    const { getByText } = renderWithWrappers(<Timer lotEndAt="2018-05-14T20:00:00+00:00" />)

    expect(getByText(/Closes/)).toBeTruthy()
  })

  it("shows 'Live' when the liveStartsAt prop is given", () => {
    const { getByText } = renderWithWrappers(<Timer liveStartsAt="2018-05-14T20:00:00+00:00" />)

    expect(getByText(/Live/)).toBeTruthy()
  })

  it("shows 'Starts' the sale has not started yet", () => {
    const { getByText } = renderWithWrappers(
      <Timer
        startsAt="2018-04-14T20:00:00+00:00"
        isPreview
        liveStartsAt="2018-05-14T20:00:00+00:00"
      />
    )

    expect(getByText(/Starts/)).toBeTruthy()
  })

  it("shows 'Bidding closed' when the auction is closed", () => {
    const { getByText } = renderWithWrappers(
      <Timer
        startsAt="2018-04-14T20:00:00+00:00"
        isPreview={false}
        liveStartsAt="2018-05-14T20:00:00+00:00"
        isClosed
      />
    )

    expect(getByText("Bidding closed")).toBeTruthy()
  })

  it("shows 'In progress' when the auction is in live auction integration mode", () => {
    const { getByText } = renderWithWrappers(
      <Timer
        startsAt="2018-04-14T20:00:00+00:00"
        isPreview={false}
        liveStartsAt={pastTime}
        isClosed={false}
      />
    )

    expect(getByText("In progress")).toBeTruthy()
  })

  it("counts down to zero", () => {
    const { getByText } = renderWithWrappers(<Timer lotEndAt="2018-05-14T10:23:10+00:00" />)

    expect(getByText("03d  14h  00m  38s")).toBeTruthy()

    jest.advanceTimersByTime(2 * SECONDS)
    expect(getByText("03d  14h  00m  36s")).toBeTruthy()

    jest.advanceTimersByTime(1 * MINUTES)
    expect(getByText("03d  13h  59m  36s")).toBeTruthy()
  })

  it("shows month, date, and hour adjusted for the timezone where the user is", () => {
    mockTimezone("America/Los_Angeles")

    // Thursday, May 14, 2018 8:00:00.000 PM UTC
    // Thursday, May 14, 2018 1:00:00.000 PM PDT in LA
    const { getByText } = renderWithWrappers(<Timer lotEndAt="2018-05-14T20:00:00+00:00" />)

    expect(getByText("Closes May 14, 1 PM PDT")).toBeTruthy()
  })

  describe("displays the minutes when the sale does not end on the hour", () => {
    mockTimezone("America/New_York")
    const { getByText } = renderWithWrappers(<Timer lotEndAt="2018-05-14T20:01:00+00:00" />)

    expect(getByText("Closes May 14, 4:01 PM EDT")).toBeTruthy()
  })

  it("omits the minutes when the sale ends on the hour", () => {
    mockTimezone("America/New_York")
    const { getByText } = renderWithWrappers(<Timer lotEndAt="2018-05-14T20:00:00+00:00" />)

    expect(getByText("Closes May 14, 4 PM EDT")).toBeTruthy()
  })

  describe("timer transitions", () => {
    it("transitions state from preview --> closing when the timer ends", () => {
      const { getByText } = renderWithWrappers(
        <Timer isPreview startsAt={futureTime} lotEndAt={futureTime} />
      )

      expect(getByText(/Starts/)).toBeTruthy()

      jest.advanceTimersByTime(1 * SECONDS)
      expect(getByText(/Closes/)).toBeTruthy()
    })

    it("transitions state from preview --> live upcoming when the timer ends", () => {
      const { getByText } = renderWithWrappers(
        <Timer isPreview startsAt={futureTime} liveStartsAt={futureTime} />
      )

      expect(getByText(/Starts/)).toBeTruthy()

      jest.advanceTimersByTime(1 * SECONDS)
      expect(getByText(/Live/)).toBeTruthy()
    })

    it("transitions state from live upcoming --> live ongoing when the timer ends", () => {
      const { getByText } = renderWithWrappers(
        <Timer isPreview={false} startsAt={pastTime} liveStartsAt={futureTime} />
      )

      expect(getByText(/Live/)).toBeTruthy()

      jest.advanceTimersByTime(1 * SECONDS)
      expect(getByText(/In progress/)).toBeTruthy()
    })

    it("transitions state from closing --> closed when the timer ends", () => {
      const { getByText } = renderWithWrappers(
        <Timer isPreview={false} startsAt={pastTime} lotEndAt={futureTime} />
      )

      expect(getByText(/Closes/)).toBeTruthy()

      jest.advanceTimersByTime(1 * SECONDS)
      expect(getByText(/Bidding closed/)).toBeTruthy()
    })
  })
})

describe("Countdown", () => {
  // 10h 3m
  const duration = moment.duration(36180000)

  describe("when the enable cascade feature flag is turned on", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCascadingEndTimerLotPage: true })
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("shows extended bidding info when extendedBiddingPeriodMinutes is present", () => {
      const { getByText } = renderWithWrappers(
        <Countdown
          duration={duration}
          label="A label"
          cascadingEndTimeIntervalMinutes={1}
          extendedBiddingPeriodMinutes={2}
        />
      )

      const textBlock = getByText("*Closure times may be extended to accommodate last minute bids")
      expect(textBlock).toBeDefined()
    })

    it("shows the new ticker if the sale has cascading end times", () => {
      const { queryByLabelText } = renderWithWrappers(
        <Countdown
          duration={duration}
          label="This is the label"
          hasStarted
          cascadingEndTimeIntervalMinutes={1}
        />
      )

      expect(queryByLabelText("Modern Ticker")).toBeTruthy()
      expect(queryByLabelText("Simple Ticker")).toBeFalsy()
    })

    it("does not shows the new ticker if the sale does not have cascading end times", () => {
      const { queryByLabelText } = renderWithWrappers(
        <Countdown duration={duration} label="This is the label" />
      )

      expect(queryByLabelText("Simple Ticker")).toBeTruthy()
      expect(queryByLabelText("Modern Ticker")).toBeFalsy()
    })
  })

  describe("when the enable cascade feature flag is turned off", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCascadingEndTimerLotPage: false })
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("does not shows the new ticker even if the sale has cascading end times", () => {
      const { queryByLabelText } = renderWithWrappers(
        <Countdown
          duration={duration}
          label="This is the label"
          hasStarted
          cascadingEndTimeIntervalMinutes={1}
        />
      )

      expect(queryByLabelText("Simple Ticker")).toBeTruthy()
      expect(queryByLabelText("Modern Ticker")).toBeFalsy()
    })
  })
})
