import { Formik } from "formik"
import { Box, Button, Flex, Spacer, Text } from "palette"
import React from "react"
import { ArtworkDetailsForm, ArtworkDetailsFormModel } from "./ArtworkDetailsForm"
import { artworkDetailsInitialValues, artworkDetailsValidationSchema } from "./utils/validation"
interface ArtworkDetailsProps {
  handlePress: () => void
}

export const ArtworkDetails: React.FC<ArtworkDetailsProps> = ({ handlePress }) => {
  const handleSubmit = async (values: ArtworkDetailsFormModel) => {
    // TODO: createSubmission
    console.log({ values })
    handlePress()
  }

  return (
    <Flex p={1} mt={1}>
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
        onSubmit={handleSubmit}
        validationSchema={artworkDetailsValidationSchema}
        validateOnMount
      >
        {({ isValid }) => (
          <Box>
            <ArtworkDetailsForm />
            <Spacer mt={4} />
            <Button disabled={!isValid} block haptic maxWidth={540}>
              Save & Continue
            </Button>
          </Box>
        )}
      </Formik>
    </Flex>
  )
}
