import { getDefaultNormalizer, render } from "@testing-library/react-native"
import moment from "moment"
import { Theme } from "palette"
import React from "react"
import { Text } from "react-native"
import { LabeledTicker, ModernTicker, SimpleTicker } from "./Ticker"

Date.now = () => 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds
const duration = moment.duration(1000)

describe("SimpleTicker", () => {
  it("renders properly", () => {
    const { getByText } = render(
      <Theme>
        <SimpleTicker duration={duration} separator="  " size="5" />
      </Theme>
    )

    expect(
      getByText("00d  00h  00m  01s", {
        normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
      })
    ).toBeTruthy()
  })

  it("renders properly when duration is over", () => {
    const zeroDuration = moment.duration()
    const { getByText } = render(
      <Theme>
        <SimpleTicker duration={zeroDuration} separator="  " size="5" />
      </Theme>
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
    const { getByText } = render(
      <Theme>
        <SimpleTicker duration={farOutDuration} separator="  " size="5" />
      </Theme>
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
    const { queryByText, queryAllByText } = render(
      <Theme>
        <LabeledTicker duration={duration} renderSeparator={() => <Text>:</Text>} />
      </Theme>
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
    it("renders Bidding Starts Today in blue when start time is < 1 day away", () => {
      const todayDuration = moment.duration(2000)
      const { getByText } = render(
        <Theme>
          <ModernTicker duration={todayDuration} />
        </Theme>
      )

      const timerText = getByText("Bidding Starts Today")

      expect(timerText).toBeTruthy()
      expect(timerText.props.color).toEqual("blue100")
    })

    it("renders 1 Day Until Bidding Starts in blue when start time is >24 hours but less than 2 days away", () => {
      // 28 hours
      const dayDuration = moment.duration(100800000)
      const { getByText } = render(
        <Theme>
          <ModernTicker duration={dayDuration} />
        </Theme>
      )

      const timerText = getByText("1 Day Until Bidding Starts")

      expect(timerText).toBeTruthy()
      expect(timerText.props.color).toEqual("blue100")
    })

    it("renders 4 Days Until Bidding Starts in blue when start time is >2 days away", () => {
      // 3 days, 23 hours
      const daysDuration = moment.duration(342000000)
      const { getByText } = render(
        <Theme>
          <ModernTicker duration={daysDuration} />
        </Theme>
      )

      const timerText = getByText("3 Days Until Bidding Starts")

      expect(timerText).toBeTruthy()
      expect(timerText.props.color).toEqual("blue100")
    })
  })

  describe("when the sale is open", () => {
    it("renders 3d23h in blue when end time is days away", () => {
      // 3 days, 23 hours
      const daysDuration = moment.duration(342000000)
      const { getByText } = render(
        <Theme>
          <ModernTicker duration={daysDuration} hasStarted />
        </Theme>
      )

      const timerText = getByText("3d 23h")

      expect(timerText).toBeTruthy()
      expect(timerText.props.color).toEqual("blue100")
    })

    it("renders 10h3m in blue when end time is hours away", () => {
      // 10 hours, 3 mins
      const hoursDuration = moment.duration(36180000)
      const { getByText } = render(
        <Theme>
          <ModernTicker duration={hoursDuration} hasStarted />
        </Theme>
      )

      const timerText = getByText("10h 3m")

      expect(timerText).toBeTruthy()
      expect(timerText.props.color).toEqual("blue100")
    })

    it("renders 45m 30s in red when end time is minutes away", () => {
      // 45 minutes,  30 seconds
      const minutesDuration = moment.duration(2730000)
      const { getByText } = render(
        <Theme>
          <ModernTicker duration={minutesDuration} hasStarted />
        </Theme>
      )

      const timerText = getByText("45m 30s")

      expect(timerText).toBeTruthy()
      expect(timerText.props.color).toEqual("red100")
    })

    it("renders 30s in red when end time is seconds away", () => {
      // 30 seconds
      const secondsDuration = moment.duration(30000)
      const { getByText } = render(
        <Theme>
          <ModernTicker duration={secondsDuration} hasStarted />
        </Theme>
      )

      const timerText = getByText("0m 30s")

      expect(timerText).toBeTruthy()
      expect(timerText.props.color).toEqual("red100")
    })
  })
})
