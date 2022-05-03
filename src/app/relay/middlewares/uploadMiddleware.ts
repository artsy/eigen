import { isReactNativeFile, ReactNativeFile } from "app/utils/ReactNativeFile"
import extractFiles from "extract-files/extractFiles.mjs"
import { Middleware, RelayNetworkLayerRequestBatch } from "react-relay-network-modern/node8"

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

    const operations = {
      query: req.operation.text,
      variables: req.variables,
    }

    const { clone: extractedOperations, files } = extractFiles<ReactNativeFile>(
      operations,
      isReactNativeFile
    )

    if (files.size) {
      const formData = new FormData()
      const pathMap: Record<string, any> = {}
      let index = 0

      files.forEach((path) => {
        pathMap[index++] = path
      })

      formData.append("operations", JSON.stringify(extractedOperations))
      formData.append("map", JSON.stringify(pathMap))

      index = 0
      files.forEach((_, file) => {
        formData.append(String(index++), file)
      })

      req.fetchOpts.method = "POST"
      req.fetchOpts.body = formData

      delete req.fetchOpts.headers["Content-Type"]
    }

    return await next(req)
  }
}
