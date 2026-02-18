import { renderHook } from "@testing-library/react-native"
import { useCompleteMyProfileStepsTestQuery } from "__generated__/useCompleteMyProfileStepsTestQuery.graphql"
import { CompleteMyProfileStore } from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { useCompleteMyProfileSteps } from "app/Scenes/CompleteMyProfile/hooks/useCompleteMyProfileSteps"
import { graphql, RelayEnvironmentProvider, useLazyLoadQuery } from "react-relay"
import { MockPayloadGenerator, createMockEnvironment } from "relay-test-utils"

const env = createMockEnvironment()

describe("useCompleteMyProfileSteps", () => {
  afterEach(() => {
    env.mockClear()
  })

  it("returns the next route and steps", () => {
    env.mock.queueOperationResolver((operation) =>
      MockPayloadGenerator.generate(operation, {
        Me: () => ({
          location: { display: "New York, NY" },
          profession: null,
          icon: null,
          isIdentityVerified: false,
        }),
      })
    )

    const { result } = renderHook(() => useCompleteMyProfileSteps(), { wrapper })

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
        Me: () => ({ isIdentityVerified: false }),
      })
    )

    const { result } = renderHook(() => useCompleteMyProfileSteps(), { wrapper })

    expect(result.current.steps).toEqual(["IdentityVerificationStep", "ChangesSummary"])
    expect(result.current.nextRoute("IdentityVerificationStep")).toBe("ChangesSummary")
  })
})

const wrapper = ({ children }: any) => (
  <RelayEnvironmentProvider environment={env}>
    <StoreWrapper>{children}</StoreWrapper>
  </RelayEnvironmentProvider>
)

const StoreWrapper = ({ children }: any) => {
  const data = useLazyLoadQuery<useCompleteMyProfileStepsTestQuery>(
    graphql`
      query useCompleteMyProfileStepsTestQuery {
        me @required(action: NONE) {
          ...useCompleteMyProfileSteps_me
        }
      }
    `,
    {}
  )

  return (
    <CompleteMyProfileStore.Provider runtimeModel={{ meKey: data?.me }}>
      {children}
    </CompleteMyProfileStore.Provider>
  )
}
