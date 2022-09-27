import { Box, Flex, IconProps, ImageIcon, Payment2Icon, Spacer, Tag2Icon, Text } from "palette"
import { TextContainer } from "./TextContainer"

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

export const HowItWorks: React.FC = () => {
  return (
    <Box px={2}>
      <Text variant="lg">How it works</Text>

      <Spacer mb={2} />

      {STEPS.map((step, index) => (
        <StepWithImage key={index} {...step} />
      ))}
    </Box>
  )
}

interface StepWithImageProps {
  icon: React.FC<IconProps>
  title: string
  text: string
}

const StepWithImage: React.FC<StepWithImageProps> = ({ icon: Icon, text, title }) => {
  return (
    <Flex flexDirection="row" mb={2}>
      <Box pr={1} mr={0.3} style={{ paddingTop: 4 }}>
        <Icon width={18} height={18} />
      </Box>

      <TextContainer>
        <Text variant="sm">{title}</Text>
        <Spacer mb={0.3} />
        <Text variant="sm" color="black60">
          {text}
        </Text>
      </TextContainer>
    </Flex>
  )
}
