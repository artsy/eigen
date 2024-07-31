import { OwnerType } from "@artsy/cohesion"
import {
  Button,
  CloseIcon,
  DocumentIcon,
  Flex,
  INPUT_BORDER_RADIUS,
  ProgressBar,
  Separator,
  Spacer,
  Text,
  Touchable,
  useSpace,
} from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useToast } from "app/Components/Toast/toastHook"
import { isImage } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionImageUtil"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { useNavigationListeners } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useNavigationListeners"
import { SubmissionModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { ICON_SIZE } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/UploadPhotosForm"
import { addAssetToConsignment } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/utils/addAssetToConsignment"
import { uploadDocument } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/utils/uploadDocumentToS3" // pragma: allowlist secret
import { removeAssetFromSubmission } from "app/Scenes/SellWithArtsy/mutations/removeAssetFromConsignmentSubmissionMutation"
import { NormalizedDocument, normalizeUploadedDocument } from "app/utils/normalizeUploadedDocument"
import { showDocumentsAndPhotosActionSheet } from "app/utils/showDocumentsAndPhotosActionSheet"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useFormikContext } from "formik"
import { useState } from "react"
import { Image, LayoutAnimation, Platform, ScrollView } from "react-native"

// 50 MB in bytes
const FILE_SIZE_LIMIT = 50 * 1024 * 1024

export const SubmitArtworkAdditionalDocuments = () => {
  const { values, setFieldValue } = useFormikContext<SubmissionModel>()
  const [progress, setProgress] = useState<Record<string, number | null>>({})

  const space = useSpace()

  const { showActionSheetWithOptions } = useActionSheet()

  const { show: showToast } = useToast()

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

  // Uploading a file is a two step process
  // 1. Upload the file to S3
  // 2. Associate the file to the consignment submission
  const addDocumentToSubmission = async (document: NormalizedDocument) => {
    try {
      if (document.errorMessage) {
        return
      }

      document.loading = true

      // Upload the document to S3
      const response = await uploadDocument({
        document,
        updateProgress: (progress) => {
          setProgress((previousProgress) => ({
            ...previousProgress,
            [document.id]: progress,
          }))
        },
      })

      if (!response?.key) {
        document.errorMessage = "Failed to upload file"
        return
      }

      document.sourceKey = response.key

      // Associate the document to the consignment submission
      // upload & size the photo, and add it to processed photos
      // let Convection know that the Gemini asset should be attached to the consignment
      const res = await addAssetToConsignment({
        assetType: "additional_file",
        source: {
          key: response.key,
          bucket: document.bucket || response.bucket,
        },
        filename: document.name,
        externalSubmissionId: values.externalId,
        size: document.size,
        submissionID: values.submissionId,
      })

      document.assetId = res.addAssetToConsignmentSubmission?.asset?.id
    } catch (error) {
      console.error("Error uploading file", error)
      showToast("Could not upload file", "bottom", {
        backgroundColor: "red100",
      })
    } finally {
      document.loading = false
    }
  }

  const handleUpload = async () => {
    try {
      const results = await showDocumentsAndPhotosActionSheet(showActionSheetWithOptions, true)

      const normalizedFiles = results.map((document) => normalizeUploadedDocument(document))

      const filteredDocuments: NormalizedDocument[] = normalizedFiles
        // Remove duplicates
        .filter((document) => !values.additionalDocuments.find((doc) => doc.id === document.id))
        .map((document) => {
          if (document.size && parseInt(document.size, 10) > FILE_SIZE_LIMIT) {
            return {
              ...document,
              errorMessage: "File is too large (max. 50 MB)",
            }
          }
          return document
        })

      if (filteredDocuments.length > 0) {
        setIsLoading(true)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setFieldValue("additionalDocuments", values.additionalDocuments.concat(filteredDocuments))
        await Promise.all(
          filteredDocuments
            .filter((document) => !document.errorMessage)
            .map((document) => addDocumentToSubmission(document))
        )
      }
    } catch (error) {
      if (typeof error === "object" && (error as any).code === "DOCUMENT_PICKER_CANCELED") {
        return
      }
      console.error("Error uploading document", error)

      showToast("Could not upload documents, please try again.", "bottom", {
        backgroundColor: "red100",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // remove image assets from submission
  const handleDelete = async (document: NormalizedDocument) => {
    try {
      document.removed = true
      document.abortUploading?.()

      if (document.assetId) {
        await removeAssetFromSubmission({ assetID: document.assetId })
      }

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

      const filteredFiles = values.additionalDocuments.filter((doc) => doc.id !== document.id)

      setFieldValue("additionalDocuments", filteredFiles)
    } catch (error) {
      console.error("Failed to delete", error)
      showToast("Could not delete file", "bottom", {
        backgroundColor: "red100",
      })
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
              {values.additionalDocuments.map((document) => {
                return (
                  <UploadedFile
                    key={document.id}
                    document={document}
                    progress={progress[document.id]}
                    onRemove={() => {
                      handleDelete(document)
                    }}
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
  document: NormalizedDocument
  onRemove: () => void
  progress?: number | null
}> = ({ document, onRemove, progress }) => {
  const space = useSpace()
  const sizeInMb = document.size ? (parseFloat(document.size) / 1024 / 1024).toFixed(2) : 0

  return (
    <Flex>
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
          {isImage(document.item) && document.item.path ? (
            <Image
              source={{ uri: document.item.path }}
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
            {document.name}
          </Text>
          {document.errorMessage ? (
            <Text variant="xs" color="red100">
              {document.errorMessage}
            </Text>
          ) : (
            <Text variant="xs" color="black30">
              {sizeInMb} MB
            </Text>
          )}
        </Flex>
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
      </Flex>

      {!!progress && (
        <Flex flexDirection="row" alignItems="center" height={2} backgroundColor="red" top={-2}>
          <ProgressBar
            height={3}
            progress={progress * 100}
            trackColor={progress * 100 === 100 ? "green100" : "blue100"}
          />
        </Flex>
      )}
    </Flex>
  )
}
