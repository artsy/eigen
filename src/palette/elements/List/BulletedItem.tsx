import { Spacer } from "@artsy/palette-mobile"
import { bullet, Flex, FlexProps, Text } from "palette"

interface BulletedItemProps extends FlexProps {
  children: string | Array<string | Element>
  color?: string
}

export const BulletedItem: React.FC<BulletedItemProps> = ({
  children,
  color = "black60",
  ...otherFlexProps
}) => {
  return (
    <Flex flexDirection="row" px={1} {...otherFlexProps}>
      <Text variant="sm" color={color}>
        {bullet}
      </Text>
      <Spacer mr={1} />
      <Text variant="sm" color={color}>
        {children}
      </Text>
    </Flex>
  )
}
