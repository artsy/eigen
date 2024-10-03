import { Text, Flex } from "@artsy/palette-mobile"
import { TouchableOpacity } from "react-native"

type ChipProps = {
  title: string | null | undefined
  subtitle: string | null | undefined
  onPress: () => void
}

// TODO: Move to Palette
export const Chip: React.FC<ChipProps> = ({ title, subtitle, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Flex backgroundColor="black5" p={1} borderRadius="5px" mr={1} width="250px">
        {!!subtitle && (
          <Text color="black60" fontSize="13px">
            {subtitle}
          </Text>
        )}
        {!!title && (
          <Text fontSize="16px" color="black100">
            {title}
          </Text>
        )}
      </Flex>
    </TouchableOpacity>
  )
}
