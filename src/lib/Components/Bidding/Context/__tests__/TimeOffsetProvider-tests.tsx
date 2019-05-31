import * as PropTypes from "prop-types"
import React from "react"
import { View } from "react-native"
import * as renderer from "react-test-renderer"

import { TimeOffsetProvider } from "../TimeOffsetProvider"

jest.mock("../../../../metaphysics", () => ({ metaphysics: jest.fn() }))
import { Theme } from "@artsy/palette"
import { metaphysics } from "../../../../metaphysics"
const mockphysics = metaphysics as jest.Mock<any>

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

it("injects timeOffsetInMilliSeconds as a context", () => {
  jest.useFakeTimers()
  Date.now = () => dateNow

  // Set up a situation where the phone's clock is ahead of Gravity's clock by 10 minutes.
  mockphysics.mockReturnValueOnce(
    Promise.resolve({
      data: {
        system: {
          time: {
            unix: (dateNow - 10 * MINUTES) * 1e-3,
          },
        },
      },
    })
  )

  const component = renderer.create(
    <Theme>
      <TimeOffsetProvider>
        <TestConsumer />
      </TimeOffsetProvider>
    </Theme>
  )

  jest.runAllTicks()

  const consumer = component.root.findByType(TestConsumer)

  expect(consumer.instance.context).toEqual({ timeOffsetInMilliSeconds: 10 * MINUTES })
})
