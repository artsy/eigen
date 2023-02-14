import { MoneyCircleIcon, StarCircleIcon, WorldGlobeCircleIcon } from "@artsy/palette-mobile"
import { Flex, Text } from "palette"

const reasons = [
  {
    icon: <MoneyCircleIcon height={40} width={40} />,
    title: "Net more from your sale",
    text: "With lower fees than traditional auction houses and dealers, and no listing fees, you take home more of the final sale price.",
  },
  {
    icon: <StarCircleIcon height={40} width={40} />,
    title: "Tap into our expertise",
    text: "Our team has a wealth of experience in the secondary art market. A dedicated specialist will be with you every step of the way.",
  },
  {
    icon: <WorldGlobeCircleIcon height={40} width={40} />,
    title: "Reach a global network",
    text: "We connect your work with the most interested buyers from over 3 million art lovers in 190 countries.",
  },
]

export const Highlights: React.FC = () => {
  return (
    <Flex px={2}>
      {reasons.map(({ icon, title, text }) => (
        <Flex mb={4} key={title + text}>
          {icon}
          <Text variant="md" mb={1} mt={0.5}>
            {title}
          </Text>
          <Text variant="xs">{text}</Text>
        </Flex>
      ))}
    </Flex>
  )
}
