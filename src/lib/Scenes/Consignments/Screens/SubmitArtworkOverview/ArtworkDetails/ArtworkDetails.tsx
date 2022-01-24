import { captureMessage } from "@sentry/react-native"
import { ArtworkDetails_submission$key } from "__generated__/ArtworkDetails_submission.graphql"
import { ArtworkDetailsQuery } from "__generated__/ArtworkDetailsQuery.graphql"
import { ConsignmentAttributionClass } from "__generated__/createConsignSubmissionMutation.graphql"
import { Formik } from "formik"
import { GlobalStore } from "lib/store/GlobalStore"
import { PlaceholderBox, PlaceholderText, ProvidePlaceholderContext } from "lib/utils/placeholders"
import { CTAButton, Flex, Spacer, Text } from "palette"
import React, { Suspense, useEffect, useState } from "react"
import { ScrollView } from "react-native"
import { graphql, PreloadedQuery, useFragment, usePreloadedQuery, useQueryLoader } from "react-relay"
import { createOrUpdateConsignSubmission } from "../utils/createOrUpdateConsignSubmission"
import { limitedEditionValue } from "../utils/rarityOptions"
import { updateArtworkDetailsInitialValues } from "../utils/updateArtworkDetailsInitialValues"
import { artworkDetailsEmptyInitialValues, artworkDetailsValidationSchema } from "../utils/validation"
import { ArtworkDetailsForm, ArtworkDetailsFormModel } from "./ArtworkDetailsForm"
import { ErrorView } from "./Components/ErrorView"

interface ArtworkDetailsProps {
  submission: ArtworkDetails_submission$key | null
  handlePress: () => void
}

interface ArtworkDetailsContainerProps {
  queryRef: PreloadedQuery<ArtworkDetailsQuery>
  handlePress: () => void
}

export const ArtworkDetails: React.FC<ArtworkDetailsProps> = (props) => {
  const submission = useFragment(submissionFragmentSpec, props.submission)
  const [submissionError, setSubmissionError] = useState(false)

  let artworkDetailsInitialValues: ArtworkDetailsFormModel = artworkDetailsEmptyInitialValues

  if (submission) {
    artworkDetailsInitialValues = updateArtworkDetailsInitialValues(submission)
  }

  const handleArtworkDetailsSubmit = async (values: ArtworkDetailsFormModel) => {
    const isRarityLimitedEdition = values.attributionClass === limitedEditionValue
    const artworkDetailsForm = {
      ...values,
      editionNumber: isRarityLimitedEdition ? values.editionNumber : "",
      editionSizeFormatted: isRarityLimitedEdition ? values.editionSizeFormatted : "",
    }

    let id: string | undefined = submission?.id || undefined

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
        utmMedium: artworkDetailsForm.utmMedium,
        utmSource: artworkDetailsForm.utmSource,
        utmTerm: artworkDetailsForm.utmTerm,
      })

      if (id) {
        GlobalStore.actions.consignment.submission.setSubmissionId(id)
        props.handlePress()
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
              <Text style={{ textDecorationLine: "underline" }}>artists to sell their own work</Text> on Artsy.
            </Text>
            <Spacer mt={4} />
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
        </ScrollView>
      )}
    </Formik>
  )
}

export const ArtworkDetailsContainer: React.FC<ArtworkDetailsContainerProps> = ({ queryRef, handlePress }) => {
  const data = usePreloadedQuery<ArtworkDetailsQuery>(ArtworkDetailsScreenQuery, queryRef)
  return <ArtworkDetails submission={data.submission} handlePress={handlePress} />
}

const ArtworkDetailsScreenQuery = graphql`
  query ArtworkDetailsQuery($id: ID!) {
    submission(id: $id) {
      ...ArtworkDetails_submission
    }
  }
`

export const ArtworkDetailsScreen: React.FC<{ handlePress: () => void }> = ({ handlePress }) => {
  const [queryRef, loadQuery] = useQueryLoader<ArtworkDetailsQuery>(ArtworkDetailsScreenQuery)
  const { submissionId } = GlobalStore.useAppState((state) => state.consignment.submission.sessionState)

  useEffect(() => {
    if (submissionId && !queryRef) {
      loadQuery({ id: submissionId })
    }
  })

  if (!queryRef) {
    return <ArtworkDetails submission={null} handlePress={handlePress} />
  }

  return (
    <Suspense fallback={<Placeholder />}>
      <ArtworkDetailsContainer queryRef={queryRef} handlePress={handlePress} />
    </Suspense>
  )
}

const Placeholder = () => (
  <ProvidePlaceholderContext>
    <PlaceholderBox width="100%" height="100%" />
    <Flex mt="2" ml="2">
      <PlaceholderText width={130 + Math.random() * 100} marginTop={10} />
      <PlaceholderText width={100 + Math.random() * 100} marginTop={8} />
      <PlaceholderText width={100 + Math.random() * 100} marginTop={15} />
    </Flex>
  </ProvidePlaceholderContext>
)

const submissionFragmentSpec = graphql`
  fragment ArtworkDetails_submission on ConsignmentSubmission {
    id
    artist {
      internalID
      name
    }
    locationCity
    locationCountry
    locationState
    year
    title
    medium
    attributionClass
    editionNumber
    editionSize
    height
    width
    depth
    dimensionsMetric
    provenance
    utmMedium
    utmSource
    utmTerm
  }
`
