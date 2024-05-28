import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { Image, ScrollView } from "react-native"

const SECTIONS = [
  {
    title: "Tell us about your work",
    description:
      "Start by adding an artist from our list of high demand artists. Include information such as year, medium, dimensions and materials.",
    image: require("images/submit_artwork_tell_us_about_your_work.webp"),
  },
  {
    title: "Upload artwork images",
    description:
      "Improve your chances of selling by including photographs of the front, back, frame, signature and other details.",
    image: require("images/submit_artwork_upload_artwork_image.webp"),
  },
  {
    title: "Complete submission",
    description:
      "Your work will be submitted to an Artsy advisor who will assess whether your work is eligible and help guide you on next steps.",
    image: require("images/submit_artwork_complete_submission.webp"),
  },
]
export const SubmitArtworkStartFlow: React.FC = () => {
  return (
    <Flex flex={1} px={2}>
      <ScrollView>
        <Text variant="lg" mb={4}>
          It’s easy to sell on Artsy
        </Text>
        <Flex>
          {SECTIONS.map((section, index) => (
            <Flex key={index} my={2} flexDirection="row" alignItems="flex-start">
              <Text variant="sm-display" fontWeight={500} style={{ width: 25 }}>
                {index + 1}
              </Text>
              <Flex flex={1}>
                <Text variant="sm-display" fontWeight={500}>
                  {section.title}
                </Text>
                <Text color="black60" variant="xs">
                  {section.description}
                </Text>
              </Flex>
              <Spacer x={1} />
              <Image source={section.image} />
            </Flex>
          ))}
        </Flex>
      </ScrollView>
    </Flex>
  )
}
