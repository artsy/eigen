import { Flex, FlexProps } from "app/Components/Bidding/Elements/Flex"
import { PropsWithChildren } from "react"

type GridProps = PropsWithChildren<
  Omit<FlexProps, "flex"> & {
    flex?: FlexProps["flex"] | null
    flexGrow?: number
    flexShrink?: number
    flexBasis?: number | string
  }
>

export const Row = (props: GridProps) => (
  <Flex flexDirection="row" justifyContent="space-between" alignItems="center" {...props} />
)
export const Col = (props: GridProps) => <Flex flex={1} {...props} />
