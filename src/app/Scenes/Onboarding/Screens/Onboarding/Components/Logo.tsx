import { ArtsyLogoIcon } from "@artsy/icons/native"
import { Box, Color } from "@artsy/palette-mobile"
import { ALWAYS_WHITE } from "app/utils/colors"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface LogoProps {
  fill?: Color
}

export const Logo: React.FC<LogoProps> = ({ fill = ALWAYS_WHITE }) => {
  const { top } = useSafeAreaInsets()
  return (
    <Box position="absolute" top={`${top}px`} left={0} right={0} alignItems="center">
      <ArtsyLogoIcon height={25} width={75} fill={fill} />
    </Box>
  )
}
