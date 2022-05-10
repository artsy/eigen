import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers, renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import "react-native"

import { LoadFailureView } from "./LoadFailureView"
import { RetryErrorBoundary, RetryErrorBoundaryLegacy } from "./RetryErrorBoundary"

const consoleError = console.error
beforeEach(() => {
  console.error = jest.fn()
})
afterEach(() => {
  console.error = consoleError
})

describe("RetryErrorBoundary", () => {
  describe("when the rendered component crashes", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableCascadingEndTimerSalePageGrid: true,
      })
    })

    it("renders Unable to load", () => {
      const { getByText } = renderWithWrappersTL(
        <RetryErrorBoundary>
          <CrashingComponent shouldCrash />
        </RetryErrorBoundary>
      )

      expect(getByText("Unable to load")).toBeDefined()
    })
  })

  describe("when the rendered component crashes with a 404 status code", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCascadingEndTimerSalePageGrid: true })
    })

    const error = {
      res: {
        json: {
          errors: [
            {
              extensions: {
                httpStatusCodes: [404],
              },
            },
          ],
        },
      },
    }

    it("renders NotFoundFailureView", () => {
      const { getByText } = renderWithWrappersTL(
        <RetryErrorBoundary>
          <CrashingComponent shouldCrash error={error} />
        </RetryErrorBoundary>
      )

      expect(getByText("Not Found")).toBeDefined()
    })
  })
})
describe("RetryErrorBoundaryLegacy", () => {
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
})

const CrashingComponent: React.FC<{ shouldCrash: boolean; error?: any }> = ({
  shouldCrash,
  error,
}) => {
  if (shouldCrash && error) {
    throw error
  }

  const thing: any = null
  if (shouldCrash && thing.thisshouldcrash) {
    return null
  }
  return null
}
