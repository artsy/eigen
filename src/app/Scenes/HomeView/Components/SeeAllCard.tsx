import { Flex, Text, useTheme } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"

interface SeeAllCardProps {
  onPress: () => void
  buttonText?: string | null
  href: string
}

export const SeeAllCard: React.FC<SeeAllCardProps> = ({ buttonText, href, onPress }) => {
  const { space } = useTheme()

  return (
    <Flex flex={1} px={1} mx={4} justifyContent="center">
      <RouterLink
        to={href}
        activeOpacity={0.65}
        onPress={onPress}
        hitSlop={{ top: space(1), bottom: space(1), left: space(1), right: space(1) }}
      >
        <Text accessibilityLabel="See All" fontWeight="bold">
          {buttonText ?? "See All"}
        </Text>
      </RouterLink>
    </Flex>
  )
}
