import { mount } from "enzyme"
import * as PropTypes from "prop-types"
import React from "react"
import { View } from "react-native"

import { BiddingThemeProvider } from "../../Components/BiddingThemeProvider"
import { TimeOffsetProvider } from "../TimeOffsetProvider"

// tslint:disable-next-line:no-var-requires
const RelayRuntime = require("relay-runtime")
RelayRuntime.fetchQuery = jest.fn()

const SECONDS = 1000
const MINUTES = 60 * SECONDS

export class TestConsumer extends React.Component {
  static contextTypes = {
    timeOffsetInMilliSeconds: PropTypes.number,
  }

  render() {
    return <View />
  }
}

const dateNow = 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds

it("injects timeOffsetInMilliSeconds as a context", async () => {
  jest.useFakeTimers()
  Date.now = () => dateNow

  // Set up a situation where the phone's clock is ahead of Gravity's clock by 10 minutes.
  RelayRuntime.fetchQuery.mockReturnValueOnce(
    Promise.resolve({
      system: {
        time: {
          unix: (dateNow - 10 * MINUTES) * 1e-3,
        },
      },
    })
  )

  // There’s no explicit assertion made here, because this test would fail with a timeout if it wouldn’t find a match.
  await mount(
    <BiddingThemeProvider>
      <TimeOffsetProvider>
        <TestConsumer />
      </TimeOffsetProvider>
    </BiddingThemeProvider>
  ).renderUntil(wrapper => {
    return wrapper.find(TestConsumer).instance().context.timeOffsetInMilliSeconds === 10 * MINUTES
  })
})
