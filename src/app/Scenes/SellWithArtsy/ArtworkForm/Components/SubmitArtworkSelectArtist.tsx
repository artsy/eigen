import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { AutosuggestResult } from "app/Components/AutosuggestResults/AutosuggestResults"
import { AutosuggestResultsPlaceholder } from "app/Components/AutosuggestResults/AutosuggestResultsPlaceholder"
import {
  ArtistAutoSuggestNode,
  ArtistAutosuggest,
} from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistAutosuggest"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/navigationHelpers"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { navigate } from "app/system/navigation/navigate"
import { PlaceholderBox, PlaceholderText, ProvidePlaceholderContext } from "app/utils/placeholders"
import { useFormikContext } from "formik"
import { Suspense } from "react"

export const SubmitArtworkSelectArtist = () => {
  const { navigateToNextStep } = useSubmissionContext()
  const setIsLoading = SubmitArtworkFormStore.useStoreActions((actions) => actions.setIsLoading)

  const formik = useFormikContext<ArtworkDetailsFormModel>()

  const handleResultPress = async (result: AutosuggestResult) => {
    setIsLoading(true)

    formik.setFieldValue("artistSearchResult", result)
    formik.setFieldValue("artist", result.displayLabel)
    formik.setFieldValue("artistId", result.internalID)

    if (!result.internalID) {
      console.error("Artist ID not found")
      return
    }

    const artist = result as ArtistAutoSuggestNode
    const isTargetSupply =
      artist.__typename === "Artist" && artist.targetSupply?.priority === "TRUE"

    if (!isTargetSupply) {
      navigateToNextStep({
        step: "ArtistRejected",
        skipMutation: true,
      })
      setIsLoading(false)
      return
    }

    const updatedValues = {
      artistId: result.internalID,
      artist: result.displayLabel,
      artistSearchResult: result,
      userPhone: formik.values.userPhone,
      userEmail: formik.values.userEmail,
      userName: formik.values.userName,
    }

    try {
      const submissionId = await createOrUpdateSubmission(updatedValues, formik.values.submissionId)
      formik.setFieldValue("submissionId", submissionId)
      navigateToNextStep({
        step: "AddTitle",
        skipMutation: true,
      })
    } catch (error) {
      console.error("Error creating submission", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Flex>
      <Text variant="lg" mb={2}>
        Add artist name
      </Text>

      <Suspense fallback={<Placeholder />}>
        <ArtistAutosuggest
          onResultPress={handleResultPress}
          disableCustomArtists
          onlyP1Artists
          Hint={
            <Text variant="xs" color="black60" pt={1}>
              Currently, artists can not sell their own work on Artsy.{"\n"}
              <Text
                underline
                variant="xs"
                color="black60"
                onPress={() => {
                  navigate(
                    "https://support.artsy.net/s/article/Im-an-artist-Can-I-submit-my-own-work-to-sell"
                  )
                }}
              >
                Learn more.
              </Text>
            </Text>
          }
        />
      </Suspense>
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
