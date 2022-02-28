import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import "react-native"

import { LoadFailureView } from "./LoadFailureView"
import { RetryErrorBoundaryLegacy } from "./RetryErrorBoundary"

const consoleError = console.error
beforeEach(() => {
  console.error = jest.fn()
})
afterEach(() => {
  console.error = consoleError
})

it("Renders the fallback view when the rendered component crashes", () => {
  const tree = renderWithWrappers(
    <RetryErrorBoundaryLegacy render={() => <CrashingComponent shouldCrash />} />
  )
  expect(tree.root.findAllByType(LoadFailureView)).toHaveLength(1)
})

it("passes false for isRetry to render prop on first pass", () => {
  let receivedIsRetry = true
  renderWithWrappers(
    <RetryErrorBoundaryLegacy
      render={({ isRetry }) => {
        receivedIsRetry = isRetry
        return <CrashingComponent shouldCrash />
      }}
    />
  )
  expect(receivedIsRetry).toBeFalsy()
})

it("passes true for isRetry to render prop on retry", () => {
  let receivedIsRetry = false
  const tree = renderWithWrappers(
    <RetryErrorBoundaryLegacy
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

const CrashingComponent: React.FC<{ shouldCrash: boolean }> = ({ shouldCrash }) => {
  const thing: any = null
  if (shouldCrash && thing.thisshouldcrash) {
    return null
  }
  return null
}
