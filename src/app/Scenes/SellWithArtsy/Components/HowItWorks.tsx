import { Spacer, Flex, Text, Join } from "@artsy/palette-mobile"

const STEPS = [
  {
    title: "Submit your artwork",
    text: "Enter the artist’s name on the submission page. If the artist is in our database, you’ll be able to upload images and artwork details.",
  },
  {
    title: "Meet your expert",
    text: "One of our specialists will review your submission and determine the best sales option.",
  },
  {
    title: "Get a sales option",
    text: "Review your tailored sales strategy and price estimate. We’ll select the best way to sell your work—either at auction, through private sale, or a direct listing on Artsy.",
  },
  {
    title: "Sell your work",
    text: "Keep your work until it sells, then let our team handle the logistics. No costly presale insurance, shipping, or handling fees.",
  },
]

export const HowItWorks: React.FC = () => {
  return (
    <Flex mx={2}>
      <Text variant="lg-display">How it works</Text>

      <Spacer y={2} />
      <Join separator={<Spacer y={2} />}>
        {STEPS.map((step, index) => (
          <Flex key={step.title + index}>
            <Text variant="lg">{`0${index + 1}`}</Text>
            <Text variant="md">{step.title}</Text>
            <Text variant="xs">{step.text}</Text>
          </Flex>
        ))}
      </Join>
    </Flex>
  )
}
