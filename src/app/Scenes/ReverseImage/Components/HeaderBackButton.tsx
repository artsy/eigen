import { useSpace } from "@artsy/palette-mobile"
import { BackButton } from "palette"

interface HeaderBackButtonProps {
  onPress: () => void
}

export const HeaderBackButton: React.FC<HeaderBackButtonProps> = ({ onPress }) => {
  const space = useSpace()

  return (
    <BackButton
      color="white100"
      onPress={onPress}
      hitSlop={{
        top: space(2),
        left: space(2),
        right: space(2),
        bottom: space(2),
      }}
    />
  )
}
