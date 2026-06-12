import { ArtsyLogoIcon } from "@artsy/icons/native"
import { Box } from "@artsy/palette-mobile"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const LOGO_TOP_OFFSET = 44

export const Logo: React.FC = () => {
  const { top } = useSafeAreaInsets()
  return (
    <Box position="absolute" top={`${top + LOGO_TOP_OFFSET}px`} left={2}>
      <ArtsyLogoIcon height={32} width={94} fill="mono0" />
    </Box>
  )
}
