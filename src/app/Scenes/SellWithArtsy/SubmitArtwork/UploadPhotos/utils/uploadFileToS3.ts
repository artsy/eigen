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
declare var FormData: any
declare var XMLHttpRequest: any

interface Props {
  filePath: string
  acl: string
  assetCredentials: AssetCredentials
  updateProgress?: (progress: number) => void
  filename?: string
}
export const uploadFileToS3 = ({
  filePath,
  acl,
  assetCredentials,
  updateProgress,
  filename,
}: Props) =>
  new Promise<S3UploadResponse>((resolve, reject) => {
    const formData = new FormData()
    const geminiKey = assetCredentials.policyDocument.conditions.geminiKey
    const bucket = assetCredentials.policyDocument.conditions.bucket
    const uploadURL = `https://${bucket}.s3.amazonaws.com`

    const data = {
      acl,
      "Content-Type": "image/jpg",
      key: geminiKey + "/${filename}", // NOTE: This form (which _looks_ like ES6 interpolation) is required by AWS
      AWSAccessKeyId: assetCredentials.credentials,
      success_action_status: assetCredentials.policyDocument.conditions.successActionStatus,
      policy: assetCredentials.policyEncoded,
      signature: assetCredentials.signature,
    }

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        formData.append(key, data[key])
      }
    }

    formData.append("file", {
      uri: filePath,
      type: "image/jpeg",
      name: filename ?? "photo.jpg",
    })

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
        // e.g. https://artsy-media-uploads.s3.amazonaws.com/A3tfuXp0t5OuUKv07XaBOw%2F%24%7Bfilename%7D
        const url = e.target.responseHeaders.Location
        resolve({
          key: url.split("/").pop().replace("%2F", "/"),
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
  })
