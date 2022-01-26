import { captureMessage } from "@sentry/react-native"
import { ConsignmentAttributionClass } from "__generated__/createConsignSubmissionMutation.graphql"
import { Formik } from "formik"
import { GlobalStore } from "lib/store/GlobalStore"
import { CTAButton, Flex, Spacer, Text } from "palette"
import React, { useState } from "react"
import { ScrollView } from "react-native"
import { createOrUpdateConsignSubmission } from "../utils/createOrUpdateConsignSubmission"
import { getArtworkDetailsInitialValues } from "../utils/getArtworkDetailsInitialValues"
import { limitedEditionValue } from "../utils/rarityOptions"
import { artworkDetailsValidationSchema } from "../utils/validation"
import { ArtworkDetailsForm, ArtworkDetailsFormModel } from "./ArtworkDetailsForm"
import { ErrorView } from "./Components/ErrorView"

export const ArtworkDetails: React.FC<{ handlePress: () => void }> = ({ handlePress }) => {
  const { submissionForm } = GlobalStore.useAppState((state) => state.artworkSubmission.submission)

  const [submissionError, setSubmissionError] = useState(false)

  const artworkDetailsInitialValues: ArtworkDetailsFormModel =
    getArtworkDetailsInitialValues(submissionForm)

  const handleArtworkDetailsSubmit = async (values: ArtworkDetailsFormModel) => {
    const isRarityLimitedEdition = values.attributionClass === limitedEditionValue
    const artworkDetailsForm = {
      ...values,
      editionNumber: isRarityLimitedEdition ? values.editionNumber : "",
      editionSizeFormatted: isRarityLimitedEdition ? values.editionSizeFormatted : "",
    }

    let id: string | undefined = submissionForm?.id || undefined

    try {
      id = await createOrUpdateConsignSubmission({
        id,
        artistID: artworkDetailsForm.artistId,
        year: artworkDetailsForm.year,
        title: artworkDetailsForm.title,
        medium: artworkDetailsForm.medium,
        attributionClass: artworkDetailsForm.attributionClass
          .replace(" ", "_")
          .toUpperCase() as ConsignmentAttributionClass,
        editionNumber: artworkDetailsForm.editionNumber,
        editionSizeFormatted: artworkDetailsForm.editionSizeFormatted,
        height: artworkDetailsForm.height,
        width: artworkDetailsForm.width,
        depth: artworkDetailsForm.depth,
        dimensionsMetric: artworkDetailsForm.dimensionsMetric,
        provenance: artworkDetailsForm.provenance,
        locationCity: artworkDetailsForm.location.city,
        locationState: artworkDetailsForm.location.state,
        locationCountry: artworkDetailsForm.location.country,
        state: "DRAFT",
        utmMedium: "",
        utmSource: "",
        utmTerm: "",
      })

      if (id) {
        GlobalStore.actions.artworkSubmission.submission.setSubmissionForm({
          id,
          artistName: artworkDetailsForm.artist,
          artistID: artworkDetailsForm.artistId,
          year: artworkDetailsForm.year,
          title: artworkDetailsForm.title,
          medium: artworkDetailsForm.medium,
          attributionClass: artworkDetailsForm.attributionClass
            .replace(" ", "_")
            .toUpperCase() as ConsignmentAttributionClass,
          editionNumber: artworkDetailsForm.editionNumber,
          editionSizeFormatted: artworkDetailsForm.editionSizeFormatted,
          height: artworkDetailsForm.height,
          width: artworkDetailsForm.width,
          depth: artworkDetailsForm.depth,
          dimensionsMetric: artworkDetailsForm.dimensionsMetric,
          provenance: artworkDetailsForm.provenance,
          locationCity: artworkDetailsForm.location.city,
          locationState: artworkDetailsForm.location.state,
          locationCountry: artworkDetailsForm.location.country,
          state: "DRAFT",
          utmMedium: "",
          utmSource: "",
          utmTerm: "",
        })
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
        <ScrollView>
          <Flex flexDirection="column" p={1} mt={1}>
            <Text variant="sm" color="black60">
              • All fields are required to submit an artwork.
            </Text>
            <Text variant="sm" color="black60">
              • Unfortunately, we do not allow&nbsp;
              <Text style={{ textDecorationLine: "underline" }}>
                artists to sell their own work
              </Text>{" "}
              on Artsy.
            </Text>
            <Spacer mt={4} />
            <ArtworkDetailsForm />
            <Spacer mt={3} />
            <CTAButton
              disabled={!isValid}
              onPress={() => handleArtworkDetailsSubmit(values)}
              testID="Submission_ArtworkDetails_Button"
            >
              Save & Continue
            </CTAButton>
          </Flex>
        </ScrollView>
      )}
    </Formik>
  )
}
