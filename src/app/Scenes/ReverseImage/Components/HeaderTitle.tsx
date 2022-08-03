import { Flex, Text } from "palette"
import { StyleSheet } from "react-native"

interface HeaderTitleProps {
  title: string
}

export const HeaderTitle: React.FC<HeaderTitleProps> = (props) => {
  const { title } = props

  return (
    <Flex {...StyleSheet.absoluteFillObject} justifyContent="center" alignItems="center">
      <Text variant="md" color="white100">
        {title}
      </Text>
    </Flex>
  )
}
