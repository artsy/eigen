import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { AutosuggestResult } from "app/Components/AutosuggestResults/AutosuggestResults"
import { AutosuggestResultsPlaceholder } from "app/Components/AutosuggestResults/AutosuggestResultsPlaceholder"
import LoadingModal from "app/Components/Modals/LoadingModal"
import { ArtistAutosuggest } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistAutosuggest"
import { ArtworkFormScreen } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkForm"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/navigationHelpers"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { PlaceholderBox, PlaceholderText, ProvidePlaceholderContext } from "app/utils/placeholders"
import { useFormikContext } from "formik"
import { Suspense, useState } from "react"

export const SubmissionArtworkFormArtist: React.FC<
  StackScreenProps<ArtworkFormScreen, "ArtworkFormArtist">
> = ({}) => {
  const { navigateToNextStep } = useSubmissionContext()
  const [isLoading, setIsLoading] = useState(false)

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

    const updatedValues = {
      artistId: result.internalID,
      artist: result.displayLabel,
      artistSearchResult: result,
    }

    try {
      // TODO: Not use `createOrUpdateSubmission` from old submission flow
      // TODO: Does it make sense to create a new submission here?
      // We might end up with a lot of submissions that are never completed
      const submissionId = await createOrUpdateSubmission(updatedValues, formik.values.submissionId)
      formik.setFieldValue("submissionId", submissionId)
      navigateToNextStep()
    } catch (error) {
      console.error("Error creating submission", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Flex>
      <LoadingModal isVisible={isLoading} dark />
      <Text variant="lg" mb={2}>
        Add artist name
      </Text>

      <Suspense fallback={<Placeholder />}>
        <ArtistAutosuggest
          onResultPress={handleResultPress}
          disableCustomArtistCreation
          onlyP1Artists
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
