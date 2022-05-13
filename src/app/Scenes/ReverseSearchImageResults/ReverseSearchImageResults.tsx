import { useActionSheet } from "@expo/react-native-action-sheet"
import { ReverseSearchImageResultsQuery } from "__generated__/ReverseSearchImageResultsQuery.graphql"
import { goBack, navigate } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { resizeImage } from "app/utils/resizeImage"
import { ReactNativeFile } from "extract-files"
import { Box, Button, Flex, Screen, Text } from "palette"
import { useState } from "react"
import { Alert, Image, TouchableOpacity } from "react-native"
import { graphql } from "react-relay"
import { fetchQuery } from "relay-runtime"

interface SearchImageResults {
  matchPercent: number
  artwork: {
    internalID: string
    href: string
    title: string
    artistNames: string
    image: {
      url: string
    }
  }
}

export const ReverseSearchImageResults = () => {
  const { showActionSheetWithOptions } = useActionSheet()
  const [fetching, setFetching] = useState(false)
  const [results, setResults] = useState<SearchImageResults[] | null>(null)

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
                matchPercent
                artwork {
                  internalID
                  href
                  title
                  artistNames
                  image {
                    url(version: "square")
                  }
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
      const imageSearchResults = response?.reverseImageSearch?.results ?? []
      const formattedResults = imageSearchResults.reduce((acc, result) => {
        if (result?.artwork) {
          const resultEntity: SearchImageResults = {
            matchPercent: result?.matchPercent!,
            artwork: {
              internalID: result.artwork.internalID,
              href: result.artwork.href!,
              title: result.artwork.title!,
              artistNames: result.artwork.artistNames!,
              image: {
                url: result.artwork.image!.url!,
              },
            },
          }

          return [...acc, resultEntity]
        }

        return acc
      }, [] as SearchImageResults[])

      setResults(formattedResults)
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
      <Screen.Body>
        <Button block loading={fetching} mb={2} onPress={handleSeachByImage}>
          Search by image
        </Button>

        {!!isEmptyResults && (
          <Flex flex={1} alignItems="center" justifyContent="center">
            <Text>No matches</Text>
          </Flex>
        )}

        {!!hasResults &&
          results.map((result) => (
            <TouchableOpacity
              key={result.artwork.internalID}
              onPress={() => navigate(result.artwork.href)}
            >
              <Flex my={1} alignItems="center" flexDirection="row">
                <Image
                  source={{ uri: result.artwork.image.url }}
                  style={{
                    width: 60,
                    height: 60,
                    resizeMode: "contain",
                  }}
                />
                <Box ml={1}>
                  <Text>{result.artwork.title}</Text>
                  <Text variant="sm" color="black60">
                    {result.artwork.artistNames}
                  </Text>
                </Box>
              </Flex>
            </TouchableOpacity>
          ))}
      </Screen.Body>
    </Screen>
  )
}
