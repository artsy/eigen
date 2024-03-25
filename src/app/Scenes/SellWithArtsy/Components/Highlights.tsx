import { Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import {
  LightStarIcon,
  MoneyCircleIcon,
  WorldGlobeCircleIcon,
} from "app/Scenes/SellWithArtsy/Components/icons/Icons"

const reasons = [
  {
    icon: <MoneyCircleIcon height={40} width={40} />,
    title: "Earn more from your sale",
    text: "With lower fees than traditional auction houses and dealers, you take home more of the final sale price.",
  },
  {
    icon: <LightStarIcon height={40} width={40} />,
    title: "Tap into our expertise",
    text: "Our team has a wealth of experience in the secondary art market. A dedicated specialist will be with you every step of the way.",
  },
  {
    icon: <WorldGlobeCircleIcon height={40} width={40} />,
    title: "Reach a global network",
    text: "With the world’s largest network of collectors, we match your work with the most interested buyers in over 190 countries.",
  },
]

export const Highlights: React.FC = () => {
  return (
    <Flex px={2}>
      <Join separator={<Spacer y={4} />}>
        {reasons.map(({ icon, title, text }) => (
          <Flex key={title + text}>
            {icon}
            <Text variant="md" mb={1} mt={0.5}>
              {title}
            </Text>
            <Text variant="xs">{text}</Text>
          </Flex>
        ))}
      </Join>
    </Flex>
  )
}
