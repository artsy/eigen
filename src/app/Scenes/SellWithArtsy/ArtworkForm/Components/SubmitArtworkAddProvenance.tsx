import { BulletedItem, Button, Flex, Input, Join, Spacer, Text } from "@artsy/palette-mobile"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/navigationHelpers"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { InfoModal } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/InfoModal/InfoModal"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { useFormikContext } from "formik"
import { useState } from "react"

export const SubmitArtworkAddProvenance = () => {
  const [isProvenanceInfoModalVisible, setIsProvenanceInfoModalVisible] = useState(false)
  const { isValid, setFieldValue, values } = useFormikContext<ArtworkDetailsFormModel>()
  const { navigateToNextStep } = useSubmissionContext()

  const handleNextPress = async () => {
    await createOrUpdateSubmission(values, values.submissionId)

    navigateToNextStep()
  }

  return (
    <Flex>
      {!!values.artistSearchResult && <ArtistSearchResult result={values.artistSearchResult} />}

      <Spacer y={2} />

      <Text variant="lg" mb={2}>
        Provenance
      </Text>

      <Join separator={<Spacer y={2} />}>
        <Text variant="xs" color="black60">
          The documented history of an artwork’s ownership and authenticity. Please add any
          documentation you have that proves your artwork’s provenance:
        </Text>

        <Input
          title="Provenance"
          onHintPress={() => setIsProvenanceInfoModalVisible(true)}
          placeholder="Describe how you acquired the artwork"
          testID="Submission_ProvenanceInput"
          value={values.provenance}
          onChangeText={(e) => setFieldValue("provenance", e)}
          multiline
        />
      </Join>

      <Spacer y={2} />

      <Button onPress={handleNextPress} block disabled={!isValid}>
        Save and Continue
      </Button>

      <InfoModal
        title="Artwork Provenance"
        visible={isProvenanceInfoModalVisible}
        onDismiss={() => setIsProvenanceInfoModalVisible(false)}
      >
        <Flex mb={4}>
          <Text>
            Provenance is the documented history of an artwork’s ownership and authenticity. Please
            list any documentation you have that proves your artwork’s provenance, such as:
          </Text>
        </Flex>

        <Flex flexDirection="column">
          <BulletedItem color="black">Invoices from previous owners</BulletedItem>
          <BulletedItem color="black">Certificates of authenticity</BulletedItem>
          <BulletedItem color="black">Gallery exhibition catalogues</BulletedItem>
        </Flex>
      </InfoModal>
    </Flex>
  )
}
