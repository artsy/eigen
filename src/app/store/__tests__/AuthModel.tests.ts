import { appleAuth } from "@invertase/react-native-apple-authentication"
import Cookies from "@react-native-cookies/cookies"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { AuthError } from "app/store/AuthError"
import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"
import { mockPostEventToProviders } from "app/utils/tests/globallyMockedStuff"
import { jwtDecode } from "jwt-decode"
import { Platform } from "react-native"
import {
  AccessToken,
  AuthenticationToken,
  GraphRequest,
  LoginManager,
} from "react-native-fbsdk-next"
import Keychain from "react-native-keychain"

const mockFetch = jest.fn()
;(global as any).fetch = mockFetch

// Mocks for Facebook Login
const mockJwtDecode = jwtDecode as jest.Mock
const mockLogInWithPermissions = LoginManager.logInWithPermissions as jest.Mock
const mockGetCurrentAccessToken = AccessToken.getCurrentAccessToken as jest.Mock
const mockGetAuthenticationTokenIOS = AuthenticationToken.getAuthenticationTokenIOS as jest.Mock
const mockGraphRequest = GraphRequest as jest.Mock

// Mocks for Google Sign-In
const mockHasPlayServices = GoogleSignin.hasPlayServices as jest.Mock
const mockGoogleSignIn = GoogleSignin.signIn as jest.Mock
const mockGoogleGetTokens = GoogleSignin.getTokens as jest.Mock

// Mocks for Sign in with Apple
const mockApplePerformRequest = appleAuth.performRequest as jest.Mock

function mockFetchResponseOnce(response: Partial<Response>) {
  mockFetch.mockResolvedValueOnce(response)
}

function mockFetchJsonOnce(json: object, status = 200) {
  mockFetch.mockResolvedValueOnce({
    status,
    json: () => Promise.resolve(json),
  })
}

beforeEach(() => {
  mockFetch.mockClear()
})

const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

describe("AuthModel", () => {
  describe("xapp_token for making onboarding requests", () => {
    afterEach(() => {
      // reset mockFetchJsonOnce to avoid side effects between tests
      mockFetch.mockReset()
    })

    it("can be fetched from gravity", async () => {
      mockFetchJsonOnce({
        xapp_token: "my-special-token",
        expires_in: oneWeekFromNow,
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
        expires_in: oneWeekFromNow,
      })
      await GlobalStore.actions.auth.getXAppToken()

      expect(__globalStoreTestUtils__?.getCurrentState().auth.xAppToken).toBe("my-special-token")
      expect(__globalStoreTestUtils__?.getCurrentState().auth.xApptokenExpiresIn).toBe(
        oneWeekFromNow
      )
    })

    it("will be fetched again if the token is expired", async () => {
      __globalStoreTestUtils__?.injectState({
        auth: {
          xAppToken: "my-special-token",
          xApptokenExpiresIn: oneWeekAgo,
        },
      })

      mockFetchJsonOnce({
        xapp_token: "my-new-special-token",
        expires_in: oneWeekFromNow,
      })

      const token = await GlobalStore.actions.auth.getXAppToken()

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(token).toBe("my-new-special-token")
      expect(__globalStoreTestUtils__?.getCurrentState().auth.xAppToken).toBe(
        "my-new-special-token"
      )
      expect(__globalStoreTestUtils__?.getCurrentState().auth.xApptokenExpiresIn).toBe(
        oneWeekFromNow
      )
    })

    it("will be fetched again if the token expires in the next 5 mins", async () => {
      const fiveMinsFromNow = new Date(Date.now() + 5 * 60 * 1000).toISOString()

      __globalStoreTestUtils__?.injectState({
        auth: {
          xAppToken: "my-special-token",
          xApptokenExpiresIn: fiveMinsFromNow,
        },
      })

      mockFetchJsonOnce({
        xapp_token: "my-new-special-token",
        expires_in: oneWeekFromNow,
      })

      await GlobalStore.actions.auth.getXAppToken()

      expect(__globalStoreTestUtils__?.getCurrentState().auth.xAppToken).toBe(
        "my-new-special-token"
      )
      expect(__globalStoreTestUtils__?.getCurrentState().auth.xApptokenExpiresIn).toBe(
        oneWeekFromNow
      )
    })

    it("will not be fetched more than once", async () => {
      mockFetchJsonOnce({
        xapp_token: "my-special-token",
        expires_in: oneWeekFromNow,
      })
      await GlobalStore.actions.auth.getXAppToken()
      mockFetch.mockClear()
      const token = await GlobalStore.actions.auth.getXAppToken()
      expect(mockFetch).not.toHaveBeenCalled()
      expect(token).toBe("my-special-token")
    })
  })

  describe("signIn", () => {
    beforeEach(async () => {
      mockFetchJsonOnce({
        xapp_token: "my-special-token",
        expires_in: oneWeekFromNow,
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
        oauthProvider: "email",
        oauthMode: "email",
        email: "user@example.com", // pragma: allowlist secret
        password: "hunter2", // pragma: allowlist secret
      })

      expect(result).toBe("success")

      expect(mockFetch).toHaveBeenCalledTimes(2)
      expect(mockFetch.mock.calls[0][0]).toMatchInlineSnapshot(
        `"https://stagingapi.artsy.net/oauth2/access_token"`
      )
      expect(JSON.parse(mockFetch.mock.calls[0][1].body)).toEqual({
        client_id: "artsy_api_client_key",
        client_secret: "artsy_api_client_secret", // pragma: allowlist secret
        email: "user@example.com", // pragma: allowlist secret
        grant_type: "credentials",
        oauth_provider: "email",
        password: "hunter2", // pragma: allowlist secret
        scope: "offline_access",
      })
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
        oauthProvider: "email",
        oauthMode: "email",
        email: "user@example.com",
        password: "hunter2", // pragma: allowlist secret
      })

      expect(__globalStoreTestUtils__?.getCurrentState().auth.userAccessToken).toBe(
        "my-access-token"
      )
      expect(__globalStoreTestUtils__?.getCurrentState().auth.userAccessTokenExpiresIn).toBe(
        "a billion years"
      )
      expect(__globalStoreTestUtils__?.getCurrentState().auth.userID).toBe("my-user-id")
    })

    it("tracks successful login event", async () => {
      mockFetchJsonOnce({ access_token: "my-access-token", expires_in: "a billion years" }, 201)
      mockFetchJsonOnce({ id: "my-user-id" })

      await GlobalStore.actions.auth.signIn({
        oauthProvider: "email",
        oauthMode: "email",
        email: "user@example.com",
        password: "hunter2", // pragma: allowlist secret
      })

      expect(mockPostEventToProviders).toHaveBeenCalledTimes(1)
      expect(mockPostEventToProviders.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "successfullyLoggedIn",
            "service": "email",
          },
        ]
      `)
    })

    it("returns 'failure' if the token creation fails", async () => {
      mockFetchJsonOnce({ error: "bad times" }, 500)
      const result = await GlobalStore.actions.auth.signIn({
        oauthProvider: "email",
        oauthMode: "email",
        email: "user@example.com",
        password: "hunter2", // pragma: allowlist secret
      })
      expect(result).toBe("failure")
    })

    it("does not clear recent searches if user id has not changed after the previous session", async () => {
      const clearRecentSearchesSpy = jest.spyOn(GlobalStore.actions.search, "clearRecentSearches")
      __globalStoreTestUtils__?.injectState({
        auth: {
          userID: null,
          previousSessionUserID: "my-user-id",
        },
      })
      mockFetchJsonOnce({ access_token: "my-access-token" }, 201)
      mockFetchJsonOnce({
        id: "my-user-id",
      })
      await GlobalStore.actions.auth.signIn({
        oauthProvider: "email",
        oauthMode: "email",
        email: "user@example.com",
        password: "hunter2", // pragma: allowlist secret
      })
      expect(clearRecentSearchesSpy).not.toHaveBeenCalled()
    })

    it("clears recent searches if user id has changed after the previous session", async () => {
      const clearRecentSearchesSpy = jest.spyOn(GlobalStore.actions.search, "clearRecentSearches")
      __globalStoreTestUtils__?.injectState({
        auth: {
          userID: null,
          previousSessionUserID: "prev-user-id",
        },
      })
      mockFetchJsonOnce({ access_token: "my-access-token" }, 201)
      mockFetchJsonOnce({
        id: "my-user-id",
      })
      await GlobalStore.actions.auth.signIn({
        oauthProvider: "email",
        oauthMode: "email",
        email: "user@example.com",
        password: "hunter2", // pragma: allowlist secret
      })
      expect(clearRecentSearchesSpy).toHaveBeenCalled()
    })

    it("does not reset progressive onboarding if user id has not changed after the previous session", async () => {
      const resetProgressiveOnboardingSpy = jest.spyOn(
        GlobalStore.actions.progressiveOnboarding,
        "reset"
      )
      __globalStoreTestUtils__?.injectState({
        auth: {
          userID: null,
          previousSessionUserID: "my-user-id",
        },
      })
      mockFetchJsonOnce({ access_token: "my-access-token" }, 201)
      mockFetchJsonOnce({
        id: "my-user-id",
      })
      await GlobalStore.actions.auth.signIn({
        oauthProvider: "email",
        oauthMode: "email",
        email: "user@example.com",
        password: "hunter2", // pragma: allowlist secret
      })
      expect(resetProgressiveOnboardingSpy).not.toHaveBeenCalled()
    })

    it("resets progressive onboarding if user id has changed after the previous session", async () => {
      const resetProgressiveOnboardingSpy = jest.spyOn(
        GlobalStore.actions.progressiveOnboarding,
        "reset"
      )
      __globalStoreTestUtils__?.injectState({
        auth: {
          userID: null,
          previousSessionUserID: "prev-user-id",
        },
      })
      mockFetchJsonOnce({ access_token: "my-access-token" }, 201)
      mockFetchJsonOnce({
        id: "my-user-id",
      })
      await GlobalStore.actions.auth.signIn({
        oauthProvider: "email",
        oauthMode: "email",
        email: "user@example.com",
        password: "hunter2", // pragma: allowlist secret
      })
      expect(resetProgressiveOnboardingSpy).toHaveBeenCalled()
    })

    it("saves credentials to keychain", async () => {
      mockFetchJsonOnce({ access_token: "my-access-token" }, 201)
      mockFetchJsonOnce({ id: "my-user-id" })
      await GlobalStore.actions.auth.signIn({
        oauthProvider: "email",
        oauthMode: "email",
        email: "user@example.com",
        password: "hunter2", // pragma: allowlist secret
      })
      expect(Keychain.setInternetCredentials).toHaveBeenCalled()
    })

    describe("The recent price ranges", () => {
      it("does not clear if user id has not changed after the previous session", async () => {
        const clearAllPriceRangesSpy = jest.spyOn(
          GlobalStore.actions.recentPriceRanges,
          "clearAllPriceRanges"
        )
        __globalStoreTestUtils__?.injectState({
          auth: {
            userID: null,
            previousSessionUserID: "my-user-id",
          },
        })
        mockFetchJsonOnce({ access_token: "my-access-token" }, 201)
        mockFetchJsonOnce({
          id: "my-user-id",
        })
        await GlobalStore.actions.auth.signIn({
          oauthProvider: "email",
          oauthMode: "email",
          email: "user@example.com",
          password: "hunter2", // pragma: allowlist secret
        })
        expect(clearAllPriceRangesSpy).not.toHaveBeenCalled()
      })

      it("clears if user id has changed after the previous session", async () => {
        const clearAllPriceRangesSpy = jest.spyOn(
          GlobalStore.actions.recentPriceRanges,
          "clearAllPriceRanges"
        )
        __globalStoreTestUtils__?.injectState({
          auth: {
            userID: null,
            previousSessionUserID: "prev-user-id",
          },
        })
        mockFetchJsonOnce({ access_token: "my-access-token" }, 201)
        mockFetchJsonOnce({
          id: "my-user-id",
        })
        await GlobalStore.actions.auth.signIn({
          oauthProvider: "email",
          oauthMode: "email",
          email: "user@example.com",
          password: "hunter2", // pragma: allowlist secret
        })
        expect(clearAllPriceRangesSpy).toHaveBeenCalled()
      })
    })
  })

  describe("signUp", () => {
    beforeEach(async () => {
      mockFetchJsonOnce({
        xapp_token: "my-special-token",
        expires_in: oneWeekFromNow,
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
        oauthProvider: "email",
        oauthMode: "email",
        email: "user@example.com",
        password: "validpassword", // pragma: allowlist secret
        name: "full name",
        agreedToReceiveEmails: false,
      })

      expect(result.success).toBe(true)
      expect(__globalStoreTestUtils__?.getCurrentState().onboarding.onboardingState).toBe(
        "incomplete"
      )
      expect(__globalStoreTestUtils__?.getCurrentState().auth.userAccessToken).toBe(
        "my-access-token"
      )
      expect(__globalStoreTestUtils__?.getCurrentState().auth.userAccessTokenExpiresIn).toBe(
        "a billion years"
      )
      expect(__globalStoreTestUtils__?.getCurrentState().auth.userID).toBe("my-user-id")
    })

    it("returns false if the creating an account fails", async () => {
      mockFetchJsonOnce({ error: "bad times" }, 500)
      const result = await GlobalStore.actions.auth.signUp({
        oauthProvider: "email",
        oauthMode: "email",
        email: "user@example.com",
        password: "validpassword", // pragma: allowlist secret
        name: "full name",
        agreedToReceiveEmails: false,
      })
      expect(result.success).toBe(false)
    })
  })

  describe("authFacebook", () => {
    beforeEach(async () => {
      mockFetchJsonOnce({
        xapp_token: "my-special-token",
        expires_in: oneWeekFromNow,
      })
      await GlobalStore.actions.auth.getXAppToken()
      mockFetch.mockClear()
      mockLogInWithPermissions.mockReturnValue({ isCancelled: false })
      mockGetCurrentAccessToken.mockReturnValue({
        accessToken: "facebook-token",
      })
      mockGraphRequest.mockImplementation((_route, _config, callback) => {
        callback(undefined, { email: "emailFromFacebook@email.com", name: "name from facebook" })
      })
    })

    it("throws an error when email permission was denied", async () => {
      mockLogInWithPermissions.mockReturnValue({
        declinedPermissions: ["email"],
      })

      const result = await GlobalStore.actions.auth
        .authFacebook({ signInOrUp: "signUp", agreedToReceiveEmails: true })
        .catch((e) => e)

      expect(LoginManager.logInWithPermissions).toHaveBeenCalledWith(
        ["public_profile", "email"],
        "limited"
      )
      const expectedError = new AuthError(
        "Please allow the use of email to continue.",
        "Email Permission Declined"
      )
      expect(result).toMatchObject(expectedError)
    })

    describe("Limited login - iOS", () => {
      beforeEach(() => {
        Platform.OS = "ios"
        mockGetAuthenticationTokenIOS.mockReturnValue({
          authenticationToken: "facebook-jwt",
        })
      })

      it("fetches jwt from facebook", async () => {
        GlobalStore.actions.auth.signUp = jest.fn(() => ({ success: true })) as any
        mockJwtDecode.mockReturnValue({
          email: "test@example.com",
          name: "Test User",
        })
        await GlobalStore.actions.auth.authFacebook({
          signInOrUp: "signUp",
          agreedToReceiveEmails: true,
        })

        expect(AuthenticationToken.getAuthenticationTokenIOS).toHaveBeenCalled()
      })

      it("throws an error if there is no email or name in the jwt", async () => {
        mockJwtDecode.mockReturnValue({})

        const result = await GlobalStore.actions.auth
          .authFacebook({ signInOrUp: "signUp", agreedToReceiveEmails: true })
          .catch((e) => e)

        const expectedError = new AuthError(
          "There is no email or name associated with your Facebook account. Please log in using your email and password instead."
        )

        expect(result).toMatchObject(expectedError)
      })

      it("parses profile info from facebook jwt and signs up", async () => {
        GlobalStore.actions.auth.signUp = jest.fn(() => ({ success: true })) as any
        mockJwtDecode.mockReturnValue({
          email: "test@example.com",
          name: "Test User",
        })

        await GlobalStore.actions.auth.authFacebook({
          signInOrUp: "signUp",
          agreedToReceiveEmails: true,
        })

        expect(GlobalStore.actions.auth.signUp).toHaveBeenCalledWith({
          email: "test@example.com",
          name: "Test User",
          jwt: "facebook-jwt",
          oauthProvider: "facebook",
          oauthMode: "jwt",
          agreedToReceiveEmails: true,
        })
      })

      it("throws an error if sign up fails", async () => {
        GlobalStore.actions.auth.signUp = jest.fn(() => ({
          success: false,
          message: "Could not sign up",
        })) as any

        const result = await GlobalStore.actions.auth
          .authFacebook({ signInOrUp: "signUp", agreedToReceiveEmails: true })
          .catch((e) => e)
        const expectedError = new AuthError("Could not sign up")
        expect(result).toMatchObject(expectedError)
      })

      it("fetches profile info from facebook and signs in", async () => {
        mockFetchJsonOnce({ access_token: "x-access-token" }, 201)
        mockFetchJsonOnce({ email: "emailFromArtsy@mail.com" })
        GlobalStore.actions.auth.signIn = jest.fn(() => ({ success: true })) as any
        mockJwtDecode.mockReturnValue({
          email: "test@example.com",
          name: "Test User",
        })

        await GlobalStore.actions.auth.authFacebook({ signInOrUp: "signIn" })

        expect(GlobalStore.actions.auth.signIn).toHaveBeenCalledWith({
          email: "emailFromArtsy@mail.com",
          jwt: "facebook-jwt",
          oauthMode: "jwt",
          oauthProvider: "facebook",
        })
      })

      it("tracks the login event for social auth", async () => {
        mockFetchJsonOnce({ access_token: "x-access-token" }, 201)
        mockFetchJsonOnce({ email: "emailFromArtsy@mail.com" })
        mockFetchJsonOnce({ access_token: "x-access-token" }, 201)
        mockFetchJsonOnce({ id: "my-user-id" })

        await GlobalStore.actions.auth.authFacebook({ signInOrUp: "signIn" })

        expect(mockPostEventToProviders).toHaveBeenCalledTimes(1)
        expect(mockPostEventToProviders.mock.calls[0]).toMatchInlineSnapshot(`
          [
            {
              "action": "successfullyLoggedIn",
              "service": "facebook",
            },
          ]
        `)
      })

      it("throws an error if getting X-ACCESS-TOKEN fails", async () => {
        mockFetchJsonOnce({ error_description: "getting X-ACCESS-TOKEN error" })

        const result = await GlobalStore.actions.auth
          .authFacebook({ signInOrUp: "signIn" })
          .catch((e) => e)
        const expectedError = new AuthError("Login attempt failed")
        expect(result).toMatchObject(expectedError)
      })
    })

    describe("Classic login - Android", () => {
      beforeEach(() => {
        Platform.OS = "android"
      })

      it("throws an error if user doesn't have an email", async () => {
        mockGraphRequest.mockImplementation((_route, _config, callback) => {
          callback(undefined, { name: "name from facebook" })
        })

        const result = await GlobalStore.actions.auth
          .authFacebook({ signInOrUp: "signUp", agreedToReceiveEmails: true })
          .catch((e) => e)
        const expectedError = new AuthError(
          "There is no email associated with your Facebook account. Please log in using your email and password instead."
        )
        expect(result).toMatchObject(expectedError)
      })

      it("fetches access token from facebook", async () => {
        GlobalStore.actions.auth.signUp = jest.fn(() => ({ success: true })) as any

        await GlobalStore.actions.auth.authFacebook({
          signInOrUp: "signUp",
          agreedToReceiveEmails: true,
        })

        expect(AccessToken.getCurrentAccessToken).toHaveBeenCalled()
      })

      it("throws an error if fetching data from facebook fails", async () => {
        const error: any = "fetching fb data error"

        mockGraphRequest.mockImplementation((_route, _config, callback) => {
          callback(error, undefined)
        })

        const result = await GlobalStore.actions.auth
          .authFacebook({ signInOrUp: "signUp", agreedToReceiveEmails: true })
          .catch((e) => e)
        const expectedError = new AuthError("Error fetching Facebook data", error.toString())
        expect(result).toMatchObject(expectedError)
      })

      it("fetches profile info from facebook and signs up", async () => {
        GlobalStore.actions.auth.signUp = jest.fn(() => ({ success: true })) as any

        await GlobalStore.actions.auth.authFacebook({
          signInOrUp: "signUp",
          agreedToReceiveEmails: true,
        })

        expect(GlobalStore.actions.auth.signUp).toHaveBeenCalledWith({
          email: "emailFromFacebook@email.com",
          name: "name from facebook",
          accessToken: "facebook-token",
          oauthProvider: "facebook",
          oauthMode: "accessToken",
          agreedToReceiveEmails: true,
        })
      })

      it("throws an error if sign up fails", async () => {
        GlobalStore.actions.auth.signUp = jest.fn(() => ({
          success: false,
          message: "Could not sign up",
        })) as any

        const result = await GlobalStore.actions.auth
          .authFacebook({ signInOrUp: "signUp", agreedToReceiveEmails: true })
          .catch((e) => e)
        const expectedError = new AuthError("Could not sign up")
        expect(result).toMatchObject(expectedError)
      })

      it("fetches profile info from facebook and signs in", async () => {
        mockFetchJsonOnce({ access_token: "x-access-token" }, 201)
        mockFetchJsonOnce({ email: "emailFromArtsy@mail.com" })
        GlobalStore.actions.auth.signIn = jest.fn(() => true) as any

        await GlobalStore.actions.auth.authFacebook({ signInOrUp: "signIn" })

        expect(GlobalStore.actions.auth.signIn).toHaveBeenCalledWith({
          email: "emailFromArtsy@mail.com",
          accessToken: "facebook-token",
          oauthMode: "accessToken",
          oauthProvider: "facebook",
        })
      })

      it("tracks the login event for social auth", async () => {
        mockFetchJsonOnce({ access_token: "x-access-token" }, 201)
        mockFetchJsonOnce({ email: "emailFromArtsy@mail.com" })
        mockFetchJsonOnce({ access_token: "x-access-token" }, 201)
        mockFetchJsonOnce({ id: "my-user-id" })

        await GlobalStore.actions.auth.authFacebook({ signInOrUp: "signIn" })

        expect(mockPostEventToProviders).toHaveBeenCalledTimes(1)
        expect(mockPostEventToProviders.mock.calls[0]).toMatchInlineSnapshot(`
          [
            {
              "action": "successfullyLoggedIn",
              "service": "facebook",
            },
          ]
        `)
      })

      it("throws an error if getting X-ACCESS-TOKEN fails", async () => {
        mockFetchJsonOnce({ error_description: "getting X-ACCESS-TOKEN error" })

        const result = await GlobalStore.actions.auth
          .authFacebook({ signInOrUp: "signIn" })
          .catch((e) => e)
        const expectedError = new AuthError("Login attempt failed")
        expect(result).toMatchObject(expectedError)
      })
    })
  })

  describe("authFacebook2", () => {
    beforeEach(async () => {
      mockFetchJsonOnce({
        xapp_token: "my-special-token",
        expires_in: oneWeekFromNow,
      })
      await GlobalStore.actions.auth.getXAppToken()
      mockFetch.mockClear()
      mockLogInWithPermissions.mockReturnValue({ isCancelled: false })
      mockGetCurrentAccessToken.mockReturnValue({
        accessToken: "facebook-token",
      })
      mockGraphRequest.mockImplementation((_route, _config, callback) => {
        callback(undefined, { email: "emailFromFacebook@email.com", name: "name from facebook" })
      })
    })

    it("throws an error when email permission was denied", async () => {
      mockLogInWithPermissions.mockReturnValue({
        declinedPermissions: ["email"],
      })

      const result = await GlobalStore.actions.auth.authFacebook2().catch((e) => e)

      expect(LoginManager.logInWithPermissions).toHaveBeenCalledWith(
        ["public_profile", "email"],
        "limited"
      )
      const expectedError = new AuthError(
        "Please allow the use of email to continue.",
        "Email Permission Declined"
      )
      expect(result).toMatchObject(expectedError)
    })

    describe("Limited login - iOS", () => {
      beforeEach(() => {
        Platform.OS = "ios"
        mockGetAuthenticationTokenIOS.mockReturnValue({
          authenticationToken: "facebook-jwt",
        })
      })

      it("fetches jwt from facebook", async () => {
        GlobalStore.actions.auth.signUp = jest.fn(() => ({ success: true })) as any
        mockJwtDecode.mockReturnValue({
          email: "test@example.com",
          name: "Test User",
        })
        await GlobalStore.actions.auth.authFacebook2()

        expect(AuthenticationToken.getAuthenticationTokenIOS).toHaveBeenCalled()
      })

      it("throws an error if there is no email or name in the jwt", async () => {
        mockJwtDecode.mockReturnValue({})

        const result = await GlobalStore.actions.auth.authFacebook2().catch((e) => e)

        const expectedError = new AuthError(
          "There is no email or name associated with your Facebook account. Please log in using your email and password instead."
        )

        expect(result).toMatchObject(expectedError)
      })

      it("parses profile info from facebook jwt and signs up", async () => {
        GlobalStore.actions.auth.signUp = jest.fn(() => ({ success: true })) as any
        mockJwtDecode.mockReturnValue({
          email: "test@example.com",
          name: "Test User",
        })

        await GlobalStore.actions.auth.authFacebook2()

        expect(GlobalStore.actions.auth.signUp).toHaveBeenCalledWith({
          email: "test@example.com",
          name: "Test User",
          jwt: "facebook-jwt",
          oauthProvider: "facebook",
          oauthMode: "jwt",
          agreedToReceiveEmails: true,
        })
      })

      it("signs in if an account already exists", async () => {
        mockFetchJsonOnce({ access_token: "x-access-token" }, 201)
        mockFetchJsonOnce({ email: "emailFromArtsy@mail.com" })

        GlobalStore.actions.auth.signIn = jest.fn(() => ({ success: true })) as any
        mockJwtDecode.mockReturnValue({
          email: "test@example.com",
          name: "Test User",
        })
        GlobalStore.actions.auth.signUp = jest.fn(() => ({
          success: false,
          error: "Another Account Already Linked",
        })) as any

        await GlobalStore.actions.auth.authFacebook2().catch((e) => e)

        expect(GlobalStore.actions.auth.signIn).toHaveBeenCalledWith({
          email: "emailFromArtsy@mail.com",
          jwt: "facebook-jwt",
          oauthMode: "jwt",
          oauthProvider: "facebook",
        })
      })

      it("tracks the sign up event for social auth", async () => {
        mockFetchJsonOnce({ access_token: "x-access-token" }, 201)
        mockFetchJsonOnce({ email: "emailFromArtsy@mail.com" })

        await GlobalStore.actions.auth.authFacebook2()

        expect(mockPostEventToProviders).toHaveBeenCalledTimes(1)
        expect(mockPostEventToProviders.mock.calls[0]).toMatchInlineSnapshot(`
          [
            {
              "action": "createdAccount",
              "service": "facebook",
            },
          ]
        `)
      })

      it("tracks the login event for social auth", async () => {
        mockFetchJsonOnce({ access_token: "x-access-token" }, 201)
        mockFetchJsonOnce({ email: "emailFromArtsy@mail.com" })
        mockFetchJsonOnce({ access_token: "x-access-token" }, 201)
        mockFetchJsonOnce({ id: "my-user-id" })
        mockJwtDecode.mockReturnValue({
          email: "test@example.com",
          name: "Test User",
        })

        GlobalStore.actions.auth.signUp = jest.fn(() => ({
          success: false,
          error: "Another Account Already Linked",
        })) as any

        await GlobalStore.actions.auth.authFacebook2()

        expect(mockPostEventToProviders).toHaveBeenCalledTimes(1)
        expect(mockPostEventToProviders.mock.calls[0]).toMatchInlineSnapshot(`
          [
            {
              "action": "successfullyLoggedIn",
              "service": "facebook",
            },
          ]
        `)
      })

      it("throws an error if getting X-ACCESS-TOKEN fails", async () => {
        mockFetchJsonOnce({ error_description: "getting X-ACCESS-TOKEN error" })

        GlobalStore.actions.auth.signUp = jest.fn(() => ({
          success: false,
          error: "Another Account Already Linked",
        })) as any

        const result = await GlobalStore.actions.auth.authFacebook2().catch((e) => e)
        const expectedError = new AuthError("Login attempt failed")
        expect(result).toMatchObject(expectedError)
      })
    })

    describe("Classic login - Android", () => {
      beforeEach(() => {
        Platform.OS = "android"
      })

      it("throws an error if user doesn't have an email", async () => {
        mockGraphRequest.mockImplementation((_route, _config, callback) => {
          callback(undefined, { name: "name from facebook" })
        })

        const result = await GlobalStore.actions.auth.authFacebook2().catch((e) => e)
        const expectedError = new AuthError(
          "There is no email associated with your Facebook account. Please log in using your email and password instead."
        )
        expect(result).toMatchObject(expectedError)
      })

      it("fetches access token from facebook", async () => {
        GlobalStore.actions.auth.signUp = jest.fn(() => ({ success: true })) as any

        await GlobalStore.actions.auth.authFacebook2()

        expect(AccessToken.getCurrentAccessToken).toHaveBeenCalled()
      })

      it("throws an error if fetching data from facebook fails", async () => {
        const error: any = "fetching fb data error"

        mockGraphRequest.mockImplementation((_route, _config, callback) => {
          callback(error, undefined)
        })

        const result = await GlobalStore.actions.auth.authFacebook2().catch((e) => e)
        const expectedError = new AuthError("Error fetching Facebook data", error.toString())
        expect(result).toMatchObject(expectedError)
      })

      it("fetches profile info from facebook and signs up", async () => {
        GlobalStore.actions.auth.signUp = jest.fn(() => ({ success: true })) as any

        await GlobalStore.actions.auth.authFacebook2()

        expect(GlobalStore.actions.auth.signUp).toHaveBeenCalledWith({
          email: "emailFromFacebook@email.com",
          name: "name from facebook",
          accessToken: "facebook-token",
          oauthProvider: "facebook",
          oauthMode: "accessToken",
          agreedToReceiveEmails: true,
        })
      })

      it("throws an error if sign up fails", async () => {
        GlobalStore.actions.auth.signUp = jest.fn(() => ({
          success: false,
          message: "Could not sign up",
        })) as any

        const result = await GlobalStore.actions.auth.authFacebook2().catch((e) => e)
        const expectedError = new AuthError("Could not sign up")
        expect(result).toMatchObject(expectedError)
      })

      it("signs in if an account already exists", async () => {
        mockFetchJsonOnce({ access_token: "x-access-token" }, 201)
        mockFetchJsonOnce({ email: "emailFromArtsy@mail.com" })

        GlobalStore.actions.auth.signIn = jest.fn(() => true) as any
        mockJwtDecode.mockReturnValue({
          email: "test@example.com",
          name: "Test User",
        })
        GlobalStore.actions.auth.signUp = jest.fn(() => ({
          success: false,
          error: "Another Account Already Linked",
        })) as any

        await GlobalStore.actions.auth.authFacebook2()

        expect(GlobalStore.actions.auth.signIn).toHaveBeenCalledWith({
          email: "emailFromArtsy@mail.com",
          accessToken: "facebook-token",
          oauthMode: "accessToken",
          oauthProvider: "facebook",
        })
      })

      it("tracks the sign up event for social auth", async () => {
        mockFetchJsonOnce({ access_token: "x-access-token" }, 201)
        mockFetchJsonOnce({ email: "emailFromArtsy@mail.com" })

        await GlobalStore.actions.auth.authFacebook2()

        expect(mockPostEventToProviders).toHaveBeenCalledTimes(1)
        expect(mockPostEventToProviders.mock.calls[0]).toMatchInlineSnapshot(`
          [
            {
              "action": "createdAccount",
              "service": "facebook",
            },
          ]
        `)
      })

      it("tracks the login event for social auth", async () => {
        mockFetchJsonOnce({ access_token: "x-access-token" }, 201)
        mockFetchJsonOnce({ email: "emailFromArtsy@mail.com" })
        mockFetchJsonOnce({ access_token: "x-access-token" }, 201)
        mockFetchJsonOnce({ id: "my-user-id" })
        mockJwtDecode.mockReturnValue({
          email: "test@example.com",
          name: "Test User",
        })

        GlobalStore.actions.auth.signUp = jest.fn(() => ({
          success: false,
          error: "Another Account Already Linked",
        })) as any

        await GlobalStore.actions.auth.authFacebook2()

        expect(mockPostEventToProviders).toHaveBeenCalledTimes(1)
        expect(mockPostEventToProviders.mock.calls[0]).toMatchInlineSnapshot(`
          [
            {
              "action": "successfullyLoggedIn",
              "service": "facebook",
            },
          ]
        `)
      })

      it("throws an error if getting X-ACCESS-TOKEN fails", async () => {
        mockFetchJsonOnce({ error_description: "getting X-ACCESS-TOKEN error" })

        GlobalStore.actions.auth.signUp = jest.fn(() => ({
          success: false,
          error: "Another Account Already Linked",
        })) as any

        const result = await GlobalStore.actions.auth.authFacebook2().catch((e) => e)
        const expectedError = new AuthError("Login attempt failed")
        expect(result).toMatchObject(expectedError)
      })
    })
  })

  describe("authGoogle", () => {
    beforeEach(async () => {
      mockFetchJsonOnce({
        xapp_token: "my-special-token",
        expires_in: oneWeekFromNow,
      })
      await GlobalStore.actions.auth.getXAppToken()
      mockFetch.mockClear()
      mockHasPlayServices.mockReturnValue(true)
      mockGoogleSignIn.mockReturnValue({
        user: { email: "googleEmail@gmail.com", name: "name from google" },
      })
      mockGoogleGetTokens.mockReturnValue({ accessToken: "google-token" })
    })

    it("throws an error if google play services are not available", async () => {
      mockHasPlayServices.mockReturnValue(false)

      const result = await GlobalStore.actions.auth
        .authGoogle({ signInOrUp: "signUp", agreedToReceiveEmails: true })
        .catch((e) => e)
      const expectedError = new AuthError("Play services are not available.")
      expect(result).toMatchObject(expectedError)
    })

    it("fetches profile info from google and signs up", async () => {
      GlobalStore.actions.auth.signUp = jest.fn(() => ({ success: true })) as any

      await GlobalStore.actions.auth.authGoogle({
        signInOrUp: "signUp",
        agreedToReceiveEmails: false,
      })

      expect(GlobalStore.actions.auth.signUp).toHaveBeenCalledWith({
        email: "googleEmail@gmail.com",
        name: "name from google",
        accessToken: "google-token",
        oauthProvider: "google",
        oauthMode: "accessToken",
        agreedToReceiveEmails: false,
      })
    })

    it("throws an error if sign up fails", async () => {
      GlobalStore.actions.auth.signUp = jest.fn(() => ({
        success: false,
        message: "Could not sign up",
      })) as any

      const result = await GlobalStore.actions.auth
        .authGoogle({ signInOrUp: "signUp", agreedToReceiveEmails: true })
        .catch((e) => e)
      const expectedError = new AuthError("Could not sign up")
      expect(result).toMatchObject(expectedError)
    })

    it("fetches profile info from google and signs in", async () => {
      mockFetchJsonOnce({ access_token: "x-access-token" }, 201)
      mockFetchJsonOnce({ email: "emailFromArtsy@mail.com" })
      GlobalStore.actions.auth.signIn = jest.fn(() => true) as any

      await GlobalStore.actions.auth.authGoogle({ signInOrUp: "signIn" })

      expect(GlobalStore.actions.auth.signIn).toHaveBeenCalledWith({
        email: "emailFromArtsy@mail.com",
        accessToken: "google-token",
        oauthMode: "accessToken",
        oauthProvider: "google",
      })
    })

    it("tracks the event", async () => {
      mockFetchJsonOnce({ access_token: "x-access-token" }, 201)
      mockFetchJsonOnce({ email: "emailFromArtsy@mail.com" })
      mockFetchJsonOnce({ access_token: "x-access-token" }, 201)
      mockFetchJsonOnce({ id: "my-user-id" })

      await GlobalStore.actions.auth.authGoogle({ signInOrUp: "signIn" })

      expect(mockPostEventToProviders).toHaveBeenCalledTimes(1)
      expect(mockPostEventToProviders.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "successfullyLoggedIn",
            "service": "google",
          },
        ]
      `)
    })

    it("throws an error if getting X-ACCESS-TOKEN fails", async () => {
      mockFetchJsonOnce({ error_description: "getting X-ACCESS-TOKEN error" })

      const result = await GlobalStore.actions.auth
        .authGoogle({ signInOrUp: "signIn" })
        .catch((e) => e)
      const expectedError = new AuthError("Login attempt failed")
      expect(result).toMatchObject(expectedError)
    })
  })

  describe("authGoogle2", () => {
    beforeEach(async () => {
      mockFetchJsonOnce({
        xapp_token: "my-special-token",
        expires_in: oneWeekFromNow,
      })
      await GlobalStore.actions.auth.getXAppToken()
      mockFetch.mockClear()
      mockHasPlayServices.mockReturnValue(true)
      mockGoogleSignIn.mockReturnValue({
        user: { email: "googleEmail@gmail.com", name: "name from google" },
      })
      mockGoogleGetTokens.mockReturnValue({ accessToken: "google-token" })
    })

    it("throws an error if google play services are not available", async () => {
      mockHasPlayServices.mockReturnValue(false)

      const result = await GlobalStore.actions.auth.authGoogle2().catch((e) => e)
      const expectedError = new AuthError("Play services are not available.")
      expect(result).toMatchObject(expectedError)
    })

    it("fetches profile info from google and signs up", async () => {
      GlobalStore.actions.auth.signUp = jest.fn(() => ({ success: true })) as any

      await GlobalStore.actions.auth.authGoogle2()

      expect(GlobalStore.actions.auth.signUp).toHaveBeenCalledWith({
        email: "googleEmail@gmail.com",
        name: "name from google",
        accessToken: "google-token",
        oauthProvider: "google",
        oauthMode: "accessToken",
        agreedToReceiveEmails: true,
      })
    })

    it("throws an error if sign up fails", async () => {
      GlobalStore.actions.auth.signUp = jest.fn(() => ({
        success: false,
        message: "Could not sign up",
      })) as any

      const result = await GlobalStore.actions.auth.authGoogle2().catch((e) => e)
      const expectedError = new AuthError("Could not sign up")
      expect(result).toMatchObject(expectedError)
    })

    it("signs in if an account is already linked", async () => {
      mockFetchJsonOnce({ access_token: "x-access-token" }, 201)
      mockFetchJsonOnce({ email: "emailFromArtsy@mail.com" })

      GlobalStore.actions.auth.signIn = jest.fn(() => true) as any
      GlobalStore.actions.auth.signUp = jest.fn(() => ({
        success: false,
        error: "Another Account Already Linked",
      })) as any

      await GlobalStore.actions.auth.authGoogle2()

      expect(GlobalStore.actions.auth.signIn).toHaveBeenCalledWith({
        email: "emailFromArtsy@mail.com",
        accessToken: "google-token",
        oauthMode: "accessToken",
        oauthProvider: "google",
      })
    })

    it("tracks createdAccount when user is signed up", async () => {
      mockFetchJsonOnce({ access_token: "x-access-token" }, 201)
      mockFetchJsonOnce({ email: "emailFromArtsy@mail.com" })

      await GlobalStore.actions.auth.authGoogle2()

      expect(mockPostEventToProviders).toHaveBeenCalledTimes(1)
      expect(mockPostEventToProviders.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "createdAccount",
            "service": "google",
          },
        ]
      `)
    })

    it("tracks successfullyLoggedIn when user is signed in", async () => {
      mockFetchJsonOnce({ access_token: "x-access-token" }, 201)
      mockFetchJsonOnce({ email: "emailFromArtsy@mail.com" })
      mockFetchJsonOnce({ access_token: "x-access-token" }, 201)
      mockFetchJsonOnce({ id: "my-user-id" })

      GlobalStore.actions.auth.signUp = jest.fn(() => ({
        success: false,
        error: "Another Account Already Linked",
      })) as any

      await GlobalStore.actions.auth.authGoogle2()

      expect(mockPostEventToProviders).toHaveBeenCalledTimes(1)
      expect(mockPostEventToProviders.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "successfullyLoggedIn",
            "service": "google",
          },
        ]
      `)
    })

    it("throws an error if getting X-ACCESS-TOKEN fails", async () => {
      mockFetchJsonOnce({ error_description: "getting X-ACCESS-TOKEN error" })

      GlobalStore.actions.auth.signUp = jest.fn(() => ({
        success: false,
        error: "Another Account Already Linked",
      })) as any

      const result = await GlobalStore.actions.auth.authGoogle2().catch((e) => e)
      const expectedError = new AuthError("Login attempt failed")
      expect(result).toMatchObject(expectedError)
    })
  })

  describe("authApple", () => {
    beforeEach(async () => {
      mockFetchJsonOnce({
        xapp_token: "my-special-token",
        expires_in: oneWeekFromNow,
      })
      await GlobalStore.actions.auth.getXAppToken()
      mockFetch.mockClear()
      mockApplePerformRequest.mockResolvedValue({
        email: "appleEmail@mail.com",
        identityToken: "apple-id-token",
        user: "appleUID",
      })
    })

    it("fetches profile info from apple and signs up", async () => {
      GlobalStore.actions.auth.signUp = jest.fn(() => ({ success: true })) as any
      mockApplePerformRequest.mockResolvedValue({
        identityToken: "apple-id-token",
        user: "appleUID",
        email: "appleEmail@mail.com",
        fullName: {
          givenName: "firstName",
          familyName: "lastName",
        },
      })

      await GlobalStore.actions.auth.authApple({ agreedToReceiveEmails: true })

      expect(GlobalStore.actions.auth.signUp).toHaveBeenCalledWith({
        email: "appleEmail@mail.com",
        name: "firstName lastName",
        appleUid: "appleUID",
        idToken: "apple-id-token",
        oauthProvider: "apple",
        oauthMode: "idToken",
        agreedToReceiveEmails: true,
      })
    })

    it("fetches profile info from apple and signs in", async () => {
      mockFetchJsonOnce({ access_token: "x-access-token" }, 201)
      mockFetchJsonOnce({ email: "emailFromArtsy@mail.com" })

      GlobalStore.actions.auth.signUp = jest.fn(() => ({
        error: "Another Account Already Linked",
      })) as any

      GlobalStore.actions.auth.signIn = jest.fn(() => "success") as any

      await GlobalStore.actions.auth.authApple({})

      expect(GlobalStore.actions.auth.signIn).toHaveBeenCalledWith({
        email: "emailFromArtsy@mail.com",
        appleUid: "appleUID",
        idToken: "apple-id-token",
        oauthMode: "idToken",
        oauthProvider: "apple",
        onSignIn: undefined,
      })
    })

    it("tracks the event", async () => {
      GlobalStore.actions.auth.signUp = jest.fn(() => ({
        error: "Another Account Already Linked",
      })) as any
      mockFetchJsonOnce({ access_token: "x-access-token" }, 201)
      mockFetchJsonOnce({ email: "emailFromArtsy@mail.com" })
      mockFetchJsonOnce({ access_token: "x-access-token" }, 201)
      mockFetchJsonOnce({ id: "my-user-id" })

      await GlobalStore.actions.auth.authApple({})

      expect(mockPostEventToProviders).toHaveBeenCalledTimes(1)
      expect(mockPostEventToProviders.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "successfullyLoggedIn",
            "service": "apple",
          },
        ]
      `)
    })

    it("throws an error if getting X-ACCESS-TOKEN fails", async () => {
      mockFetchJsonOnce({ error_description: "getting X-ACCESS-TOKEN error" })
      GlobalStore.actions.auth.signUp = jest.fn(() => ({
        error: "Another Account Already Linked",
      })) as any
      const result = await GlobalStore.actions.auth.authApple({}).catch((e) => e)
      const expectedError = new AuthError("Login attempt failed")
      expect(result).toMatchObject(expectedError)
    })
  })

  describe("signOut action", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectState({
        sessionState: { isHydrated: true },
        auth: {
          userAccessToken: "user-access-token",
          userID: "user-id",
          previousSessionUserID: null,
        },
        search: {
          recentSearches: [
            {
              type: "AUTOSUGGEST_RESULT_TAPPED",
              props: {
                href: "/amoako-boafo",
                displayLabel: "Amoako Boafo",
              },
            },
          ],
        },
        progressiveOnboarding: {
          dismissed: [
            {
              key: "dark-mode",
              timestamp: 1716806400,
            },
          ],
        },
      })
    })

    it("clears all cookies", async () => {
      expect(Cookies.clearAll).not.toHaveBeenCalled()
      await GlobalStore.actions.auth.signOut()
      expect(Cookies.clearAll).toHaveBeenCalledTimes(1)
    })

    it("clears user data", async () => {
      Platform.OS = "ios"
      expect(LegacyNativeModules.ArtsyNativeModule.clearUserData).not.toHaveBeenCalled()
      await GlobalStore.actions.auth.signOut()
      expect(LegacyNativeModules.ArtsyNativeModule.clearUserData).toHaveBeenCalledTimes(1)
    })

    it("clears user access token", async () => {
      expect(__globalStoreTestUtils__?.getCurrentState().auth.userAccessToken).toBe(
        "user-access-token"
      )
      await GlobalStore.actions.auth.signOut()
      expect(__globalStoreTestUtils__?.getCurrentState().auth.userAccessToken).toBe(null)
    })

    it("saves user id as previousSessionUserID", async () => {
      await GlobalStore.actions.auth.signOut()
      expect(__globalStoreTestUtils__?.getCurrentState().auth.previousSessionUserID).toBe("user-id")
    })

    it("saves recent searches", async () => {
      await GlobalStore.actions.auth.signOut()
      expect(__globalStoreTestUtils__?.getCurrentState().search.recentSearches).toHaveLength(1)
      expect(__globalStoreTestUtils__?.getCurrentState().search.recentSearches[0]).toEqual(
        expect.objectContaining({
          type: "AUTOSUGGEST_RESULT_TAPPED",
          props: {
            href: "/amoako-boafo",
            displayLabel: "Amoako Boafo",
          },
        })
      )
    })

    it("saves progressive onboarding state", async () => {
      await GlobalStore.actions.auth.signOut()
      expect(__globalStoreTestUtils__?.getCurrentState().progressiveOnboarding).toEqual(
        expect.objectContaining({
          dismissed: [
            {
              key: "dark-mode",
              timestamp: 1716806400,
            },
          ],
        })
      )
    })
  })

  describe("verifyUser", () => {
    beforeEach(async () => {
      mockFetchJsonOnce({
        xapp_token: "my-special-token",
        expires_in: oneWeekFromNow,
      })
      await GlobalStore.actions.auth.getXAppToken()
      mockFetch.mockClear()
    })

    it('returns "user_exists" if the user exists', async () => {
      mockFetchJsonOnce({ exists: true }, 201)

      const result = await GlobalStore.actions.auth.verifyUser({
        email: "email",
        recaptchaToken: "token",
      })

      expect(result).toBe("user_exists")
    })

    it('returns "user_does_not_exist" if the user does not exist', async () => {
      mockFetchJsonOnce({ exists: false }, 201)

      const result = await GlobalStore.actions.auth.verifyUser({
        email: "email",
        recaptchaToken: "token",
      })

      expect(result).toBe("user_does_not_exist")
    })

    it('returns "something_went_wrong" if the request fails', async () => {
      mockFetchJsonOnce({ error: "bad times" }, 500)

      const result = await GlobalStore.actions.auth.verifyUser({
        email: "email",
        recaptchaToken: "token",
      })

      expect(result).toBe("something_went_wrong")
    })
  })
})
