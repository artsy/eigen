import { get } from "lodash"
import { createRequestError, Middleware } from "react-relay-network-modern/node8"

export const principalFieldErrorMiddleware = (): Middleware => {
  return next => async req => {
    const res = await next(req)
    const statusCode: number = get(res, "json.extensions.principalField.httpStatusCode", 200)

    if (statusCode >= 400) {
      throw createRequestError(req, res)
    }

    return res
  }
}
