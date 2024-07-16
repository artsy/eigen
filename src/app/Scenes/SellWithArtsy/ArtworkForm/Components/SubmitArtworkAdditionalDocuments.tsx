import { OwnerType } from "@artsy/cohesion"
import {
  Button,
  CloseIcon,
  DocumentIcon,
  Flex,
  INPUT_BORDER_RADIUS,
  Separator,
  Spacer,
  Text,
  Touchable,
  useSpace,
} from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useToast } from "app/Components/Toast/toastHook"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { useNavigationListeners } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useNavigationListeners"
import { SubmissionModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { ICON_SIZE } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/UploadPhotosForm"
import {
  isDocument,
  isImage,
  showDocumentsAndPhotosActionSheet,
} from "app/utils/showDocumentsAndPhotosActionSheet"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useFormikContext } from "formik"
import { useState } from "react"
import { Image, LayoutAnimation, Platform, ScrollView } from "react-native"
import { DocumentPickerResponse } from "react-native-document-picker"
import { Image as RNPickerImage } from "react-native-image-crop-picker"

type UploadedFile = {
  error?: string
} & DocumentPickerResponse

type UploadedImage = {
  error?: string
} & RNPickerImage

// 50 MB in bytes
const FILE_SIZE_LIMIT = 1 * 1024 * 1024

export const SubmitArtworkAdditionalDocuments = () => {
  const { values } = useFormikContext<SubmissionModel>()

  const space = useSpace()

  const { showActionSheetWithOptions } = useActionSheet()

  const { show: showToast } = useToast()

  const [documents, setDocuments] = useState<UploadedFile[]>([])
  const [images, setImages] = useState<UploadedImage[]>([])

  const setIsLoading = SubmitArtworkFormStore.useStoreActions((actions) => actions.setIsLoading)
  const setCurrentStep = SubmitArtworkFormStore.useStoreActions((actions) => actions.setCurrentStep)

  const navigation =
    useNavigation<NavigationProp<SubmitArtworkStackNavigation, "AdditionalDocuments">>()

  useNavigationListeners({
    onNextStep: async () => {
      try {
        setIsLoading(true)

        // Make API call to update submission

        navigation.navigate("Condition")
        setCurrentStep("Condition")
      } catch (error) {
        console.error("Error setting title", error)
        showToast("Could not save your submission, please try again.", "bottom", {
          backgroundColor: "red100",
        })
      } finally {
        setIsLoading(false)
      }
    },
  })

  const handleUpload = async () => {
    try {
      const results = await showDocumentsAndPhotosActionSheet(showActionSheetWithOptions, true)
      const imagesResults = results.filter(isImage)
      const documentsResults = results.filter(isDocument)

      const filteredDocuments = documentsResults
        // Remove duplicates
        .filter(({ uri }) => !documents.find(({ uri: fileUri }) => fileUri === uri))
        // Remove files that are too large
        .map((file) => {
          if (file.size && file.size > FILE_SIZE_LIMIT) {
            return {
              ...file,
              error: "File is too large (max. 50 MB)",
            }
          }
          return file
        })

      const filteredImages = imagesResults
        // Remove duplicates
        .filter(({ path }) => !images.find(({ path: ImagePath }) => ImagePath === path))
        // Remove images that are too large
        .map((image) => {
          if (image.size && image.size > FILE_SIZE_LIMIT) {
            return {
              ...image,
              error: "Image is too large (max. 50 MB)",
            }
          }
          return image
        })

      if (filteredDocuments.length > 0) {
        setIsLoading(true)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setDocuments(documents.concat(filteredDocuments))
      }

      if (filteredImages.length > 0) {
        setIsLoading(true)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setImages(images.concat(filteredImages))
      }
    } catch (error) {
      if (typeof error === "object" && (error as any).code === "DOCUMENT_PICKER_CANCELED") {
        return
      }
      showToast("Could not upload documents, please try again.", "bottom", {
        backgroundColor: "red100",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // remove image assets from submission
  const handleImageDelete = async (path: string) => {
    try {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      const filteredImages = images.filter((image) => image.path !== path)
      setImages(filteredImages)

      // TODO: unlink from submission
    } catch (error) {
      console.error("Failed to delete image", error)
    }
  }

  // remove image assets from submission
  const handleDocumentDelete = async (uri: string) => {
    try {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      const filteredDocuments = documents.filter(({ uri: fileUri }) => fileUri !== uri)
      setDocuments(filteredDocuments)

      // TODO: unlink from submission
    } catch (error) {
      console.error("Failed to delete document", error)
    }
  }

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.submitArtworkStepAddtionalDocuments,
        context_screen_owner_id: values.submissionId || undefined,
      })}
    >
      <Flex px={2} flex={1}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
        >
          <Flex>
            <Text variant="lg-display">Additional documents</Text>

            <Spacer y={2} />

            <Text color="black60" variant="xs">
              Please add any of the follow if you have them: Proof of purchase, Certificate of
              Authentication, Fact Sheet, Condition Report
            </Text>

            <Spacer y={2} />

            <Button block variant="outline" onPress={handleUpload}>
              Add Documents
            </Button>

            <Separator my={2} borderColor="black10" />

            <Flex rowGap={space(2)}>
              {documents.map(({ uri, name, size, error, type }) => {
                return (
                  <UploadedFile
                    // progress={progress}
                    error={error}
                    key={uri}
                    name={name}
                    uri={uri}
                    onRemove={() => {
                      handleDocumentDelete(uri)
                    }}
                    size={size}
                    type={type}
                  />
                )
              })}
              {images.map(({ path, size, error }) => {
                return (
                  <UploadedFile
                    error={error}
                    key={path}
                    name={!error ? "Image added successfully" : "Could not add image"}
                    uri={path}
                    onRemove={() => {
                      handleImageDelete(path)
                    }}
                    size={size}
                    type="image"
                  />
                )
              })}
            </Flex>
          </Flex>
        </ScrollView>
      </Flex>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const CONTAINER_HEIGHT = 60

const UploadedFile: React.FC<{
  error?: string
  name: string | null
  onRemove: () => void
  progress?: number
  size: number | null
  type: string | null
  uri: string
}> = ({ error, name, size, onRemove, type, uri }) => {
  const space = useSpace()
  const sizeInMb = size ? (size / 1024 / 1024).toFixed(2) : 0

  return (
    <Flex
      flexDirection="row"
      gap={space(1)}
      alignItems="center"
      borderWidth={1}
      borderColor="black10"
      borderRadius={INPUT_BORDER_RADIUS}
      pr={1}
    >
      <Flex
        height={CONTAINER_HEIGHT}
        width={CONTAINER_HEIGHT}
        borderTopLeftRadius={INPUT_BORDER_RADIUS}
        borderBottomLeftRadius={INPUT_BORDER_RADIUS}
        backgroundColor="black5"
        justifyContent="center"
        alignItems="center"
      >
        {type && type.includes("image") ? (
          <Image
            source={{ uri }}
            resizeMode="cover"
            width={CONTAINER_HEIGHT}
            height={CONTAINER_HEIGHT}
          />
        ) : (
          <DocumentIcon fill="black100" width={20} height={20} />
        )}
      </Flex>
      <Flex flex={1}>
        <Text
          variant="xs"
          color="black100"
          numberOfLines={1}
          // Middle ellipsize is broken on Android :shrug:
          ellipsizeMode={Platform.OS === "ios" ? "middle" : "tail"}
        >
          {name}
        </Text>
        {error ? (
          <Text variant="xs" color="red100">
            {error}
          </Text>
        ) : (
          <Text variant="xs" color="black30">
            {sizeInMb} MB
          </Text>
        )}
      </Flex>
      {!error && (
        <Flex justifySelf="flex-end" ml={0.5}>
          <Touchable
            onPress={onRemove}
            haptic="impactHeavy"
            hitSlop={{
              top: 5,
              right: 5,
              bottom: 5,
              left: 5,
            }}
            style={{
              backgroundColor: "black",
              borderRadius: ICON_SIZE / 2,
              height: ICON_SIZE,
              width: ICON_SIZE,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CloseIcon height={16} width={16} fill="white100" />
          </Touchable>
        </Flex>
      )}
    </Flex>
  )
}
