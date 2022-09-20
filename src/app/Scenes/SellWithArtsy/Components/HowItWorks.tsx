import { Box, EditIcon, Flex, IconProps, Spacer, Text } from "palette"
import { TextContainer } from "./TextContainer"

const STEPS = [
  {
    icon: EditIcon,
    text: "Submit images of an artwork in your collection, along with relevant details, like the artist, time period, and medium.",
    title: "Upload photos",
  },
  {
    icon: EditIcon,

    text: "If your artwork is accepted, our specialists will give you a price estimate and the best sales option: at auction, via private sale, or as a direct listing on Artsy.",
    title: "Get a sales option",
  },
  {
    icon: EditIcon,

    text: "We’ll find the best buyer for your work and arrange shipping and secure payment when it sells.",
    title: "Sell your artwork",
  },
]

export const HowItWorks: React.FC = () => {
  return (
    <Box px={2}>
      <Text variant="lg">How it works</Text>

      <Spacer mb={2} mt={1} />
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
      <Box pr={2}>
        <Icon width={30} height={30} />
      </Box>

      <TextContainer>
        <Text variant="md">{title}</Text>
        <Spacer mb={0.3} />
        <Text variant="sm" color="black60">
          {text}
        </Text>
      </TextContainer>
    </Flex>
  )
}
