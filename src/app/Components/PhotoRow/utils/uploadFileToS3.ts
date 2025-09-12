import { DocumentPickerResponse } from "@react-native-documents/picker"
import { NormalizedDocument } from "app/utils/normalizeUploadedDocument"
import { isImage } from "app/utils/showDocumentsAndPhotosActionSheet"
import { AssetCredentials } from "./gemini/getGeminiCredentialsForEnvironment"

export { getGeminiCredentialsForEnvironment } from "./gemini/getGeminiCredentialsForEnvironment"
export { createGeminiAssetWithS3Credentials } from "./gemini/createGeminiAssetWithS3Credentials"
export { getConvectionGeminiKey } from "./gemini/getConvectionGeminiKey"

export interface S3UploadResponse {
  key: string
}

// These are in RN, but not declared in the RN types:
// https://github.com/facebook/react-native/blob/master/Libraries/Network/FormData.js
// https://github.com/facebook/react-native/blob/master/Libraries/Network/XMLHttpRequest.js
declare let FormData: any
declare let XMLHttpRequest: any

interface Props {
  filePath: string
  acl: string
  assetCredentials: AssetCredentials
  updateProgress?: (progress: number) => void
  filename?: string
  file?: NormalizedDocument | null
}
export const uploadFileToS3 = ({
  filePath,
  acl,
  assetCredentials,
  updateProgress,
  filename,
  file,
}: Props) =>
  new Promise<S3UploadResponse>((resolve, reject) => {
    const formData = new FormData()
    const geminiKey = assetCredentials.policyDocument.conditions.geminiKey
    const bucket = assetCredentials.policyDocument.conditions.bucket
    const uploadURL = `https://${bucket}.s3.amazonaws.com`

    const isImageType =
      // File is explicitly an image
      (file?.item && isImage(file?.item)) ||
      // File is an image because no document is available
      // TODO: Replace all usages of uploadFileToS3 to use file then remove this
      !file?.item

    const contentType = isImageType ? "image/jpg" : (file.item as DocumentPickerResponse).type

    const name = filename || file?.name
    const key = `${geminiKey}+/${name}`
    const data = {
      acl,
      "Content-Type": contentType,
      key,
      AWSAccessKeyId: assetCredentials.credentials,
      success_action_status: assetCredentials.policyDocument.conditions.successActionStatus,
      policy: assetCredentials.policyEncoded,
      signature: assetCredentials.signature,
      file: isImageType
        ? {
            uri: filePath,
            type: "image/jpeg",
            name: filename ?? "photo.jpg",
          }
        : file?.item,
    }

    for (const key in data) {
      // eslint-disable-next-line no-prototype-builtins
      if (data.hasOwnProperty(key)) {
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        formData.append(key, data[key])
      }
    }

    // Fetch didn't seem to work, so I had to move to a lower
    // level abstraction. Note that this request will fail if you are using a debugger.
    //
    // Kinda sucks, but https://github.com/jhen0409/react-native-debugger/issues/38
    const request = new XMLHttpRequest()
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    request.onload = (e) => {
      if (
        e.target.status.toString() ===
        assetCredentials.policyDocument.conditions.successActionStatus
      ) {
        resolve({
          key,
        })
      } else {
        reject(new Error("S3 upload failed"))
      }
    }
    request.upload.onprogress = ({ loaded, total }: { loaded: number; total: number }) => {
      if (updateProgress) {
        updateProgress(loaded / total)
      }
    }

    request.open("POST", uploadURL, true)
    request.onerror = () => {
      reject(new Error("Network error: Something went wrong"))
      return
    }

    request.setRequestHeader("Content-type", "multipart/form-data")
    request.send(formData)

    if (file?.item) {
      file.abortUploading = () => {
        request.abort()
        reject(new Error("File upload aborted"))
      }
    }
  })
