import { Text } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import styled from "styled-components/native"

import { Flex, FlexProps } from "../Elements/Flex"

interface BidInfoRowProps extends FlexProps {
  label: string
  value: string
  onPress?: () => void
}

export class BidInfoRow extends React.Component<BidInfoRowProps> {
  render() {
    const { label, value, onPress, ...props } = this.props

    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <Row p={4} pb={3} mb={1} {...props}>
          <Col>
            <Text variant="mediumText" fontSize="2">
              {label}
            </Text>
          </Col>

          <Col alignItems="flex-end">{!!value && <Text numberOfLines={1}>{value}</Text>}</Col>

          <Col alignItems="flex-end" flexGrow={0} flexShrink={0} flexBasis="auto" flex={null}>
            <Text color="purple100" /* TODO-PALETTE-V3 "blue100" */ ml={3}>
              {Boolean(value) ? "Edit" : "Add"}
            </Text>
          </Col>
        </Row>
      </TouchableWithoutFeedback>
    )
  }
}

const Col = styled(Flex)`
  flex: 1;
`

const Row = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
