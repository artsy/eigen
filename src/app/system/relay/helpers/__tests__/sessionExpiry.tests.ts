import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import {
  __resetSessionExpiryTrackingForTests,
  enforceSessionExpiry,
} from "app/system/relay/helpers/sessionExpiry"

const signOutCount = () =>
  (__globalStoreTestUtils__?.dispatchedActions ?? []).filter(
    (action) => action.type === "@thunk.auth.signOut(success)"
  ).length

describe("enforceSessionExpiry", () => {
  beforeEach(() => {
    fetchMock.resetMocks()
    __resetSessionExpiryTrackingForTests()
    // Signing out replaces the store, so each spec needs a fresh one to count its own actions.
    __globalStoreTestUtils__?.reset()
  })

  it("signs the user out only once per dead token", async () => {
    fetchMock.mockResponse("", { status: 401 })

    await enforceSessionExpiry("expired-token")
    await enforceSessionExpiry("expired-token")

    // Three /me attempts for the first call, none for the second.
    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(signOutCount()).toBe(1)
  })

  it("does nothing without a token", async () => {
    await enforceSessionExpiry(undefined)

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("keeps the session when /me answers", async () => {
    fetchMock.mockResponse("", { status: 200 })

    await enforceSessionExpiry("valid-token")

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(signOutCount()).toBe(0)
  })
})
