import AsyncStorage from "@react-native-community/async-storage"
import { ConsignmentAttributionClass } from "__generated__/createConsignSubmissionMutation.graphql"
import { Formik } from "formik"
import { CTAButton, Flex, Spacer, Text } from "palette"
import React from "react"
import { CONSIGNMENT_SUBMISSION_STORAGE_ID } from "../SubmitArtworkOverview"
import { createOrUpdateConsignSubmission } from "../utils/createOrUpdateConsignSubmission"
import { limitedEditionValue } from "../utils/rarityOptions"
import { artworkDetailsInitialValues, artworkDetailsValidationSchema } from "../utils/validation"
import { ArtworkDetailsForm, ArtworkDetailsFormModel } from "./ArtworkDetailsForm"
interface ArtworkDetailsProps {
  handlePress: () => void
}

export const ArtworkDetails: React.FC<ArtworkDetailsProps> = ({ handlePress }) => {
  const handleArtworkDetailsSubmit = async (values: ArtworkDetailsFormModel) => {
    const isRarityLimitedEdition = values.rarity === limitedEditionValue
    const artworkDetailsForm = {
      ...values,
      editionNumber: isRarityLimitedEdition ? values.editionNumber : "",
      editionSizeFormatted: isRarityLimitedEdition ? values.editionSize : "",
    }

    let submissionId: string | undefined = (await AsyncStorage.getItem(CONSIGNMENT_SUBMISSION_STORAGE_ID)) || undefined
    const attributionClass = artworkDetailsForm.rarity.replace(" ", "_").toUpperCase() as ConsignmentAttributionClass

    try {
      submissionId = await createOrUpdateConsignSubmission({
        attributionClass,
        id: submissionId,
        artistID: artworkDetailsForm.artistId,
        year: artworkDetailsForm.year,
        title: artworkDetailsForm.title,
        medium: artworkDetailsForm.materials,
        editionNumber: artworkDetailsForm.editionNumber,
        editionSizeFormatted: artworkDetailsForm.editionSizeFormatted,
        height: artworkDetailsForm.height,
        width: artworkDetailsForm.width,
        depth: artworkDetailsForm.depth,
        dimensionsMetric: artworkDetailsForm.units,
        provenance: artworkDetailsForm.provenance,
        locationCity: artworkDetailsForm.location,
        state: "DRAFT",
        utmMedium: artworkDetailsForm.utmMedium,
        utmSource: artworkDetailsForm.utmSource,
        utmTerm: artworkDetailsForm.utmTerm,
      })
    } catch (error) {
      // TODO
      console.log({ error })
      return
    }

    if (submissionId) {
      await AsyncStorage.setItem(CONSIGNMENT_SUBMISSION_STORAGE_ID, submissionId)
      handlePress()
    }
  }

  return (
    <Formik<ArtworkDetailsFormModel>
      initialValues={artworkDetailsInitialValues}
      onSubmit={handleArtworkDetailsSubmit}
      validationSchema={artworkDetailsValidationSchema}
      validateOnMount
    >
      {({ values, isValid }) => (
        <Flex p={1} mt={1} height={1130}>
          <Text variant="sm" color="black60">
            • All fields are required to submit an artwork.
          </Text>
          <Text variant="sm" color="black60">
            • Unfortunately, we do not allow&nbsp;
            <Text style={{ textDecorationLine: "underline" }}>artists to sell their own work</Text> on Artsy.
          </Text>
          <Spacer mt={2} />
          <ArtworkDetailsForm />
          <Spacer mt={3} />
          <CTAButton
            mt={values.rarity === limitedEditionValue ? 0 : 2}
            disabled={!isValid}
            onPress={() => handleArtworkDetailsSubmit(values)}
          >
            Save & Continue
          </CTAButton>
        </Flex>
      )}
    </Formik>
  )
}
