import { waitFor } from "@testing-library/react-native"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { Text } from "palette"
import PropTypes from "prop-types"
import React from "react"
import { TimeOffsetProvider } from "./TimeOffsetProvider"

const SECONDS = 1000
const MINUTES = 60 * SECONDS
const DATE_NOW = 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds

class TestConsumer extends React.Component {
  static contextTypes = {
    timeOffsetInMilliSeconds: PropTypes.number,
  }

  render() {
    return <Text>Time Offset: {this.context.timeOffsetInMilliSeconds}</Text>
  }
}

describe("TimeOffsetProvider", () => {
  const TestWrapper = () => {
    return (
      <TimeOffsetProvider>
        <TestConsumer />
      </TimeOffsetProvider>
    )
  }

  beforeEach(() => {
    Date.now = jest.fn(() => DATE_NOW)
  })

  it("injects timeOffsetInMilliSeconds as a context", async () => {
    const { queryByText } = renderWithWrappers(<TestWrapper />)

    // Set up a situation where the phone's clock is ahead of Gravity's clock by 10 minutes.
    resolveMostRecentRelayOperation({
      System: () => ({
        time: {
          unix: (DATE_NOW - 10 * MINUTES) * 1e-3,
        },
      }),
    })

    await waitFor(() => expect(queryByText(`Time Offset: ${10 * MINUTES}`)).toBeTruthy())
  })
})
