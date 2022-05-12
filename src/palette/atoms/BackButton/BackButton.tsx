import { Flex } from "palette"
import { ChevronIcon, CloseIcon } from "palette/svgs"
import { TouchableOpacity } from "react-native"

interface BackButtonProps {
  onPress?: () => void
  showX?: boolean
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress, showX = false }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      {showX ? (
        <CloseIcon fill="black100" width={26} height={26} />
      ) : (
        <ChevronIcon direction="left" />
      )}
    </TouchableOpacity>
  )
}

export const BackButtonWithBackground: React.FC<BackButtonProps> = ({ onPress, showX = false }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Flex
        backgroundColor="white100"
        width={40}
        height={40}
        borderRadius={20}
        alignItems="center"
        justifyContent="center"
      >
        {showX ? (
          <CloseIcon fill="black100" width={26} height={26} />
        ) : (
          <ChevronIcon direction="left" />
        )}
      </Flex>
    </TouchableOpacity>
  )
}
