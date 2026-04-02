import { getDefaultNormalizer, screen } from "@testing-library/react-native"
import { LabeledTicker, ModernTicker, SimpleTicker } from "app/Components/Countdown/Ticker"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Duration } from "luxon"
import { Text } from "react-native"

Date.now = () => 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds
const duration = Duration.fromMillis(1000)

describe("SimpleTicker", () => {
  it("renders properly", () => {
    renderWithWrappers(<SimpleTicker duration={duration} separator="  " variant="sm-display" />)

    expect(
      screen.getByText("00d  00h  00m  01s", {
        normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
      })
    ).toBeTruthy()
  })

  it("renders properly when duration is over", () => {
    const zeroDuration = Duration.fromMillis(0)
    renderWithWrappers(<SimpleTicker duration={zeroDuration} separator="  " variant="sm-display" />)

    expect(
      screen.getByText("00d  00h  00m  00s", {
        normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
      })
    ).toBeTruthy()
  })

  it("renders properly with days overflowing a single month", () => {
    // 2 years
    const farOutDuration = Duration.fromMillis(63113904000)
    renderWithWrappers(
      <SimpleTicker duration={farOutDuration} separator="  " variant="sm-display" />
    )

    expect(
      screen.getByText("730d  11h  38m  24s", {
        normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
      })
    ).toBeTruthy()
  })
})

describe("LabeledTicker", () => {
  it("renders properly", () => {
    renderWithWrappers(<LabeledTicker duration={duration} renderSeparator={() => <Text>:</Text>} />)
    expect(screen.getByText("00d")).toBeTruthy()
    expect(screen.getByText("00h")).toBeTruthy()
    expect(screen.getByText("00m")).toBeTruthy()
    expect(screen.getByText("01s")).toBeTruthy()
    expect(screen.getAllByText(":")).toHaveLength(3)
  })
})

describe("ModernTicker", () => {
  describe("when the sale has not started", () => {
    it("When Bidding in less than 1 day: it shows hours and minutes left", () => {
      const twentyHrsFiveMins = 1000 * 60 * 60 * 20 + 1000 * 60 * 5
      const todayDuration = Duration.fromMillis(twentyHrsFiveMins)
      renderWithWrappers(<ModernTicker duration={todayDuration} />)

      const timerText = screen.getByText("20h 5m Until Bidding Starts")

      expect(timerText).toBeTruthy()
      expect(timerText.props.color).toEqual("blue100")
    })

    it("When Bidding in less than 1 hour: it shows minutes and seconds left", () => {
      const twentyMinsTenSecs = 1000 * 60 * 20 + 1000 * 10
      const todayDuration = Duration.fromMillis(twentyMinsTenSecs)
      renderWithWrappers(<ModernTicker duration={todayDuration} />)

      const timerText = screen.getByText("20m 10s Until Bidding Starts")

      expect(timerText).toBeTruthy()
      expect(timerText.props.color).toEqual("blue100")
    })

    it("renders 1 Day Until Bidding Starts in blue when start time is >24 hours but less than 2 days away", () => {
      // 28 hours
      const dayDuration = Duration.fromMillis(100800000)
      renderWithWrappers(<ModernTicker duration={dayDuration} />)

      const timerText = screen.getByText("1 Day Until Bidding Starts")

      expect(timerText).toBeTruthy()
      expect(timerText.props.color).toEqual("blue100")
    })

    it("renders 4 Days Until Bidding Starts in blue when start time is >2 days away", () => {
      // 3 days, 23 hours
      const daysDuration = Duration.fromMillis(342000000)
      renderWithWrappers(<ModernTicker duration={daysDuration} />)

      const timerText = screen.getByText("3 Days Until Bidding Starts")

      expect(timerText).toBeTruthy()
      expect(timerText.props.color).toEqual("blue100")
    })
  })

  describe("when the sale is open", () => {
    it("renders 3d23h in blue when end time is days away", () => {
      // 3 days, 23 hours
      const daysDuration = Duration.fromMillis(342000000)
      renderWithWrappers(<ModernTicker duration={daysDuration} hasStarted />)

      const timerText = screen.getByText("3d 23h")

      expect(timerText).toBeTruthy()
      expect(timerText.props.color).toEqual("blue100")
    })

    it("renders 10h3m in blue when end time is hours away", () => {
      // 10 hours, 3 mins
      const hoursDuration = Duration.fromMillis(36180000)
      renderWithWrappers(<ModernTicker duration={hoursDuration} hasStarted />)

      const timerText = screen.getByText("10h 3m")

      expect(timerText).toBeTruthy()
      expect(timerText.props.color).toEqual("blue100")
    })

    it("renders 45m 30s in red when end time is minutes away", () => {
      // 45 minutes,  30 seconds
      const minutesDuration = Duration.fromMillis(2730000)
      renderWithWrappers(<ModernTicker duration={minutesDuration} hasStarted />)

      const timerText = screen.getByText("45m 30s")

      expect(timerText).toBeTruthy()
      expect(timerText.props.color).toEqual("red100")
    })

    it("renders 30s in red when end time is seconds away", () => {
      // 30 seconds
      const secondsDuration = Duration.fromMillis(30000)
      renderWithWrappers(<ModernTicker duration={secondsDuration} hasStarted />)

      const timerText = screen.getByText("0m 30s")

      expect(timerText).toBeTruthy()
      expect(timerText.props.color).toEqual("red100")
    })

    it('prefixes "Extended: " when when sale is extended', () => {
      const momentDuration = Duration.fromMillis(1000 * 90) // 1m 30s
      renderWithWrappers(<ModernTicker duration={momentDuration} hasStarted isExtended />)
      const timerTextBlock = screen.getByText("Extended: 1m 30s")

      expect(timerTextBlock).toBeTruthy()
      expect(timerTextBlock.props.color).toEqual("red100")
    })
  })
})
