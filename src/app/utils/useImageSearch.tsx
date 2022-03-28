import { navigate } from "app/navigation/navigate"
import {
  getConvectionGeminiKey,
  getGeminiCredentialsForEnvironment,
  uploadFileToS3,
} from "app/Scenes/Consignments/Submission/uploadFileToS3"
import { isEmpty } from "lodash"
import { useState } from "react"
import ImagePicker from "react-native-image-crop-picker"

export const useImageSearch = () => {
  const [errorMessage, setErrorMessage] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const getImgixUrl = async (imgPath: string) => {
    const convectionKey = await getConvectionGeminiKey()
    const acl = "private"

    const assetCredentials = await getGeminiCredentialsForEnvironment({
      acl,
      name: convectionKey || "",
    })
    const s3 = await uploadFileToS3({
      file: imgPath,
      acl,
      asset: assetCredentials,
    })

    return `https://artsy-hack9.imgix.net/${s3.key}?trim=auto&trim-sd=25&q=1`
  }

  const reverseImageSearch = async (imageUrl: string) => {
    const body = new FormData()
    body.append("url", imageUrl)

    try {
      const response = await fetch("https://match-staging.artsy.net/search", {
        body,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        method: "POST",
      })
      const json = await response.json()
      return json
    } catch (error) {
      console.error(error)
    }
  }

  const capturePhoto = async () => {
    setErrorMessage("")
    const cameraOptions = {
      compressImageQuality: 0.01,
      forceJpg: true,
    }
    let image
    try {
      image = await ImagePicker.openCamera(cameraOptions)
    } catch (error) {
      console.warn("error with image capture", error)
    }

    // show loading modal
    setIsLoading(true)
    setIsModalVisible(true)
    try {
      const imgUrl = await getImgixUrl(image?.path!)
      const response = await reverseImageSearch(imgUrl)
      if (isEmpty(response.result)) {
        setErrorMessage(
          "Unfortunatelly we didn't find anything for this image. Please try another one."
        )
      }
      const artworkHref =
        response.result[0]?.metadata?.artworkHref ?? response.result[0]?.metadata?.href
      if (!!artworkHref) {
        // close modal
        setIsModalVisible(false)
        // navigate user to the matching artwork
        navigate(artworkHref)
      }
    } catch (error) {
      setErrorMessage(`Something went wrong with the request: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    capturePhoto,
    isLoading,
    errorMessage,
    isModalVisible,
    setIsModalVisible,
  }
}
