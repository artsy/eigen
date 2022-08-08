import { ViewProps } from "react-native"
import { Flex, FlexProps } from "../Elements/Flex"

export const Container = (props: FlexProps & ViewProps) => (
  <Flex m="2" flex={1} flexDirection="column" justifyContent="space-between" {...props} />
)

export const CenteringContainer = (props: FlexProps & ViewProps) => (
  <Flex flex={1} justifyContent="center" alignItems="center" {...props} />
)
