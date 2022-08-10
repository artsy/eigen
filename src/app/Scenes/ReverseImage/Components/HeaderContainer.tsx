import { Flex } from "palette"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { FlexProps } from "styled-system"

export const HeaderContainer: React.FC<FlexProps> = ({ children, ...rest }) => {
  const insets = useSafeAreaInsets()

  return (
    <Flex mt={insets.top} height={44} flexDirection="row" px="2" alignItems="center" {...rest}>
      {children}
    </Flex>
  )
}
