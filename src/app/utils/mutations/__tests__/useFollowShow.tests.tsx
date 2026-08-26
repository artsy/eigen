import { act, renderHook } from "@testing-library/react-native"
import { GlobalStoreProvider } from "app/store/GlobalStore"
import { useFollowShow } from "app/utils/mutations/useFollowShow"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

const env = createMockEnvironment()

const wrapper = ({ children }: any) => (
  <RelayEnvironmentProvider environment={env}>
    <GlobalStoreProvider>{children}</GlobalStoreProvider>
  </RelayEnvironmentProvider>
)

describe("useFollowShow", () => {
  afterEach(() => {
    env.mockClear()
  })

  it("sends unfollow false when the show is not followed", () => {
    const { result } = renderHook(
      () => useFollowShow({ id: "node-id", internalID: "internal-id", isFollowed: false }),
      { wrapper }
    )

    act(() => result.current.followShow())

    expect(env.mock.getMostRecentOperation().request.variables).toEqual({
      input: { partnerShowID: "internal-id", unfollow: false },
    })
  })

  it("sends unfollow true when the show is already followed", () => {
    const { result } = renderHook(
      () => useFollowShow({ id: "node-id", internalID: "internal-id", isFollowed: true }),
      { wrapper }
    )

    act(() => result.current.followShow())

    expect(env.mock.getMostRecentOperation().request.variables).toEqual({
      input: { partnerShowID: "internal-id", unfollow: true },
    })
  })

  it("accepts an undefined isFollowed and treats it as not followed", () => {
    const { result } = renderHook(
      () => useFollowShow({ id: "node-id", internalID: "internal-id", isFollowed: undefined }),
      { wrapper }
    )

    act(() => result.current.followShow())

    expect(env.mock.getMostRecentOperation().request.variables).toEqual({
      input: { partnerShowID: "internal-id", unfollow: false },
    })
  })

  it("calls onCompleted with the next followed state", () => {
    const onCompleted = jest.fn()
    const { result } = renderHook(
      () =>
        useFollowShow({
          id: "node-id",
          internalID: "internal-id",
          isFollowed: false,
          onCompleted,
        }),
      { wrapper }
    )

    act(() => result.current.followShow())
    act(() => {
      env.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation))
    })

    expect(onCompleted).toHaveBeenCalledWith(true)
  })
})
