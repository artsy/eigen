import { render } from "@testing-library/react-native"
import moment from "moment"
import { Theme } from "palette"
import React from "react"
import { Text } from "react-native"
import { LabeledTicker, SimpleTicker } from "./Ticker"

Date.now = () => 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds
const duration = moment.duration(1000)

describe("SimpleTicker", () => {
  it("renders properly", () => {
    const { getByText } = render(
      <Theme>
        <SimpleTicker duration={duration} separator="  " size="5" />
      </Theme>
    )

    expect(getByText("00d 00h 00m 01s")).toBeTruthy()
  })

  it("renders properly when duration is over", () => {
    const zeroDuration = moment.duration()
    const { getByText } = render(
      <Theme>
        <SimpleTicker duration={zeroDuration} separator="  " size="5" />
      </Theme>
    )

    expect(getByText("00d 00h 00m 00s")).toBeTruthy()
  })

  it("renders properly with days overflowing a single month", () => {
    // 2 years
    const farOutDuration = moment.duration(63113904000)
    const { getByText } = render(
      <Theme>
        <SimpleTicker duration={farOutDuration} separator="  " size="5" />
      </Theme>
    )

    expect(getByText("730d 11h 38m 24s")).toBeTruthy()
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
