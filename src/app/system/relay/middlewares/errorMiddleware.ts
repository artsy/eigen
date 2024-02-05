import { principalFieldErrorHandlerMiddleware } from "app/system/relay/middlewares/principalFieldErrorHandlerMiddleware"
import { MiddlewareNextFn } from "react-relay-network-modern"
import { GraphQLRequest } from "./types"

export const errorMiddleware = () => (next: MiddlewareNextFn) => async (req: GraphQLRequest) => {
  const res = await next(req)

  return principalFieldErrorHandlerMiddleware(req, res)
}
