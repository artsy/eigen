import { Flex, FlexProps } from "app/Components/Bidding/Elements/Flex"

export const Divider = (props: FlexProps) => (
  <Flex width="100%" border={1} borderColor="black10" borderBottomWidth={0} {...props} />
)
