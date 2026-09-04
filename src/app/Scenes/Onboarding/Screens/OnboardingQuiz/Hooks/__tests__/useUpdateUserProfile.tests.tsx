import { act, renderHook } from "@testing-library/react-native"
import { useUpdateUserProfile } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/Hooks/useUpdateUserProfile"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { RelayEnvironmentProvider } from "react-relay"
import { MockPayloadGenerator } from "relay-test-utils"

const setup = (onMutationComplete?: () => void) => {
  return renderHook(() => useUpdateUserProfile(onMutationComplete), {
    wrapper: ({ children }: any) => (
      <RelayEnvironmentProvider environment={getMockRelayEnvironment()}>
        {children}
      </RelayEnvironmentProvider>
    ),
  })
}

describe("useUpdateUserProfile", () => {
  it("calls onMutationComplete when the mutation succeeds and a callback is provided", () => {
    const onMutationComplete = jest.fn()
    const { result } = setup(onMutationComplete)

    act(() => {
      result.current.commitMutation({ completedOnboarding: true })
    })

    const environment = getMockRelayEnvironment()
    act(() => {
      environment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation)
      )
    })

    expect(onMutationComplete).toHaveBeenCalled()
  })

  it("does not throw when the mutation succeeds and no callback is provided", () => {
    const { result } = setup()

    act(() => {
      result.current.commitMutation({ completedOnboarding: true })
    })

    const environment = getMockRelayEnvironment()
    expect(() => {
      act(() => {
        environment.mock.resolveMostRecentOperation((operation) =>
          MockPayloadGenerator.generate(operation)
        )
      })
    }).not.toThrow()
  })

  it("does not throw when the mutation fails and no callback is provided", () => {
    jest.spyOn(console, "error").mockImplementation()
    const { result } = setup()

    act(() => {
      result.current.commitMutation({ completedOnboarding: true })
    })

    const environment = getMockRelayEnvironment()
    expect(() => {
      act(() => {
        environment.mock.rejectMostRecentOperation(new Error("network error"))
      })
    }).not.toThrow()
  })
})
