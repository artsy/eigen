import { Flex, Join, Spacer, SpacingUnit } from "palette"
import React from "react"

export const Stack: React.FC<
  { spacing?: SpacingUnit; horizontal?: boolean } & React.ComponentPropsWithoutRef<typeof Flex>
> = ({ children, spacing = 2, horizontal, ...others }) => {
  return (
    <Flex flexDirection={horizontal ? "row" : "column"} {...others}>
      <Join separator={<Spacer mb={horizontal ? 0 : spacing} mr={horizontal ? spacing : 0} />}>
        {children}
      </Join>
    </Flex>
  )
}
