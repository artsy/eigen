import { Text } from "@artsy/palette-mobile"
import { screen } from "@testing-library/react-native"
import {
  TimeOffsetProvider,
  useTimeOffset,
} from "app/Components/Bidding/Context/TimeOffsetProvider"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import React from "react"
import { createMockEnvironment } from "relay-test-utils"

const SECONDS = 1000
const MINUTES = 60 * SECONDS
const DATE_NOW = 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds

const TestConsumer: React.FC = () => {
  const { timeOffsetInMilliSeconds } = useTimeOffset()

  return <Text>Time Offset: {timeOffsetInMilliSeconds}</Text>
}

describe("TimeOffsetProvider", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestWrapper = () => {
    return (
      <TimeOffsetProvider>
        <TestConsumer />
      </TimeOffsetProvider>
    )
  }

  beforeEach(() => {
    mockEnvironment = getMockRelayEnvironment()
    Date.now = jest.fn(() => DATE_NOW)
  })

  it("injects timeOffsetInMilliSeconds as a context", async () => {
    renderWithWrappers(<TestWrapper />)

    // Set up a situation where the phone's clock is ahead of Gravity's clock by 10 minutes.
    resolveMostRecentRelayOperation(mockEnvironment, {
      System: () => ({
        time: {
          unix: (DATE_NOW - 10 * MINUTES) * 1e-3,
        },
      }),
    })

    await screen.findByText(`Time Offset: ${10 * MINUTES}`)
  })
})
