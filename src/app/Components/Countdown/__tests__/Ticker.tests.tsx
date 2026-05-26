import { getDefaultNormalizer } from "@testing-library/react-native"
import { LabeledTicker, ModernTicker, SimpleTicker } from "app/Components/Countdown/Ticker"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import moment from "moment"
import { Text } from "react-native"

Date.now = () => 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds
const duration = moment.duration(1000)

describe("SimpleTicker", () => {
  it("renders properly", () => {
    const { getByText } = renderWithWrappers(
      <SimpleTicker duration={duration} separator="  " variant="sm-display" />
    )

    expect(
      getByText("00d  00h  00m  01s", {
        normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
      })
    ).toBeTruthy()
  })

  it("renders properly when duration is over", () => {
    const zeroDuration = moment.duration()
    const { getByText } = renderWithWrappers(
      <SimpleTicker duration={zeroDuration} separator="  " variant="sm-display" />
    )

    expect(
      getByText("00d  00h  00m  00s", {
        normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
      })
    ).toBeTruthy()
  })

  it("renders properly with days overflowing a single month", () => {
    // 2 years
    const farOutDuration = moment.duration(63113904000)
    const { getByText } = renderWithWrappers(
      <SimpleTicker duration={farOutDuration} separator="  " variant="sm-display" />
    )

    expect(
      getByText("730d  11h  38m  24s", {
        normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
      })
    ).toBeTruthy()
  })
})

describe("LabeledTicker", () => {
  it("renders properly", () => {
    const { queryByText, queryAllByText } = renderWithWrappers(
      <LabeledTicker duration={duration} renderSeparator={() => <Text>:</Text>} />
    )
    expect(queryByText("00d")).toBeTruthy()
    expect(queryByText("00h")).toBeTruthy()
    expect(queryByText("00m")).toBeTruthy()
    expect(queryByText("01s")).toBeTruthy()
    expect(queryAllByText(":")).toHaveLength(3)
  })
})

describe("ModernTicker", () => {
  describe("when the sale has not started", () => {
    it("When Bidding in less than 1 day: it shows hours and minutes left", () => {
      const twentyHrsFiveMins = 1000 * 60 * 60 * 20 + 1000 * 60 * 5
      const todayDuration = moment.duration(twentyHrsFiveMins)
      const { getByText } = renderWithWrappers(<ModernTicker duration={todayDuration} />)

      const timerText = getByText("20h 5m Until Bidding Starts")

      expect(timerText).toBeTruthy()
      expect(timerText.props.color).toEqual("blue100")
    })

    it("When Bidding in less than 1 hour: it shows minutes and seconds left", () => {
      const twentyMinsTenSecs = 1000 * 60 * 20 + 1000 * 10
      const todayDuration = moment.duration(twentyMinsTenSecs)
      const { getByText } = renderWithWrappers(<ModernTicker duration={todayDuration} />)

      const timerText = getByText("20m 10s Until Bidding Starts")

      expect(timerText).toBeTruthy()
      expect(timerText.props.color).toEqual("blue100")
    })

    it("renders 1 Day Until Bidding Starts in blue when start time is >24 hours but less than 2 days away", () => {
      // 28 hours
      const dayDuration = moment.duration(100800000)
      const { getByText } = renderWithWrappers(<ModernTicker duration={dayDuration} />)

      const timerText = getByText("1 Day Until Bidding Starts")

      expect(timerText).toBeTruthy()
      expect(timerText.props.color).toEqual("blue100")
    })

    it("renders 4 Days Until Bidding Starts in blue when start time is >2 days away", () => {
      // 3 days, 23 hours
      const daysDuration = moment.duration(342000000)
      const { getByText } = renderWithWrappers(<ModernTicker duration={daysDuration} />)

      const timerText = getByText("3 Days Until Bidding Starts")

      expect(timerText).toBeTruthy()
      expect(timerText.props.color).toEqual("blue100")
    })
  })

  describe("when the sale is open", () => {
    it("renders 3d23h in blue when end time is days away", () => {
      // 3 days, 23 hours
      const daysDuration = moment.duration(342000000)
      const { getByText } = renderWithWrappers(<ModernTicker duration={daysDuration} hasStarted />)

      const timerText = getByText("3d 23h")

      expect(timerText).toBeTruthy()
      expect(timerText.props.color).toEqual("blue100")
    })

    it("renders 10h3m in blue when end time is hours away", () => {
      // 10 hours, 3 mins
      const hoursDuration = moment.duration(36180000)
      const { getByText } = renderWithWrappers(<ModernTicker duration={hoursDuration} hasStarted />)

      const timerText = getByText("10h 3m")

      expect(timerText).toBeTruthy()
      expect(timerText.props.color).toEqual("blue100")
    })

    it("renders 45m 30s in red when end time is minutes away", () => {
      // 45 minutes,  30 seconds
      const minutesDuration = moment.duration(2730000)
      const { getByText } = renderWithWrappers(
        <ModernTicker duration={minutesDuration} hasStarted />
      )

      const timerText = getByText("45m 30s")

      expect(timerText).toBeTruthy()
      expect(timerText.props.color).toEqual("red100")
    })

    it("renders 30s in red when end time is seconds away", () => {
      // 30 seconds
      const secondsDuration = moment.duration(30000)
      const { getByText } = renderWithWrappers(
        <ModernTicker duration={secondsDuration} hasStarted />
      )

      const timerText = getByText("0m 30s")

      expect(timerText).toBeTruthy()
      expect(timerText.props.color).toEqual("red100")
    })

    it('prefixes "Extended: " when when sale is extended', () => {
      const momentDuration = moment.duration(1000 * 90) // 1m 30s
      const { getByText } = renderWithWrappers(
        <ModernTicker duration={momentDuration} hasStarted isExtended />
      )
      const timerTextBlock = getByText("Extended: 1m 30s")

      expect(timerTextBlock).toBeTruthy()
      expect(timerTextBlock.props.color).toEqual("red100")
    })
  })
})
