import {
  Box,
  Flex,
  IconProps,
  ImageIcon,
  Join,
  Payment2Icon,
  Spacer,
  Tag2Icon,
  Text,
} from "palette"
import { TextContainer } from "./TextContainer"

const STEPS = [
  {
    icon: Tag2Icon,
    text: "Submit images of an artwork in your collection, along with relevant details, like the artist, time period, and medium.",
    title: "Upload photos",
  },
  {
    icon: ImageIcon,

    text: "If your artwork is accepted, our specialists will give you a price estimate and the best sales option: at auction, via private sale, or as a direct listing on Artsy.",
    title: "Get a sales option",
  },
  {
    icon: Payment2Icon,

    text: "We’ll find the best buyer for your work and arrange shipping and secure payment when it sells.",
    title: "Sell your artwork",
  },
]

export const HowItWorks: React.FC = () => {
  return (
    <Box px={2}>
      <Text variant="lg">How it works</Text>

      <Spacer mb={2} />
      <Join separator={<Spacer mb={2} />}>
        {STEPS.map((step, index) => (
          <StepWithImage key={index} {...step} />
        ))}
      </Join>
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
    <Flex flexDirection="row">
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
