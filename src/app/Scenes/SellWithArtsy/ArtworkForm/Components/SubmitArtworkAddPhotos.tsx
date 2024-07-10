import { OwnerType } from "@artsy/cohesion"
import { Flex, Join, LinkButton, Message, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { TipsForTakingPhotos } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkTipsForTakingPhotos"
import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { useNavigationListeners } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useNavigationListeners"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { InfoModal } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/InfoModal/InfoModal"
import { UploadPhotosForm } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/UploadPhotosForm"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useFormikContext } from "formik"
import { useState } from "react"
import { ScrollView } from "react-native"

export const SubmitArtworkAddPhotos = () => {
  const { values } = useFormikContext<ArtworkDetailsFormModel>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const setCurrentStep = SubmitArtworkFormStore.useStoreActions((actions) => actions.setCurrentStep)
  const navigation = useNavigation<NavigationProp<SubmitArtworkStackNavigation, "AddPhotos">>()

  useNavigationListeners({
    onNextStep: () => {
      setCurrentStep("AddDetails")
      navigation.navigate("AddDetails")
    },
  })

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.submitArtworkStepAddPhotos,
        context_screen_owner_id: values.submissionId || undefined,
      })}
    >
      <Flex px={2} flex={1}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <Join separator={<Spacer y={2} />}>
            <Text variant="lg-display">Upload photos of your artwork</Text>

            <Text color="black60" variant="xs">
              Make your work stand out and get your submission evaluated faster by uploading
              high-quality photos of the work's front and back.
            </Text>

            <LinkButton
              color="black60"
              variant="xs"
              onPress={() => {
                setIsModalVisible(true)
              }}
            >
              Tips for taking photos
            </LinkButton>

            {(values.photos.length === 1 || values.photos.length === 2) && (
              <Message
                title="Increase your chance of selling"
                text="Make sure to include images of the back, corners, frame and any other details if you can. "
                variant="success"
              />
            )}

            <UploadPhotosForm />
          </Join>
        </ScrollView>
        <InfoModal
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
          buttonVariant="outline"
          containerStyle={{ margin: 0 }}
          fullScreen
        >
          <TipsForTakingPhotos onDismiss={() => setIsModalVisible(false)} />
        </InfoModal>
      </Flex>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
