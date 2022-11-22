import { Flex, Text } from "palette"

interface HeaderProps {
  title: string
}

export const Header: React.FC<HeaderProps> = ({ title }) => (
  <Flex flexDirection="column">
    <Text variant="sm-display" textAlign="left">
      {title}
    </Text>
  </Flex>
)
