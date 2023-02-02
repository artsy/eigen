import { Spacer, IconProps } from "@artsy/palette-mobile"
import { Flex } from "app/Components/Bidding/Elements/Flex"
import { Text } from "palette"

interface StepWithImageProps {
  icon: React.FC<IconProps>
  title: string
  text: string
}

export const StepWithImage: React.FC<StepWithImageProps> = ({ icon: Icon, text, title }) => {
  return (
    <Flex flexDirection="row">
      <Flex pr={1} mr="0.5" style={{ paddingTop: 6 }}>
        <Icon width={18} height={18} />
      </Flex>

      <Flex flex={1}>
        <Text variant="sm-display">{title}</Text>
        <Spacer y={0.5} />
        <Text variant="sm" color="black60">
          {text}
        </Text>
      </Flex>
    </Flex>
  )
}
