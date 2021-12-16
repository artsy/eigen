// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { render } from "enzyme"
import moment from "moment"
import { Theme } from "palette"
import React from "react"
import { Text } from "react-native"
import { LabeledTicker, SimpleTicker } from "./Ticker"

Date.now = () => 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds
const duration = moment.duration(1000)

describe("SimpleTicker", () => {
  it("renders properly", () => {
    const comp = render(
      <Theme>
        <SimpleTicker duration={duration} separator="  " size="5" />
      </Theme>
    )
    expect(comp.text()).toEqual("00d  00h  00m  01s")
  })

  it("renders properly when duration is over", () => {
    const zeroDuration = moment.duration(null)
    const comp = render(
      <Theme>
        <SimpleTicker duration={zeroDuration} separator="  " size="5" />
      </Theme>
    )
    expect(comp.text()).toEqual("00d  00h  00m  00s")
  })

  it("renders properly with days overflowing a single month", () => {
    // 2 years
    const farOutDuration = moment.duration(63113904000)
    const comp = render(
      <Theme>
        <SimpleTicker duration={farOutDuration} separator="  " size="5" />
      </Theme>
    )

    expect(comp.text()).toContain("730d")
  })
})

describe("LabeledTicker", () => {
  it("renders properly", () => {
    const comp = render(
      <Theme>
        <LabeledTicker duration={duration} renderSeparator={() => <Text>:</Text>} />
      </Theme>
    )
    expect(comp.text()).toEqual("00d:00h:00m:01s")
  })
})
