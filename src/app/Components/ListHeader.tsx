import { LinkText, Text } from "palette"
import React from "react"
import { Flex } from "./Bidding/Elements/Flex"

interface ListHeaderProps {
  title: string
  subtitle: string
  linkText?: string
  onLinkPress?: () => void
}
export const ListHeader: React.FC<ListHeaderProps> = ({
  title,
  subtitle,
  linkText,
  onLinkPress,
}) => {
  return (
    <Flex>
      <Text variant="lg" mx={20} mt={2}>
        {title}
      </Text>
      <Text variant="xs" mx={20} mt={1} mb={2}>
        {subtitle}
        {!!linkText && <LinkText onPress={onLinkPress} />}
      </Text>
    </Flex>
  )
}
