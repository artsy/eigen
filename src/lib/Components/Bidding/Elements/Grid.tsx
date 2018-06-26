import React from "react"
import { Flex } from "../Elements/Flex"

export const Row = props => <Flex flexDirection="row" justifyContent="space-between" alignItems="center" {...props} />
export const Col = props => <Flex flex={1} {...props} />
