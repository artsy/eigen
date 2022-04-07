import { addBreadcrumb } from "@sentry/react-native"
import { logRelay } from "app/utils/loggers"
import { Middleware } from "react-relay-network-modern/node8"

export function simpleLoggerMiddleware(): Middleware {
  return (next) => async (req: any) => {
    const startTime = Date.now()
    addBreadcrumb({
      category: "relay",
      message: `Fetching ${req.operation.name} with vars ${JSON.stringify(req.variables)}`,
    })
    const response = await next(req)
    const duration = ((Date.now() - startTime) / 1000).toFixed(1) + "s"
    if (__DEV__ && logRelay) {
      console.log(
        "RELAY",
        req.operation.name,
        req.variables,
        "fetched in",
        duration,
        "with response",
        response.data,
        ...(response.errors?.length
          ? [
              "and errors\n\n" +
                response.errors.map((err, i) => `    ${i + 1}. ${err.message}`).join("\n"),
              "\n",
            ]
          : [])
      )
    }
    addBreadcrumb({
      category: "relay",
      data: { errors: response.errors },
      message: `${response.errors?.length ? "Unsuccessfully" : "Successfully"} fetched ${
        req.operation.name
      } with vars ${JSON.stringify(req.variables)} in ${duration}`,
    })

    return response
  }
}
