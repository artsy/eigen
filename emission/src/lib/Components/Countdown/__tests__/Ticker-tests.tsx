import { render } from "enzyme"
import moment from "moment"
import React from "react"
import { Text } from "react-native"
import { LabeledTicker, SimpleTicker } from "../Ticker"

Date.now = () => 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds
const duration = moment.duration(1000)

describe("SimpleTicker", () => {
  it("renders properly", () => {
    const comp = render(<SimpleTicker duration={duration} separator="  " size="5" />)
    expect(comp.text()).toEqual("00d  00h  00m  01s")
  })

  it("renders properly when duration is over", () => {
    const zeroDuration = moment.duration(null)
    const comp = render(<SimpleTicker duration={zeroDuration} separator="  " size="5" />)
    expect(comp.text()).toEqual("00d  00h  00m  00s")
  })
})

describe("LabeledTicker", () => {
  it("renders properly", () => {
    const comp = render(<LabeledTicker duration={duration} renderSeparator={() => <Text>:</Text>} />)
    expect(comp.text()).toEqual("00d:00h:00m:01s")
  })
})
