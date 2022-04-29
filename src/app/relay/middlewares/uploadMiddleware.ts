import { isReactNativeFile, ReactNativeFile } from "app/utils/ReactNativeFile"
import extractFiles, { ExtractableFile } from "extract-files/extractFiles.mjs"
import isExtractableFile from "extract-files/isExtractableFile.mjs"
import { Middleware, RelayNetworkLayerRequestBatch } from "react-relay-network-modern/node8"

const isExtractable = (value: any) => {
  return isExtractableFile(value) || isReactNativeFile(value)
}

/**
 * Improved version of `upload` middleware from `react-relay-network-modern` with support for `ReactNativeFile'
 *
 * Original: https://github.com/relay-tools/react-relay-network-modern/blob/master/src/middlewares/upload.js
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

    const { clone: extractedOperations, files } = extractFiles<ExtractableFile | ReactNativeFile>(
      operations,
      isExtractable
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
        // We must explicitly specify filename, otherwise Metaphysics will assume that file is NOT being passed
        // @ts-ignore
        formData.append(index++, file, file.name)
      })

      req.fetchOpts.method = "POST"
      req.fetchOpts.body = formData

      delete req.fetchOpts.headers["Content-Type"]
    }

    return await next(req)
  }
}
