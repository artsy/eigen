import { followProfileMutationConfig } from "app/utils/mutations/useFollowProfile"
import { followShowMutationConfig } from "app/utils/mutations/useFollowShow"

describe("followShowMutationConfig", () => {
  const opts = { id: "node-id", internalID: "internal-id", isFollowed: false }

  it("asks to follow when not followed", () => {
    expect(followShowMutationConfig(opts).variables).toEqual({
      input: { partnerShowID: "internal-id", unfollow: false },
    })
  })

  it("asks to unfollow when followed", () => {
    expect(followShowMutationConfig({ ...opts, isFollowed: true }).variables).toEqual({
      input: { partnerShowID: "internal-id", unfollow: true },
    })
  })

  it("includes the node id in the optimistic response, so Relay can merge it", () => {
    // The previous sub-project shipped an updater that omitted this and silently did nothing.
    expect(followShowMutationConfig(opts).optimisticResponse).toEqual({
      followShow: { show: { id: "node-id", internalID: "internal-id", isFollowed: true } },
    })
  })

  it("writes the unaliased isFollowed field through the updater", () => {
    const setValue = jest.fn()
    const store = { get: jest.fn().mockReturnValue({ setValue }) } as any

    followShowMutationConfig(opts).optimisticUpdater(store)

    expect(store.get).toHaveBeenCalledWith("node-id")
    expect(setValue).toHaveBeenCalledWith(true, "isFollowed")
  })
})

describe("followProfileMutationConfig", () => {
  const opts = { id: "profile-node-id", internalID: "profile-internal-id", isFollowed: false }

  it("asks to follow the profile when not followed", () => {
    expect(followProfileMutationConfig(opts).variables).toEqual({
      input: { profileID: "profile-internal-id", unfollow: false },
    })
  })

  it("asks to unfollow when followed", () => {
    expect(followProfileMutationConfig({ ...opts, isFollowed: true }).variables).toEqual({
      input: { profileID: "profile-internal-id", unfollow: true },
    })
  })

  it("includes the node id in the optimistic response", () => {
    expect(followProfileMutationConfig(opts).optimisticResponse).toEqual({
      followProfile: {
        profile: { id: "profile-node-id", internalID: "profile-internal-id", isFollowed: true },
      },
    })
  })

  it("writes the follow state through its updater", () => {
    const setValue = jest.fn()
    const store = { get: jest.fn().mockReturnValue({ setValue }) } as any

    followProfileMutationConfig(opts).optimisticUpdater(store)

    expect(store.get).toHaveBeenCalledWith("profile-node-id")
    expect(setValue).toHaveBeenCalled()
  })
})
