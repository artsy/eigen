import { Flex, Text } from "palette"
import { StyleSheet } from "react-native"

interface HeaderTitleProps {
  title: string
}

export const HeaderTitle: React.FC<HeaderTitleProps> = (props) => {
  const { title } = props

  return (
    <Flex
      {...StyleSheet.absoluteFillObject}
      justifyContent="center"
      alignItems="center"
      pointerEvents="none"
    >
      <Text variant="sm-display" color="white100">
        {title}
      </Text>
    </Flex>
  )
}
