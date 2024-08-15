import {
  Button,
  CloseIcon,
  DocumentIcon,
  Flex,
  INPUT_BORDER_RADIUS,
  Join,
  ProgressBar,
  Spacer,
  Text,
  Touchable,
  useSpace,
} from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useToast } from "app/Components/Toast/toastHook"
import { ICON_HIT_SLOP } from "app/Components/constants"
import { isImage } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionImageUtil"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { useNavigationListeners } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useNavigationListeners"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useSubmissionContext"
import { SubmissionModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { ICON_SIZE } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/UploadPhotosForm"
import { addDocumentToSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/utils/addDocumentToSubmission" // pragma: allowlist secret
import { deleteDocument } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/utils/deleteDocument"
import { NormalizedDocument, normalizeUploadedDocument } from "app/utils/normalizeUploadedDocument"
import { showDocumentsAndPhotosActionSheet } from "app/utils/showDocumentsAndPhotosActionSheet"
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

  const { useSubmitArtworkScreenTracking } = useSubmissionContext()

  useSubmitArtworkScreenTracking("AdditionalDocuments")

  useNavigationListeners({
    onNextStep: async () => {
      try {
        setIsLoading(true)

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
            .map((document) => {
              if (values.externalId && values.submissionId) {
                return addDocumentToSubmission({
                  document,
                  externalId: values.externalId,
                  submissionId: values.submissionId,
                  updateProgress: (progress) => {
                    setProgress((previousProgress) => ({
                      ...previousProgress,
                      [document.id]: progress,
                    }))
                  },
                  onError: () => {
                    showToast("Could not upload file", "bottom", {
                      backgroundColor: "red100",
                    })
                  },
                })
              }
            })
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
    await deleteDocument({
      document,
      onComplete: () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        const filteredFiles = values.additionalDocuments.filter((doc) => doc.id !== document.id)
        setFieldValue("additionalDocuments", filteredFiles)
      },
      onError: () => {
        showToast("Could not delete file", "bottom", {
          backgroundColor: "red100",
        })
      },
    })
  }

  return (
    <Flex px={2} flex={1}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        <Flex>
          <Join separator={<Spacer y={2} />}>
            <Text variant="lg-display">Additional documents</Text>

            <Text color="black60" variant="xs">
              Please add any of the follow if you have them: Proof of purchase, Certificate of
              Authentication, Fact Sheet, Condition Report
            </Text>

            <Button block variant="outline" onPress={handleUpload}>
              Add Documents
            </Button>

            <Text color="black60" variant="xs">
              Maximum size: 50 MB.
            </Text>

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
          </Join>
        </Flex>
      </ScrollView>
    </Flex>
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
            hitSlop={ICON_HIT_SLOP}
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
