import AsyncStorage from "@react-native-community/async-storage"
import { captureMessage } from "@sentry/react-native"
import { ConsignmentAttributionClass } from "__generated__/createConsignSubmissionMutation.graphql"
import { Formik } from "formik"
import { CTAButton, Flex, Spacer, Text } from "palette"
import React, { useState } from "react"
import { CONSIGNMENT_SUBMISSION_STORAGE_ID } from "../SubmitArtworkOverview"
import { createOrUpdateConsignSubmission } from "../utils/createOrUpdateConsignSubmission"
import { limitedEditionValue } from "../utils/rarityOptions"
import { artworkDetailsInitialValues, artworkDetailsValidationSchema } from "../utils/validation"
import { ArtworkDetailsForm, ArtworkDetailsFormModel } from "./ArtworkDetailsForm"
import { ErrorView } from "./Components/ErrorView"

interface ArtworkDetailsProps {
  handlePress: () => void
}

export const ArtworkDetails: React.FC<ArtworkDetailsProps> = ({ handlePress }) => {
  const [submissionError, setSubmissionError] = useState(false)

  const handleArtworkDetailsSubmit = async (values: ArtworkDetailsFormModel) => {
    const isRarityLimitedEdition = values.rarity === limitedEditionValue
    const artworkDetailsForm = {
      ...values,
      editionNumber: isRarityLimitedEdition ? values.editionNumber : "",
      editionSizeFormatted: isRarityLimitedEdition ? values.editionSizeFormatted : "",
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
        locationCity: artworkDetailsForm.locationCity,
        locationState: artworkDetailsForm.locationState,
        locationCountry: artworkDetailsForm.locationCountry,
        state: "DRAFT",
        utmMedium: artworkDetailsForm.utmMedium,
        utmSource: artworkDetailsForm.utmSource,
        utmTerm: artworkDetailsForm.utmTerm,
      })

      if (submissionId) {
        await AsyncStorage.setItem(CONSIGNMENT_SUBMISSION_STORAGE_ID, submissionId)
        handlePress()
      }
    } catch (error) {
      captureMessage(JSON.stringify(error))
      setSubmissionError(true)
    }
  }

  if (submissionError) {
    return <ErrorView />
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
            disabled={!isValid}
            onPress={() => handleArtworkDetailsSubmit(values)}
            testID="Consignment_ArtworkDetails_Button"
          >
            Save & Continue
          </CTAButton>
        </Flex>
      )}
    </Formik>
  )
}
