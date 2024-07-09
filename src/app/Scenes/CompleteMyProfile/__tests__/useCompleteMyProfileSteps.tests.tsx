import { renderHook } from "@testing-library/react-hooks"
import { useCompleteMyProfileStepsTestsQuery } from "__generated__/useCompleteMyProfileStepsTestsQuery.graphql"
import { useCompleteMyProfileSteps } from "app/Scenes/CompleteMyProfile/useCompleteMyProfileSteps"
import { graphql } from "react-relay"
import { RelayEnvironmentProvider, useLazyLoadQuery } from "react-relay/hooks"
import { MockPayloadGenerator, createMockEnvironment } from "relay-test-utils"

const env = createMockEnvironment()

describe("useCompleteMyProfileSteps", () => {
  afterEach(() => {
    env.mockClear()
  })

  it("returns the next route and steps", async () => {
    env.mock.queueOperationResolver((operation) =>
      MockPayloadGenerator.generate(operation, {
        Me: () => ({
          collectorProfile: {
            location: { display: "New York, NY" },
            profession: null,
            icon: null,
            isIdentityVerified: false,
          },
        }),
      })
    )

    const { result: wrapperResult } = renderHook(() => useTestWrapper(), { wrapper })

    const { result } = renderHook(
      () => useCompleteMyProfileSteps({ collectorProfile: wrapperResult.current.data?.me }),
      { wrapper }
    )

    expect(result.current.steps).toEqual([
      "ProfessionStep",
      "AvatarStep",
      "IdentityVerificationStep",
      "ChangesSummary",
    ])
    expect(result.current.nextRoute("ProfessionStep")).toBe("AvatarStep")
  })

  it("returns only 2 steps given only 1 field missing", () => {
    env.mock.queueOperationResolver((operation) =>
      MockPayloadGenerator.generate(operation, {
        Me: () => ({
          collectorProfile: {
            isIdentityVerified: false,
          },
        }),
      })
    )

    const { result: wrapperResult } = renderHook(() => useTestWrapper(), { wrapper })

    const { result } = renderHook(
      () => useCompleteMyProfileSteps({ collectorProfile: wrapperResult.current.data?.me }),
      { wrapper }
    )

    expect(result.current.steps).toEqual(["IdentityVerificationStep", "ChangesSummary"])
    expect(result.current.nextRoute("IdentityVerificationStep")).toBe("ChangesSummary")
  })
})

const wrapper = ({ children }: any) => (
  <RelayEnvironmentProvider environment={env}>{children}</RelayEnvironmentProvider>
)

const useTestWrapper = () => {
  const data = useLazyLoadQuery<useCompleteMyProfileStepsTestsQuery>(query, {})

  return { data }
}

const query = graphql`
  query useCompleteMyProfileStepsTestsQuery @relay_test_operation {
    me {
      ...useCompleteMyProfileSteps_collectorProfile
    }
  }
`
