import { ArtsyLogoIcon } from "@artsy/icons/native"
import { Box } from "@artsy/palette-mobile"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface LogoProps {
  fill?: string
}

export const Logo: React.FC<LogoProps> = ({ fill = "white" }) => {
  const { top } = useSafeAreaInsets()
  return (
    <Box position="absolute" top={`${top}px`} left={0} right={0} alignItems="center">
      <ArtsyLogoIcon height={25} width={75} fill={fill} />
    </Box>
  )
}
