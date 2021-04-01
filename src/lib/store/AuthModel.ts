import { action, Action, StateMapper, thunk, Thunk } from "easy-peasy"
import { stringify } from "qs"
import Config from "react-native-config"
import type { GlobalStoreModel } from "./GlobalStoreModel"
type BasicHttpMethod = "GET" | "PUT" | "POST" | "DELETE"

export interface AuthModel {
  // State
  userID: string | null
  userEmail: string | null
  userAccessToken: string | null
  userAccessTokenExpiresIn: string | null
  xAppToken: string | null
  xApptokenExpiresIn: string | null

  // Actions
  setState: Action<AuthModel, Partial<StateMapper<AuthModel, "1">>>
  getXAppToken: Thunk<AuthModel, void, {}, GlobalStoreModel, Promise<string>>
  userExists: Thunk<AuthModel, { email: string }, {}, GlobalStoreModel>
  signIn: Thunk<AuthModel, { email: string; password: string }, {}, GlobalStoreModel, Promise<boolean>>
  gravityUnauthenticatedRequest: Thunk<
    AuthModel,
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
}

export const getAuthModel = (): AuthModel => ({
  userID: null,
  userEmail: null,
  userAccessToken: null,
  userAccessTokenExpiresIn: null,
  xAppToken: null,
  xApptokenExpiresIn: null,
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
    const result = await fetch(tokenURL)
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
        userEmail: email,
      })

      return true
    }

    return false
  }),
})
