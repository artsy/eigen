import { Button, Flex, SkeletonBox, Spacer, Text } from "@artsy/palette-mobile"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/navigationHelpers"
import { ScrollView } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"

const SECTIONS = [
  {
    title: "Add your artwork lorem ipsum",
    description: "Start by adding the artist name or selecting an artwork from My Collection",
    image: null,
  },
  {
    title: "Add key information",
    description: "Add information such as dimensions, provenance, rarity and materials",
    image: null,
  },
  {
    title: "Upload artwork images",
    description: "High quality and multiple images can improve your chances of selling",
    image: null,
  },
  {
    title: "Complete submission",
    description:
      "Your work(s) will be submitted to an Artsy advisor who will assess whether your work is eligible and will help guide you on next steps.",
    image: null,
  },
]
export const SubmitArtworkStartFlow: React.FC = () => {
  const { navigateToNextStep } = useSubmissionContext()

  const { bottom: bottomInset } = useSafeAreaInsets()

  const handleStartNewSubmission = () => {
    navigateToNextStep("ArtworkFormArtist")
  }

  const handleStartFromMyCollection = () => {
    navigateToNextStep()
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <ScrollView>
        <Text variant="lg" mt={4} mb={2}>
          It’s easy to sell on Artsy 123
        </Text>
        <Flex>
          {SECTIONS.map((section, index) => (
            <Flex key={index} my={1} flexDirection="row">
              <Text variant="sm-display" fontWeight={500} style={{ width: 30 }}>
                {index}.
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
              <SkeletonBox backgroundColor="black30" height={80} width={80} />
            </Flex>
          ))}
        </Flex>
      </ScrollView>

      <Flex position="absolute" bottom={bottomInset} backgroundColor="white100" pt={1}>
        <Button onPress={handleStartNewSubmission} block>
          Start a New Submission
        </Button>
        <Button onPress={handleStartFromMyCollection} block mt={2} variant="outline">
          Start from My Collection
        </Button>
      </Flex>
    </SafeAreaView>
  )
}
