import { ContextModule, OwnerType, TappedConsignArgs } from "@artsy/cohesion"
import { Spacer, ImageIcon, Tag2Icon, Payment2Icon, Box, Flex, Text } from "@artsy/palette-mobile"
import { StepWithImage } from "app/Components/StepWithImage/StepWithImage"
import { useFeatureFlag } from "app/store/GlobalStore"
import { Button, Join } from "palette"

const STEPS = [
  {
    icon: ImageIcon,
    title: "Upload photos",
    text: "Submit images of an artwork in your collection, along with relevant details.",
  },
  {
    icon: Tag2Icon,
    title: "Get a sales option",
    text: "If your artwork is accepted, our specialists will give you a price estimate and the best sales option.",
  },
  {
    icon: Payment2Icon,
    title: "Sell your artwork",
    text: "We’ll find the best buyer for your work and arrange shipping and secure payment.",
  },
]

const NEW_STEPS = [
  {
    title: "Submit your artwork",
    text: "Upload artwork images and details through our online tool. Our specialists will let you know if we currently have market demand.",
  },
  {
    title: "Meet your expert",
    text: "If your artwork is accepted, you’re matched with a specialist to guide you on pricing, sales options, and vetting potential buyers.",
  },
  {
    title: "Get a sales option",
    text: "You’ll get a tailored sales strategy with a price estimate and we select the best sales option for your work, either auction, private sale or direct listing on Artsy.",
  },
  {
    title: "Sell your work",
    text: "Your artwork stays with you until it sells. Meanwhile, our logistics team handles everything, from organizing shipping to getting your payment to you.",
  },
]

export const HowItWorks: React.FC<{
  onConsignPress: (tappedConsignArgs: TappedConsignArgs) => void
}> = ({ onConsignPress }) => {
  const buttonText = "Start Selling"
  const enableNewSWALandingPage = useFeatureFlag("AREnableNewSWALandingPage")
  if (enableNewSWALandingPage) {
    return (
      <Flex mx={2}>
        <Text variant="lg-display">How it works</Text>

        <Spacer y={2} />
        <Join separator={<Spacer y={2} />}>
          {NEW_STEPS.map((step, index) => (
            <Flex key={step.title + index}>
              <Text variant="lg">{`0${index + 1}`}</Text>
              <Text variant="md">{step.title}</Text>
              <Text variant="xs">{step.text}</Text>
            </Flex>
          ))}
          <Spacer y={2} />
          <Button
            testID="HowItWorks-consign-CTA"
            block
            onPress={() => {
              onConsignPress(tracks.consignArgs(buttonText))
            }}
          >
            {buttonText}
          </Button>
        </Join>
      </Flex>
    )
  }
  return (
    <Box px={2}>
      <Text variant="lg-display">How it works</Text>

      <Spacer y={2} />
      <Join separator={<Spacer y={2} />}>
        {STEPS.map((step, index) => (
          <StepWithImage key={index} {...step} />
        ))}
      </Join>
    </Box>
  )
}

const tracks = {
  consignArgs: (subject: string): TappedConsignArgs => ({
    contextModule: ContextModule.sellHowItWorks,
    contextScreenOwnerType: OwnerType.sell,
    subject,
  }),
}
