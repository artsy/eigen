import { IconProps, Spacer, Text } from "palette"
import { Flex } from "../Bidding/Elements/Flex"

interface StepWithImageProps {
  icon: React.FC<IconProps>
  title: string
  text: string
}

export const StepWithImage: React.FC<StepWithImageProps> = ({ icon: Icon, text, title }) => {
  return (
    <Flex flexDirection="row">
      <Flex pr={1} mr={0.3} style={{ paddingTop: 6 }}>
        <Icon width={18} height={18} />
      </Flex>

      <Flex flex={1}>
        <Text variant="sm-display">{title}</Text>
        <Spacer mb={0.3} />
        <Text variant="sm" color="black60">
          {text}
        </Text>
      </Flex>
    </Flex>
  )
}
