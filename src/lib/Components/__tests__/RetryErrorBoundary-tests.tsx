import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import LoadFailureView from "../LoadFailureView"
import { RetryErrorBoundary } from "../RetryErrorBoundary"

beforeEach(() => {
  console.warn = jest.fn()
})

it("Renders the fallback view when the rendered component crashes", () => {
  const tree = renderer.create(<RetryErrorBoundary render={() => <CrashingComponent shouldCrash={true} />} />).toJSON()
  expect(tree).toMatchSnapshot()
})

it("passes false for isRetry to render prop on first pass", () => {
  let receivedIsRetry = true
  renderer.create(
    <RetryErrorBoundary
      render={({ isRetry }) => {
        receivedIsRetry = isRetry
        return <CrashingComponent shouldCrash={true} />
      }}
    />
  )
  expect(receivedIsRetry).toBeFalsy()
})

it("passes true for isRetry to render prop on retry", () => {
  let receivedIsRetry = false
  const tree = renderer.create(
    <RetryErrorBoundary
      render={({ isRetry }) => {
        receivedIsRetry = isRetry
        // Only crash on the first attempt, succeed on the retry.
        return <CrashingComponent shouldCrash={isRetry ? false : true} />
      }}
    />
  )
  // Simulate user pressing retry button
  tree.root.findAllByType(LoadFailureView)[0].props.onRetry()
  expect(receivedIsRetry).toBeTruthy()
})

const CrashingComponent: React.SFC<{ shouldCrash: boolean }> = ({ shouldCrash }) => {
  const thing: any = null
  if (shouldCrash && thing.thisshouldcrash) {
    return null
  }
  return null
}
