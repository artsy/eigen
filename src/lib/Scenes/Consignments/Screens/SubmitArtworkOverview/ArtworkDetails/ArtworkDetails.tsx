import { Formik } from "formik"
import { Box, CTAButton, Flex, Spacer, Text } from "palette"
import React from "react"
import { ArtworkDetailsForm, ArtworkDetailsFormModel } from "./ArtworkDetailsForm"
import { artworkDetailsInitialValues, artworkDetailsValidationSchema } from "./utils/validation"
interface ArtworkDetailsProps {
  handlePress: () => void
}

export const ArtworkDetails: React.FC<ArtworkDetailsProps> = ({ handlePress }) => {
  const handleArtworkDetailsSubmit = (values: ArtworkDetailsFormModel) => {
    // TODO: post values
    console.log({ values })
    handlePress()
  }

  return (
    <Flex p={1} mt={1}>
      <CTAButton onPress={handlePress}>Save & Continue</CTAButton>
      <Text variant="sm" color="black60">
        · All fields are required to submit an artwork.
      </Text>
      <Text variant="sm" color="black60">
        · Unfortunately, we do not allow&nbsp;
        <Text style={{ textDecorationLine: "underline" }}>artists to sell their own work</Text> on Artsy.
      </Text>
      <Spacer mt={2} />

      <Formik<ArtworkDetailsFormModel>
        initialValues={artworkDetailsInitialValues}
        onSubmit={handleArtworkDetailsSubmit}
        validationSchema={artworkDetailsValidationSchema}
        validateOnMount
      >
        {({ values, isValid }) => {
          return (
            <Box>
              <ArtworkDetailsForm />
              <Spacer mt={4} />
              <CTAButton disabled={!isValid} onPress={() => handleArtworkDetailsSubmit(values)}>
                Save & Continue
              </CTAButton>
            </Box>
          )
        }}
      </Formik>
    </Flex>
  )
}
