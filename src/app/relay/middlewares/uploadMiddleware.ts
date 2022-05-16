import { extractFiles, ReactNativeFile } from "extract-files"
import { Middleware, RelayNetworkLayerRequestBatch } from "react-relay-network-modern/node8"

const isReactNativeFile = <T>(value: any): value is T => {
  return value instanceof ReactNativeFile
}

let queryMap: any

/**
 * Note: this request will fail if you are using React Native debugger with "Network Inspect" feature enabled
 * Note: we must definitely specify `name` for file, otherwise Metaphysics will assume that the file is NOT being passed
 *
 * Upload middleware from `react-relay-network-modern` with ReactNativeFile support
 * Original: https://github.com/relay-tools/react-relay-network-modern/blob/master/src/middlewares/upload.js
 *
 * If we try to pass Blob/File with specified `name` field to `fetch()`, we will get an error on Android.
 * For this reason, support for these data formats is extracted from original `upload` middleware
 * TODO: Add support for Blob/File when problem will be fixed for Android
 */
export const uploadMiddleware = (): Middleware => {
  return (next) => async (req) => {
    if (req instanceof RelayNetworkLayerRequestBatch) {
      throw new Error("RelayRequestBatch is not supported")
    }

    const { variables, id } = req
    const result = extractFiles<ReactNativeFile>({ variables }, "", isReactNativeFile)
    const { clone: extractedVariables, files } = result

    if (files.size) {
      if (!queryMap) {
        queryMap = require("../../../../data/complete.queryMap.json")
      }

      const query = queryMap[id]
      const formData = new FormData()
      const pathMap: Record<string, any> = {}
      let index = 0

      for (const path of files.values()) {
        pathMap[index++] = path
      }

      formData.append("operations", JSON.stringify({ query, variables: extractedVariables }))
      formData.append("map", JSON.stringify(pathMap))

      index = 0
      for (const file of files.keys()) {
        formData.append(String(index++), file)
      }

      req.fetchOpts.method = "POST"
      req.fetchOpts.body = formData

      delete req.fetchOpts.headers["Content-Type"]
    }

    return await next(req)
  }
}
