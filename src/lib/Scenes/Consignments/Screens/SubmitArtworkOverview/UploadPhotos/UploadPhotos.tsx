import { bullet, Button, Flex, Spacer, Text } from "palette"
import { CTAButton } from "palette"
import React, { useState } from "react"

export const UploadPhotos = ({ handlePress }: { handlePress: () => void }) => {
  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false)

  return (
    <Flex p={1} mt={1}>
      <Flex flexDirection="row" px={1}>
        <Text variant="sm" color="black60">
          {bullet}{" "}
        </Text>
        <Text variant="sm" color="black60">
          To evaluate your submission faster, please upload high-quality photos of the work’s front and back.{" "}
        </Text>
      </Flex>
      <Flex flexDirection="row" px={1}>
        <Text variant="sm" color="black60">
          {bullet}{" "}
        </Text>
        <Text variant="sm" color="black60">
          If possible, include photos of any signatures or certificates of authenticity.
        </Text>
      </Flex>
      <Flex style={{ borderColor: "lightgray", borderWidth: 1 }} mt={4} mb={2} p={2} pt={3} pb={3}>
        <Text variant="lg" color="black100" marginBottom={1}>
          Add Files Here
        </Text>
        <Text variant="md" color="black60" marginBottom={1}>
          Files Supported: JPG, PNG
        </Text>
        <Text variant="md" color="black60" marginBottom={3}>
          Total Maximum Size: 30MB
        </Text>
        <Button variant="outline" size="large" block onPress={() => setIsPhotoUploaded(!isPhotoUploaded)}>
          Add Photo
        </Button>
      </Flex>
      <Spacer m={2} />
      <CTAButton onPress={handlePress} disabled={!isPhotoUploaded}>
        Save & Continue
      </CTAButton>
    </Flex>
  )
}
