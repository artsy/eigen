import { navigate } from "lib/navigation/navigate"
import { isEmpty } from "lodash"
import { useState } from "react"
import ImagePicker from "react-native-image-crop-picker"

export const useImageSearch = () => {
  const [errorMessage, setErrorMessage] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [imgPath, setImgPath] = useState<string>("")

  const reverseImageSearch = async (imagePath: string) => {
    const shouldUseLocalImage = false
    const body = new FormData()
    if (shouldUseLocalImage) {
      body.append("image", {
        uri: imagePath,
        type: "image/jpeg",
        name: "image.jpg",
      })
    } else {
      body.append("url", "https://d32dm0rphc51dk.cloudfront.net/055ztBFvRMkxI6HfVb5RuA/normalized.jpg")
    }

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
      cropping: true,
      compressImageQuality: 0.3,
      freeStyleCropEnabled: true,
      forceJpg: true,
    }
    let image
    try {
      image = await ImagePicker.openCamera(cameraOptions)
      setImgPath(image.path)
    } catch (error) {
      console.warn("error with image capture", error)
    }

    // show loading modal
    setIsLoading(true)
    setIsModalVisible(true)
    try {
      const response = await reverseImageSearch(image?.path!)
      if (isEmpty(response.result)) {
        setErrorMessage("Unfortunatelly we didn't find anything for this image. Please try another one.")
      }
      if (response.result[0]?.metadata?.artworkHref) {
        // close modal
        setIsModalVisible(false)
        // navigate user to the matching artwork
        navigate(response.result[0].metadata.artworkHref)
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
    imgPath,
    isModalVisible,
    setIsModalVisible,
  }
}
