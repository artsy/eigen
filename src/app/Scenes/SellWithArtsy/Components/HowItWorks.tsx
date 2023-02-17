import { TappedConsignArgs } from "@artsy/cohesion"
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
    text: "Upload images and artwork details via our online submission tool.",
  },
  {
    title: "Get an assigned expert",
    text: "Our specialists will review your submission and provide a price estimate.",
  },
  {
    title: "Be guided at every step",
    text: "Our specialists will review your submission and provide a price estimate.",
  },
  {
    title: "Sell your work",
    text: "Once your work sells, our logistics team will handle artwork shipping and payment.",
  },
]

export const HowItWorks: React.FC<{
  onConsignPress: (tappedConsignArgs: TappedConsignArgs) => void
}> = ({ onConsignPress }) => {
  const enableNewSWALandingPage = useFeatureFlag("AREnableNewSWALandingPage")
  if (enableNewSWALandingPage) {
    return (
      <Flex mx={2}>
        <Text variant="lg-display">How it works</Text>
        <Text variant="xs">
          Submit your artwork to discover if Artsy currently has a market for your work
        </Text>
        <Spacer y={2} />
        <Join separator={<Spacer y={2} />}>
          {NEW_STEPS.map((step, index) => (
            <Flex key={step.title + index}>
              <Text variant="lg">{`0${index + 1}`}</Text>
              <Text variant="md">{step.title}</Text>
              <Text variant="xs">{step.text}</Text>
            </Flex>
          ))}
          {/**TODO: Implement tracking. Add sellHowItWorks to ContextModule */}
          <Button block onPress={() => onConsignPress({} as TappedConsignArgs)}>
            Start Selling
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
