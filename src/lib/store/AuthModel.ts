import { action, Action, Computed, computed, StateMapper, thunk, Thunk, thunkOn, ThunkOn } from "easy-peasy"
import { isArtsyEmail } from "lib/utils/general"
import { SegmentTrackingProvider } from "lib/utils/track/SegmentTrackingProvider"
import { stringify } from "qs"
import { Platform } from "react-native"
import Config from "react-native-config"
import type { GlobalStoreModel } from "./GlobalStoreModel"
type BasicHttpMethod = "GET" | "PUT" | "POST" | "DELETE"

export interface AuthModel {
  // State
  userID: string | null
  androidUserEmail: string | null
  userAccessToken: string | null
  userAccessTokenExpiresIn: string | null
  xAppToken: string | null
  xApptokenExpiresIn: string | null

  userEmail: Computed<this, string | null, GlobalStoreModel>
  userHasArtsyEmail: Computed<this, boolean, GlobalStoreModel>

  // Actions
  setState: Action<AuthModel, Partial<StateMapper<AuthModel, "1">>>
  getXAppToken: Thunk<AuthModel, void, {}, GlobalStoreModel, Promise<string>>
  userExists: Thunk<AuthModel, { email: string }, {}, GlobalStoreModel>
  signIn: Thunk<AuthModel, { email: string; password: string }, {}, GlobalStoreModel, Promise<boolean>>
  signUp: Thunk<AuthModel, { email: string; password: string; name: string }, {}, GlobalStoreModel, Promise<boolean>>
  forgotPassword: Thunk<AuthModel, { email: string }, {}, GlobalStoreModel, Promise<boolean>>
  gravityUnauthenticatedRequest: Thunk<
    this,
    {
      path: string
      method?: BasicHttpMethod
      body?: object
      headers?: RequestInit["headers"]
    },
    {},
    GlobalStoreModel,
    ReturnType<typeof fetch>
  >

  notifyTracking: Thunk<this, { userId: string | null }>
  didRehydrate: ThunkOn<this, {}, GlobalStoreModel>
}

export const getAuthModel = (): AuthModel => ({
  userID: null,
  androidUserEmail: null,
  userAccessToken: null,
  userAccessTokenExpiresIn: null,
  xAppToken: null,
  xApptokenExpiresIn: null,

  userEmail: computed([(_, store) => store], (store) => {
    if (Platform.OS === "ios") {
      return store.native.sessionState.userEmail
    } else if (Platform.OS === "android") {
      return store.auth.androidUserEmail
    }
    return null
  }),
  userHasArtsyEmail: computed((state) => isArtsyEmail(state.userEmail ?? "")),

  setState: action((state, payload) => Object.assign(state, payload)),
  getXAppToken: thunk(async (actions, _payload, context) => {
    const xAppToken = context.getState().xAppToken
    if (xAppToken) {
      // TODO: handle expiry
      return xAppToken
    }
    const gravityBaseURL = context.getStoreState().config.environment.strings.gravityURL
    const tokenURL = `${gravityBaseURL}/api/v1/xapp_token?${stringify({
      client_id: Config.ARTSY_API_CLIENT_KEY,
      client_secret: Config.ARTSY_API_CLIENT_SECRET,
    })}`
    const result = await fetch(tokenURL, {
      headers: {
        "User-Agent": context.getStoreState().native.sessionState.userAgent,
      },
    })
    // TODO: check status
    const json = (await result.json()) as {
      xapp_token: string
      expires_in: string
    }
    if (json.xapp_token) {
      actions.setState({
        xAppToken: json.xapp_token,
        xApptokenExpiresIn: json.expires_in,
      })
      return json.xapp_token
    }
    throw new Error("Unable to get x-app-token from " + tokenURL)
  }),
  gravityUnauthenticatedRequest: thunk(async (actions, payload, context) => {
    const gravityBaseURL = context.getStoreState().config.environment.strings.gravityURL
    const xAppToken = await actions.getXAppToken()

    return await fetch(`${gravityBaseURL}${payload.path}`, {
      method: payload.method || "GET",
      headers: {
        "X-Xapp-Token": xAppToken,
        Accept: "application/json",
        "User-Agent": context.getStoreState().native.sessionState.userAgent,
        ...payload.headers,
      },
      body: payload.body ? JSON.stringify(payload.body) : undefined,
    })
  }),
  userExists: thunk(async (actions, { email }) => {
    const result = await actions.gravityUnauthenticatedRequest({
      path: `/api/v1/user?${stringify({ email })}`,
    })
    if (result.status === 200) {
      return true
    } else if (result.status === 404) {
      return false
    } else {
      throw new Error(JSON.stringify(await result.json()))
    }
  }),
  forgotPassword: thunk(async (actions, { email }) => {
    const result = await actions.gravityUnauthenticatedRequest({
      path: `/api/v1/users/send_reset_password_instructions`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        email,
      },
    })

    // For security purposes we don't want to disclose when a user is not found
    // this is indicated by 400 on gravity side, treat as success
    if (result.ok || result.status === 400) {
      return true
    }
    return false
  }),
  signIn: thunk(async (actions, { email, password }) => {
    const result = await actions.gravityUnauthenticatedRequest({
      path: `/oauth2/access_token`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        email,
        password,
        client_id: Config.ARTSY_API_CLIENT_KEY,
        client_secret: Config.ARTSY_API_CLIENT_SECRET,
        grant_type: "credentials",
        scope: "offline_access",
      },
    })

    if (result.status === 201) {
      const { expires_in, access_token } = await result.json()
      const { id } = await (
        await actions.gravityUnauthenticatedRequest({
          path: `/api/v1/user?${stringify({ email })}`,
        })
      ).json()

      actions.setState({
        userAccessToken: access_token,
        userAccessTokenExpiresIn: expires_in,
        userID: id,
        androidUserEmail: email,
      })
      actions.notifyTracking({ userId: id })

      return true
    }

    return false
  }),
  signUp: thunk(async (actions, { email, password, name }) => {
    const result = await actions.gravityUnauthenticatedRequest({
      path: `/api/v1/user`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        email,
        password,
        name,
        agreed_to_receive_emails: true,
        accepted_terms_of_service: true,
      },
    })

    // The user account has been successfully created
    if (result.status === 201) {
      await actions.signIn({ email, password })
      return true
    }
    return false
  }),
  notifyTracking: thunk((_, { userId }) => {
    SegmentTrackingProvider.identify?.(userId, { is_temporary_user: userId === null ? 1 : 0 })
  }),
  didRehydrate: thunkOn(
    (_, storeActions) => storeActions.rehydrate,
    (actions, __, store) => {
      actions.notifyTracking({ userId: store.getState().userID })
    }
  ),
})
