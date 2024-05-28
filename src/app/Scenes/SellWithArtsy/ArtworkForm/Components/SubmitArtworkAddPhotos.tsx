import { Flex, Join, Message, Spacer, Text } from "@artsy/palette-mobile"
import { UploadPhotosForm } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/UploadPhotosForm"
import { ScrollView } from "react-native"

export const SubmitArtworkAddPhotos = () => {
  return (
    <Flex px={2}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <Join separator={<Spacer y={2} />}>
          <Text variant="lg-display">Upload photos of your artwork</Text>

          <Text color="black60" variant="xs">
            Make your work stand out and get your submission evaluated faster by uploading
            high-quality photos of the work's front and back.
          </Text>

          <Message
            title="Increase your chance of selling"
            text="Make sure to include images of the back, corners, frame and any other details if you can. "
            variant="success"
          />

          <UploadPhotosForm />
        </Join>
      </ScrollView>
    </Flex>
  )
}
