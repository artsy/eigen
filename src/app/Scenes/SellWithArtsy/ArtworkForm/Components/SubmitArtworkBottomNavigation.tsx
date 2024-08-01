import { Button, Flex, Spacer, Text, Touchable, useSpace } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useSubmissionContext"
import { SubmissionModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { useSubmitArtworkTracking } from "app/Scenes/SellWithArtsy/Hooks/useSubmitArtworkTracking"
import { Photo } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/validation"
import { GlobalStore } from "app/store/GlobalStore"
import { dismissModal, navigate, popToRoot, switchTab } from "app/system/navigation/navigate"
import { useIsKeyboardVisible } from "app/utils/hooks/useIsKeyboardVisible"
import { NormalizedDocument } from "app/utils/normalizeUploadedDocument"
import { useFormikContext } from "formik"
import { useEffect } from "react"
import { LayoutAnimation } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const SubmitArtworkBottomNavigation: React.FC<{}> = () => {
  const {
    trackTappedSubmissionBack,
    trackTappedSubmitAnotherWork,
    trackTappedViewArtworkInMyCollection,
  } = useSubmitArtworkTracking()
  const {
    navigateToNextStep,
    navigateToPreviousStep,
    isFinalStep,
    isValid,
    currentStep,
    isLoading,
  } = useSubmissionContext()
  const { values } = useFormikContext<SubmissionModel>()
  const navigation = useNavigation<NavigationProp<SubmitArtworkStackNavigation>>()

  const setCurrentStep = SubmitArtworkFormStore.useStoreActions((actions) => actions.setCurrentStep)

  const { trackTappedNewSubmission, trackTappedStartMyCollection, trackConsignmentSubmitted } =
    useSubmitArtworkTracking()

  const isUploadingAdditionalDocuments = values.additionalDocuments.some(
    (document: NormalizedDocument) => document.loading
  )
  const allDocumentsAreValid = values.additionalDocuments.every(
    (document: NormalizedDocument) => !document.errorMessage
  )

  const isUploadingPhotos = values.photos.some((photo: Photo) => photo.loading)
  const allPhotosAreValid = values.photos.every(
    (photo: Photo) => !photo.error && !photo.errorMessage
  )

  const handleBackPress = () => {
    trackTappedSubmissionBack(values.submissionId, currentStep)
    navigateToPreviousStep()
  }

  const handleNextPress = () => {
    if (isFinalStep) {
      trackConsignmentSubmitted(values.submissionId)
    }

    navigateToNextStep()
  }

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }, [currentStep])

  if (
    !currentStep ||
    currentStep === "SelectArtist" ||
    currentStep === "SubmitArtworkFromMyCollection"
  ) {
    return null
  }

  if (currentStep === "StartFlow") {
    return (
      <Wrapper>
        <Button
          onPress={() => {
            trackTappedNewSubmission()
            navigation.navigate("SelectArtist")
            setCurrentStep("SelectArtist")
          }}
          block
        >
          Start New Submission
        </Button>
        <Button
          onPress={() => {
            trackTappedStartMyCollection()
            navigation.navigate("SubmitArtworkFromMyCollection")
            setCurrentStep("SubmitArtworkFromMyCollection")
          }}
          block
          mt={2}
          variant="outline"
        >
          Start from My Collection
        </Button>
      </Wrapper>
    )
  }

  if (currentStep === "CompleteYourSubmission") {
    return (
      <Wrapper>
        <Flex px={2}>
          <Spacer y={1} />
          <Button
            block
            onPress={() => {
              trackTappedSubmitAnotherWork(values.submissionId)
              dismissModal(() => {
                navigate("/sell/submissions/new")
              })
            }}
          >
            Submit Another Work
          </Button>
          <Spacer y={2} />
          <Button
            block
            onPress={() => {
              trackTappedViewArtworkInMyCollection(values.submissionId)
              switchTab("profile")
              dismissModal()
              requestAnimationFrame(() => {
                popToRoot()
              })
            }}
            variant="outline"
          >
            View Artwork In My Collection
          </Button>
        </Flex>
      </Wrapper>
    )
  }

  if (currentStep === "ArtistRejected") {
    return (
      <Wrapper>
        <Flex px={2}>
          <Spacer y={1} />

          <Button
            block
            onPress={() => {
              GlobalStore.actions.myCollection.artwork.setFormValues({
                artist: values.artist,
                artistSearchResult: values.artistSearchResult,
              })

              navigate("/my-collection/artworks/new", {
                showInTabName: "profile",
                replaceActiveModal: true,
              })
            }}
          >
            Add to My Collection
          </Button>

          <Spacer y={2} />

          <Button
            block
            onPress={() => {
              handleBackPress()
            }}
            variant="outline"
          >
            Add Another Artist
          </Button>
        </Flex>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <Flex flexDirection="row" justifyContent="space-between" backgroundColor="white100">
        <Flex flexDirection="row" alignItems="center">
          <Touchable onPress={handleBackPress}>
            <Text underline>Back</Text>
          </Touchable>
        </Flex>
        <Button
          onPress={handleNextPress}
          disabled={
            !isValid ||
            isLoading ||
            isUploadingPhotos ||
            !allPhotosAreValid ||
            !allDocumentsAreValid
          }
          loading={isLoading || isUploadingPhotos || isUploadingAdditionalDocuments}
        >
          {isFinalStep ? "Submit Artwork" : "Continue"}
        </Button>
      </Flex>
    </Wrapper>
  )
}

const Wrapper: React.FC<{}> = ({ children }) => {
  const isKeyboardVisible = useIsKeyboardVisible(true)
  const { bottom: bottomInset } = useSafeAreaInsets()
  const space = useSpace()

  return (
    <Flex
      borderTopWidth={1}
      borderTopColor="black10"
      width="100%"
      px={2}
      pt={2}
      pb={isKeyboardVisible ? 2 : `${space(2) + bottomInset}px`}
      alignSelf="center"
    >
      {children}
    </Flex>
  )
}
