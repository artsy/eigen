import { Flex, Text } from "palette"

interface HeaderProps {
  title: string
}

export const Header: React.FC<HeaderProps> = ({ title }) => (
  <Flex flexDirection="column">
    <Text variant="md" textAlign="left">
      {title}
    </Text>
  </Flex>
)
