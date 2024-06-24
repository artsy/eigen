import { OwnerType } from "@artsy/cohesion"
import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { AutosuggestResult } from "app/Components/AutosuggestResults/AutosuggestResults"
import { AutosuggestResultsPlaceholder } from "app/Components/AutosuggestResults/AutosuggestResultsPlaceholder"
import {
  ArtistAutoSuggestNode,
  ArtistAutosuggest,
} from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistAutosuggest"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useSubmissionContext"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { navigate } from "app/system/navigation/navigate"
import { PlaceholderBox, PlaceholderText, ProvidePlaceholderContext } from "app/utils/placeholders"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useFormikContext } from "formik"
import { Suspense } from "react"
import { TouchableOpacity } from "react-native"

export const SubmitArtworkSelectArtist = () => {
  const { currentStep } = useSubmissionContext()

  const setCurrentStep = SubmitArtworkFormStore.useStoreActions((actions) => actions.setCurrentStep)
  const setIsLoading = SubmitArtworkFormStore.useStoreActions((actions) => actions.setIsLoading)
  const { isLoading } = SubmitArtworkFormStore.useStoreState((state) => state)

  const navigation = useNavigation<NavigationProp<SubmitArtworkStackNavigation>>()

  const formik = useFormikContext<ArtworkDetailsFormModel>()

  const handleResultPress = async (result: AutosuggestResult) => {
    if (!result.internalID) {
      console.error("Artist ID not found")
      return
    }

    try {
      setIsLoading(true)

      const artist = result as ArtistAutoSuggestNode
      const isTargetSupply = artist.__typename === "Artist" && artist.targetSupply?.isTargetSupply

      if (!isTargetSupply) {
        navigation.navigate("ArtistRejected")
        setIsLoading(false)
        return
      }

      const updatedValues = {
        artistId: result.internalID,
        artist: result.displayLabel || "",
        artistSearchResult: result,
      }
      const newSubmissionId = await createOrUpdateSubmission(
        updatedValues,
        formik.values.submissionId
      )

      if (!formik.values.submissionId || newSubmissionId !== formik.values.submissionId) {
        formik.setFieldValue("submissionId", newSubmissionId)
      }
      formik.setFieldValue("artistSearchResult", updatedValues.artistSearchResult)
      formik.setFieldValue("artist", updatedValues.artist)
      formik.setFieldValue("artistId", updatedValues.artistId)

      navigation.navigate("AddTitle")
      setCurrentStep("AddTitle")
    } catch (error) {
      console.error("Failed to set submission artist", error)
    } finally {
      setIsLoading(true)
    }
  }

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.submitArtworkStepSelectArtist })}
    >
      <Flex px={2}>
        <Flex pb={6}>
          <Text variant="lg" mb={2}>
            Add artist name
          </Text>

          <Suspense fallback={<Placeholder />}>
            <ArtistAutosuggest
              onResultPress={handleResultPress}
              disableCustomArtists
              onlyP1Artists
              loading={isLoading}
              hideCollectedArtists
              autoFocus={currentStep === "SelectArtist"}
              Hint={
                <Flex py={1}>
                  <Text variant="xs" color="black60">
                    Currently, artists can not sell their own work on Artsy.
                  </Text>
                  <TouchableOpacity>
                    <Text
                      underline
                      variant="xs"
                      color="black60"
                      style={{
                        zIndex: 1000,
                      }}
                      onPress={() => {
                        navigate(
                          "https://support.artsy.net/s/article/Im-an-artist-Can-I-submit-my-own-work-to-sell"
                        )
                      }}
                    >
                      Learn more.
                    </Text>
                  </TouchableOpacity>
                </Flex>
              }
            />
          </Suspense>
        </Flex>
      </Flex>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const Placeholder: React.FC = () => (
  <ProvidePlaceholderContext>
    <PlaceholderBox height={50} />
    <Spacer y={2} />
    <PlaceholderText width={250} />
    <Spacer y={4} />
    <PlaceholderText width={180} />
    <Spacer y={2} />
    <AutosuggestResultsPlaceholder />
  </ProvidePlaceholderContext>
)
