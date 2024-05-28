import { Button, Flex, Spacer, Text, Touchable, useScreenDimensions } from "@artsy/palette-mobile"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkProgressBar } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkProgressBar"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/navigationHelpers"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { Photo } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/validation"
import { navigate, popToRoot, switchTab } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useFormikContext } from "formik"
import { useEffect } from "react"
import { LayoutAnimation } from "react-native"

export const SubmitArtworkBottomNavigation: React.FC<{}> = () => {
  const { navigateToNextStep, navigateToPreviousStep } = useSubmissionContext()
  const { isValid, values } = useFormikContext<ArtworkDetailsFormModel>()
  const isUploadingPhotos = values.photos.some((photo: Photo) => photo.loading)
  const showStartFromMyCollection = useFeatureFlag("AREnableSubmitMyCollectionArtworkInSubmitFlow")

  const { currentStep, isLoading } = SubmitArtworkFormStore.useStoreState((state) => state)
  const { width: screenWidth } = useScreenDimensions()

  const handleBackPress = () => {
    navigateToPreviousStep()
  }

  const handleNextPress = () => {
    navigateToNextStep()
  }

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }, [currentStep])

  if (!currentStep || currentStep === "SelectArtist") {
    return null
  }

  if (currentStep === "StartFlow") {
    return (
      <Flex borderTopWidth={1} borderTopColor="black10" py={2} alignSelf="center" px={2}>
        <Button
          onPress={() => {
            navigateToNextStep({
              step: "SelectArtist",
            })
          }}
          block
        >
          Start a New Submission
        </Button>
        {!!showStartFromMyCollection && (
          <Button
            onPress={() => {
              navigateToNextStep()
            }}
            block
            mt={2}
            variant="outline"
          >
            Start from My Collection
          </Button>
        )}
      </Flex>
    )
  }

  if (currentStep === "CompleteYourSubmission") {
    return (
      <Flex
        borderTopWidth={1}
        borderTopColor="black10"
        pb={2}
        width={screenWidth}
        alignSelf="center"
      >
        <Flex mx={2} my={1}>
          <SubmitArtworkProgressBar />
        </Flex>

        <Flex px={2}>
          <Spacer y={1} />

          <Button
            block
            onPress={() => {
              navigate("/sell/submissions/new", {
                replaceActiveScreen: true,
              })
            }}
          >
            Submit Another Work
          </Button>

          <Spacer y={2} />

          <Button
            block
            onPress={() => {
              switchTab("profile")
              requestAnimationFrame(() => {
                popToRoot()
              })
            }}
            variant="outline"
          >
            View Artwork In My Collection
          </Button>
        </Flex>
      </Flex>
    )
  }

  if (currentStep === "ArtistRejected") {
    return (
      <Flex borderTopWidth={1} borderTopColor="black10" py={2} alignSelf="center">
        <Flex px={2}>
          <Spacer y={1} />

          <Button
            block
            onPress={() => {
              navigate("/my-collection/artworks/new", {
                showInTabName: "profile",
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
      </Flex>
    )
  }

  return (
    <Flex borderTopWidth={1} borderTopColor="black10" pb={2} width="100%" alignSelf="center">
      <Flex mx={2} my={1}>
        <SubmitArtworkProgressBar />
      </Flex>

      <Flex px={2}>
        <Flex flexDirection="row" justifyContent="space-between" backgroundColor="white100">
          <Flex flexDirection="row" alignItems="center">
            <Touchable onPress={handleBackPress}>
              <Text underline>Back</Text>
            </Touchable>
          </Flex>
          <Button
            onPress={handleNextPress}
            disabled={!isValid || isLoading || isUploadingPhotos}
            loading={isLoading || isUploadingPhotos}
          >
            Continue
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}
