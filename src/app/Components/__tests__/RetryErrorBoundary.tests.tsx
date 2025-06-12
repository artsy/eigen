import { RetryErrorBoundary } from "app/Components/RetryErrorBoundary"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const consoleError = console.error
beforeEach(() => {
  console.error = jest.fn()
})
afterEach(() => {
  console.error = consoleError
})

describe("RetryErrorBoundary", () => {
  describe("when the rendered component crashes", () => {
    it("renders Unable to load", () => {
      const { getByText } = renderWithWrappers(
        <RetryErrorBoundary>
          <CrashingComponent shouldCrash />
        </RetryErrorBoundary>
      )

      expect(getByText("Unable to load")).toBeDefined()
    })
  })

  describe("when the rendered component crashes with a 404 status code", () => {
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
      const { getByText } = renderWithWrappers(
        <RetryErrorBoundary>
          <CrashingComponent shouldCrash error={error} />
        </RetryErrorBoundary>
      )

      expect(getByText("Not Found")).toBeDefined()
    })
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
