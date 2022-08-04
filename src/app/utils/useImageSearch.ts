import { useImageSearchQuery } from "__generated__/useImageSearchQuery.graphql"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { ReactNativeFile } from "extract-files"
import { useState } from "react"
import { Platform } from "react-native"
import { fetchQuery, graphql } from "react-relay"
import RNFetchBlob from "rn-fetch-blob"
import { resizeImage } from "./resizeImage"

interface SearchImage {
  path: string
  width: number
  height: number
}

export const useImageSearch = () => {
  const [searchingByImage, setSearchingByImage] = useState(false)

  const handleSeachByImage = async (image: SearchImage) => {
    try {
      let resizedWidth = image.width
      let resizedHeight = image.height

      /**
       * For optimal performance of TinEye, image should be 600px in size in the smallest dimension
       * For example, image with 1600x1200 size should be resized to 800x600
       */
      if (image.width > image.height) {
        resizedHeight = 600
      } else {
        resizedWidth = 600
      }

      setSearchingByImage(true)

      const resizedImage = await resizeImage({
        uri: image.path,
        width: resizedWidth,
        height: resizedHeight,
        quality: 85,
        onlyScaleDown: true,
      })

      /**
       * Images posted to server via fetch get their size inflated significantly for iOS.
       * This is a small hack to solve this problem
       *
       * You can find more context here: https://github.com/facebook/react-native/issues/27099
       */
      if (Platform.OS === "ios") {
        const updatedPath = replaceFilenameInValue(resizedImage.path, resizedImage.name)
        const updatedURI = replaceFilenameInValue(resizedImage.uri, resizedImage.name)
        const updatedFilename = replaceFilenameInValue(resizedImage.name, resizedImage.name)

        await RNFetchBlob.fs.mv(resizedImage.path, updatedPath)

        resizedImage.path = updatedPath
        resizedImage.uri = updatedURI
        resizedImage.name = updatedFilename
      }

      const fileImage = new ReactNativeFile({
        uri: resizedImage.uri,
        name: resizedImage.name,
        type: "image/jpeg",
      })

      const response = await fetchQuery<useImageSearchQuery>(
        defaultEnvironment,
        graphql`
          query useImageSearchQuery($file: Upload!) {
            reverseImageSearch(image: $file) {
              results {
                matchPercent
                artwork {
                  href
                  internalID
                }
              }
            }
          }
        `,
        {
          file: fileImage,
        }
      ).toPromise()
      const imageResults = response?.reverseImageSearch?.results ?? []
      const sortedImageResults = [...imageResults].sort(
        (asc, desc) => desc!.matchPercent - asc!.matchPercent
      )

      return sortedImageResults
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      setSearchingByImage(false)
    }
  }

  return {
    searchingByImage,
    handleSeachByImage,
  }
}

const replaceFilenameInValue = (value: string, filename: string) => {
  return value.replace(filename, `${filename}.toUpload`)
}
