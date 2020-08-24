import { NativeModules } from "react-native"
import { Middleware } from "react-relay-network-modern/node8"

export const checkAuthenticationMiddleware: Middleware = next => async req => {
  const res = await next(req)
  if (res.errors?.length) {
    NativeModules.ARTemporaryAPIModule.validateAuthCredentialsAreCorrect()
  }
  return res
}
