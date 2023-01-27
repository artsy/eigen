import { waitFor } from "@testing-library/react-native"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Text } from "palette"
import PropTypes from "prop-types"
import React from "react"
import { graphql } from "react-relay"
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
  const { renderWithRelay } = setupTestWrapper<TimeOffsetProviderTestsQuery>({
    Component: () => (
      <TimeOffsetProvider>
        <TestConsumer />
      </TimeOffsetProvider>
    ),
    query: graphql`
      query TimeOffsetProviderTestsQuery @relay_test_operation {
        system {
          time {
            unix
          }
        }
      }
    `,
  })

  beforeEach(() => {
    Date.now = jest.fn(() => DATE_NOW)
  })

  it("injects timeOffsetInMilliSeconds as a context", async () => {
    const { queryByText } = renderWithRelay({
      System: () => ({
        time: {
          unix: (DATE_NOW - 10 * MINUTES) * 1e-3,
        },
      }),
    })

    await waitFor(() => expect(queryByText(`Time Offset: ${10 * MINUTES}`)).toBeTruthy())
  })
})
