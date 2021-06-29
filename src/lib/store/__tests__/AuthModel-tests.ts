import { AccessToken, GraphRequest, LoginManager } from "react-native-fbsdk-next"
import { __globalStoreTestUtils__, GlobalStore } from "../GlobalStore"

const mockFetch = jest.fn()

;(global as any).fetch = mockFetch

function mockFetchResponseOnce(response: Partial<Response>) {
  mockFetch.mockResolvedValueOnce(response)
}
function mockFetchJsonOnce(json: object, status: number = 200) {
  mockFetch.mockResolvedValueOnce({
    status,
    json: () => Promise.resolve(json),
  })
}

beforeEach(() => {
  mockFetch.mockClear()
})

describe("AuthModel", () => {
  describe("xapp_token for making onboarding requests", () => {
    it("can be fetched from gravity", async () => {
      mockFetchJsonOnce({
        xapp_token: "my-special-token",
        expires_in: "never",
      })
      const token = await GlobalStore.actions.auth.getXAppToken()

      expect(token).toBe("my-special-token")
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch.mock.calls[0][0]).toMatchInlineSnapshot(
        `"https://stagingapi.artsy.net/api/v1/xapp_token?client_id=artsy_api_client_key&client_secret=artsy_api_client_secret"`
      )
    })

    it("are saved to the store", async () => {
      expect(__globalStoreTestUtils__?.getCurrentState().auth.xAppToken).toBe(null)

      mockFetchJsonOnce({
        xapp_token: "my-special-token",
        expires_in: "never",
      })
      await GlobalStore.actions.auth.getXAppToken()

      expect(__globalStoreTestUtils__?.getCurrentState().auth.xAppToken).toBe("my-special-token")
      expect(__globalStoreTestUtils__?.getCurrentState().auth.xApptokenExpiresIn).toBe("never")
    })

    it("will not be fetched more than once", async () => {
      mockFetchJsonOnce({
        xapp_token: "my-special-token",
        expires_in: "never",
      })
      await GlobalStore.actions.auth.getXAppToken()
      mockFetch.mockClear()
      const token = await GlobalStore.actions.auth.getXAppToken()
      expect(mockFetch).not.toHaveBeenCalled()
      expect(token).toBe("my-special-token")
    })
  })

  describe("userExists", () => {
    beforeEach(async () => {
      mockFetchJsonOnce({
        xapp_token: "my-special-token",
        expires_in: "never",
      })
      await GlobalStore.actions.auth.getXAppToken()
      mockFetch.mockClear()
    })

    it("makes a request to gravity's /user endpoint", async () => {
      mockFetchResponseOnce({ status: 200 })
      await GlobalStore.actions.auth.userExists({ email: "user@example.com" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch.mock.calls[0][0]).toMatchInlineSnapshot(
        `"https://stagingapi.artsy.net/api/v1/user?email=user%40example.com"`
      )
    })

    it("returns true if response is 200", async () => {
      mockFetchResponseOnce({ status: 200 })
      const result = await GlobalStore.actions.auth.userExists({ email: "user@example.com" })

      expect(result).toBe(true)
    })

    it("returns false if response is 404", async () => {
      mockFetchResponseOnce({ status: 404 })
      const result = await GlobalStore.actions.auth.userExists({ email: "user@example.com" })

      expect(result).toBe(false)
    })

    it("throws an error if something else happened", async () => {
      mockFetchResponseOnce({ status: 500, json: () => Promise.resolve({ error: "bad times" }) })
      let error: Error | null = null
      try {
        await GlobalStore.actions.auth.userExists({ email: "user@example.com" })
      } catch (e) {
        error = e
      }

      expect(error).not.toBe(null)
      expect(error).toMatchInlineSnapshot(`[Error: {"error":"bad times"}]`)
    })
  })

  describe("signIn", () => {
    beforeEach(async () => {
      mockFetchJsonOnce({
        xapp_token: "my-special-token",
        expires_in: "never",
      })
      await GlobalStore.actions.auth.getXAppToken()
      mockFetch.mockClear()
    })

    it("tries to get an access token from gravity", async () => {
      mockFetchJsonOnce(
        {
          access_token: "my-access-token",
          expires_in: "a billion years",
        },
        201
      )
      mockFetchJsonOnce({
        id: "my-user-id",
      })

      const result = await GlobalStore.actions.auth.signIn({
        email: "user@example.com",
        password: "hunter2",
      })

      expect(result).toBe(true)

      expect(mockFetch).toHaveBeenCalledTimes(2)
      expect(mockFetch.mock.calls[0][0]).toMatchInlineSnapshot(`"https://stagingapi.artsy.net/oauth2/access_token"`)
      expect(JSON.parse(mockFetch.mock.calls[0][1].body)).toMatchInlineSnapshot(`
        Object {
          "client_id": "artsy_api_client_key",
          "client_secret": "artsy_api_client_secret",
          "email": "user@example.com",
          "grant_type": "credentials",
          "password": "hunter2",
          "scope": "offline_access",
        }
      `)
    })

    it("fetches the user ID, then saves the token and expiry date in the store", async () => {
      mockFetchJsonOnce(
        {
          access_token: "my-access-token",
          expires_in: "a billion years",
        },
        201
      )
      mockFetchJsonOnce({
        id: "my-user-id",
      })
      await GlobalStore.actions.auth.signIn({
        email: "user@example.com",
        password: "hunter2",
      })

      expect(__globalStoreTestUtils__?.getCurrentState().auth.userAccessToken).toBe("my-access-token")
      expect(__globalStoreTestUtils__?.getCurrentState().auth.userAccessTokenExpiresIn).toBe("a billion years")
      expect(__globalStoreTestUtils__?.getCurrentState().auth.userID).toBe("my-user-id")
    })

    it("returns false if the token creation fails", async () => {
      mockFetchJsonOnce({ error: "bad times" }, 500)
      const result = await GlobalStore.actions.auth.signIn({
        email: "user@example.com",
        password: "hunter2",
      })
      expect(result).toBe(false)
    })
  })

  describe("signUp", () => {
    beforeEach(async () => {
      mockFetchJsonOnce({
        xapp_token: "my-special-token",
        expires_in: "never",
      })
      await GlobalStore.actions.auth.getXAppToken()
      mockFetch.mockClear()
    })

    it("creates the user account, fetches the user ID, then saves the onboardingState, token and expiry date in the store", async () => {
      mockFetchResponseOnce({ status: 201 })
      mockFetchJsonOnce(
        {
          access_token: "my-access-token",
          expires_in: "a billion years",
        },
        201
      )
      mockFetchJsonOnce({
        id: "my-user-id",
      })
      const result = await GlobalStore.actions.auth.signUp({
        email: "user@example.com",
        password: "validpassword",
        name: "full name",
      })

      expect(result).toBe(true)
      expect(__globalStoreTestUtils__?.getCurrentState().auth.onboardingState).toBe("incomplete")
      expect(__globalStoreTestUtils__?.getCurrentState().auth.userAccessToken).toBe("my-access-token")
      expect(__globalStoreTestUtils__?.getCurrentState().auth.userAccessTokenExpiresIn).toBe("a billion years")
      expect(__globalStoreTestUtils__?.getCurrentState().auth.userID).toBe("my-user-id")
    })

    it("returns false if the creating an account fails", async () => {
      mockFetchJsonOnce({ error: "bad times" }, 500)
      const result = await GlobalStore.actions.auth.signUp({
        email: "user@example.com",
        password: "validpassword",
        name: "full name",
      })
      expect(result).toBe(false)
    })
  })

  describe("authFacebook", () => {
    beforeEach(async () => {
      mockFetchJsonOnce({
        xapp_token: "my-special-token",
        expires_in: "never",
      })
      await GlobalStore.actions.auth.getXAppToken()
      mockFetch.mockClear()
      ;(LoginManager.logInWithPermissions as jest.Mock).mockReturnValue({ isCancelled: false })
      ;(AccessToken.getCurrentAccessToken as jest.Mock).mockReturnValue({ accessToken: "facebook-token" })
      ;(GraphRequest as jest.Mock).mockImplementation((_route, _config, callback) => {
        callback(undefined, { email: "emailFromFacebook@email.com", name: "name from facebook" })
      })
    })

    it("throws an error when email permission was denied", async () => {
      ;(LoginManager.logInWithPermissions as jest.Mock).mockReturnValue({ declinedPermissions: ["email"] })

      const result = await GlobalStore.actions.auth.authFacebook({ signInOrUp: "signUp" }).catch((e) => e)

      expect(LoginManager.logInWithPermissions).toHaveBeenCalledWith(["public_profile", "email"])
      expect(result).toBe("Please allow the use of email to continue.")
    })

    it("throws an error if user don't have an email", async () => {
      ;(GraphRequest as jest.Mock).mockImplementation((_route, _config, callback) => {
        callback(undefined, { name: "name from facebook" })
      })

      const result = await GlobalStore.actions.auth.authFacebook({ signInOrUp: "signUp" }).catch((e) => e)

      expect(result).toBe(
        "We can’t find an email associated with your Facebook account. Please sign up with your email and password."
      )
    })

    it("fetches access token from facebook", async () => {
      GlobalStore.actions.auth.signUp = jest.fn(() => true) as any

      await GlobalStore.actions.auth.authFacebook({ signInOrUp: "signUp" })

      expect(AccessToken.getCurrentAccessToken).toHaveBeenCalled()
    })

    it("throws an error if fetching data from facebook fails", async () => {
      ;(GraphRequest as jest.Mock).mockImplementation((_route, _config, callback) => {
        callback({ message: "fetching fb data error" }, undefined)
      })

      const result = await GlobalStore.actions.auth.authFacebook({ signInOrUp: "signUp" }).catch((e) => e)

      expect(result).toBe("Error fetching facebook data: fetching fb data error")
    })

    it("fetches profile info from facebook and signs up", async () => {
      GlobalStore.actions.auth.signUp = jest.fn(() => true) as any

      await GlobalStore.actions.auth.authFacebook({ signInOrUp: "signUp" })

      expect(GlobalStore.actions.auth.signUp).toHaveBeenCalledWith({
        email: "emailFromFacebook@email.com",
        name: "name from facebook",
        accessToken: "facebook-token",
        oauthProvider: "facebook",
      })
    })

    it("throws an error if sign up fails", async () => {
      GlobalStore.actions.auth.signUp = jest.fn(() => false) as any

      const result = await GlobalStore.actions.auth.authFacebook({ signInOrUp: "signUp" }).catch((e) => e)

      expect(result).toBe("Failed to sign up.")
    })

    it("fetches profile info from facebook and signs in", async () => {
      mockFetchJsonOnce({ access_token: "x-access-token" }, 201)
      mockFetchJsonOnce({ email: "emailFromArtsy@mail.com" })
      GlobalStore.actions.auth.signIn = jest.fn(() => true) as any

      await GlobalStore.actions.auth.authFacebook({ signInOrUp: "signIn" })

      expect(GlobalStore.actions.auth.signIn).toHaveBeenCalledWith({
        email: "emailFromArtsy@mail.com",
        accessToken: "facebook-token",
        oauthProvider: "facebook",
      })
    })

    it("throws an error if getting X-ACCESS-TOKEN fails", async () => {
      mockFetchJsonOnce({ error_description: "getting X-ACCESS-TOKEN error" })

      const result = await GlobalStore.actions.auth.authFacebook({ signInOrUp: "signIn" }).catch((e) => e)

      expect(result).toBe("Failed to get gravity token from gravity: getting X-ACCESS-TOKEN error")
    })
  })
})
