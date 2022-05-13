import { useActionSheet } from "@expo/react-native-action-sheet"
import {
  ReverseSearchImageResultsQuery,
  ReverseSearchImageResultsQueryResponse,
} from "__generated__/ReverseSearchImageResultsQuery.graphql"
import { goBack } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { resizeImage } from "app/utils/resizeImage"
import { ReactNativeFile } from "extract-files"
import { Box, Button, Screen, Text } from "palette"
import { useState } from "react"
import { Alert } from "react-native"
import { graphql } from "react-relay"
import { fetchQuery } from "relay-runtime"
import { ReverseSearchImageResultItemFragmentContainer } from "./ReverseSearchImageResultItem"

type SearchImageResults = NonNullable<
  ReverseSearchImageResultsQueryResponse["reverseImageSearch"]
>["results"]

export const ReverseSearchImageResults = () => {
  const { showActionSheetWithOptions } = useActionSheet()
  const [fetching, setFetching] = useState(false)
  const [results, setResults] = useState<SearchImageResults | null>(null)

  const handleSeachByImage = async () => {
    try {
      const images = await showPhotoActionSheet(showActionSheetWithOptions, true, false)
      const image = images[0]
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

      setFetching(true)

      const resizedImage = await resizeImage({
        uri: image.path,
        width: resizedWidth,
        height: resizedHeight,
        quality: 85,
        onlyScaleDown: true,
      })
      const fileImage = new ReactNativeFile({
        uri: resizedImage.uri,
        name: resizedImage.name,
        type: "image/jpeg",
      })

      const execute = fetchQuery<ReverseSearchImageResultsQuery>(
        defaultEnvironment,
        graphql`
          query ReverseSearchImageResultsQuery($file: Upload!) {
            reverseImageSearch(image: $file) {
              results {
                ...ReverseSearchImageResultItem_item
                artwork {
                  internalID
                }
              }
            }
          }
        `,
        {
          file: fileImage,
        }
      )
      const response = await execute.toPromise()
      const imageResults = response?.reverseImageSearch?.results ?? []

      setResults(imageResults)
    } catch (error) {
      console.error(error)
      Alert.alert("Something went wrong", (error as Error).message)
    } finally {
      setFetching(false)
    }
  }

  const isEmptyResults = Array.isArray(results) && results.length === 0
  const hasResults = Array.isArray(results) && results.length > 0

  return (
    <Screen>
      <Screen.Header onBack={goBack} />
      <Screen.Body scroll>
        <Button block loading={fetching} onPress={handleSeachByImage}>
          Search by image
        </Button>

        <Box mt={2} mb={1}>
          {!!isEmptyResults && (
            <Text textAlign="center" my={2}>
              No matches
            </Text>
          )}

          {!!hasResults &&
            results.map((result) => (
              <ReverseSearchImageResultItemFragmentContainer
                key={result.artwork?.internalID}
                item={result}
              />
            ))}
        </Box>
      </Screen.Body>
    </Screen>
  )
}
