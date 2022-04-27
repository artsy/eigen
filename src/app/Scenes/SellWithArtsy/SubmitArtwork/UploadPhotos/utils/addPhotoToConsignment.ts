import { Photo } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/validation"
import { addAssetToConsignment } from "./addAssetToConsignment"
import {
  createGeminiAssetWithS3Credentials,
  getConvectionGeminiKey,
  getGeminiCredentialsForEnvironment,
  uploadFileToS3,
} from "./uploadFileToS3"

interface Props {
  asset: Photo
  submissionID: string
  updateProgress?: (progress: number) => void
}

export const addPhotoToConsignment = async ({ asset, submissionID, updateProgress }: Props) => {
  const acl = "private"

  // return if no path is found
  if (!asset.path) {
    return
  }

  // get convection key for Gemini
  const convectionKey = await getConvectionGeminiKey()

  if (!convectionKey) {
    console.error("Could not get convection key")
    return
  }

  // get S3 Credentials from Gemini
  const assetCredentials = await getGeminiCredentialsForEnvironment({ acl, name: convectionKey })

  // upload file to S3
  const s3 = await uploadFileToS3({
    filePath: asset.path,
    acl,
    assetCredentials,
    updateProgress,
  })

  // let Gemini know that this file exists and should be processed
  const geminiToken = await createGeminiAssetWithS3Credentials({
    sourceKey: s3.key,
    templateKey: convectionKey,
    sourceBucket: assetCredentials.policyDocument.conditions.bucket,
    metadata: {
      id: submissionID,
      _type: "Consignment",
    },
  })

  // let Convection know that the Gemini asset should be attached to the consignment
  const res = await addAssetToConsignment({
    assetType: "image",
    geminiToken,
    submissionID,
  })

  // update asset and return it
  if (asset) {
    asset.geminiToken = geminiToken
    asset.id = res.addAssetToConsignmentSubmission?.asset?.id
  }

  return asset
}
