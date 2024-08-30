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
import { SubmissionModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { navigate } from "app/system/navigation/navigate"
import { PlaceholderBox, PlaceholderText, ProvidePlaceholderContext } from "app/utils/placeholders"
import { useFormikContext } from "formik"
import { Suspense } from "react"
import { TouchableOpacity } from "react-native"

export const SubmitArtworkSelectArtist = () => {
  const { isLoading, currentStep, useSubmitArtworkScreenTracking } = useSubmissionContext()

  const setIsLoading = SubmitArtworkFormStore.useStoreActions((actions) => actions.setIsLoading)
  const setCurrentStep = SubmitArtworkFormStore.useStoreActions((actions) => actions.setCurrentStep)

  const navigation = useNavigation<NavigationProp<SubmitArtworkStackNavigation, "SelectArtist">>()

  const formik = useFormikContext<SubmissionModel>()

  useSubmitArtworkScreenTracking("SelectArtist")

  const handleResultPress = async (result: AutosuggestResult) => {
    setIsLoading(true)

    formik.setValues({
      ...formik.values,
      artistSearchResult: result,
      artist: result.displayLabel || "",
      artistId: result.internalID || "",
    })

    if (!result.internalID) {
      console.error("Artist ID not found")
      return
    }

    const artist = result as ArtistAutoSuggestNode
    const isTargetSupply = artist.__typename === "Artist" && artist.targetSupply?.isTargetSupply

    if (!isTargetSupply) {
      navigation.navigate("ArtistRejected")
      setCurrentStep("ArtistRejected")

      setIsLoading(false)
      return
    }

    const updatedValues = {
      ...formik.values,
      artistId: result.internalID,
      artist: result.displayLabel || "",
      artistSearchResult: result,
      userPhone: formik.values.userPhone,
      userEmail: formik.values.userEmail,
      userName: formik.values.userName,
    }

    try {
      const response = await createOrUpdateSubmission(updatedValues, formik.values.externalId)

      formik.setFieldValue("submissionId", response?.internalID)
      formik.setFieldValue("externalId", response?.externalID)

      navigation.navigate("AddTitle")
      setCurrentStep("AddTitle")
    } catch (error) {
      console.error("Error creating submission", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Flex px={2}>
      <Flex pb={6}>
        <Text variant="lg-display" mb={2}>
          Add artist name
        </Text>

        <Suspense fallback={<Placeholder />}>
          <ArtistAutosuggest
            onResultPress={handleResultPress}
            disableCustomArtists
            onlyP1Artists
            disableFormik
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
