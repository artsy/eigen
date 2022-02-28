import { Text } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"

import { FlexProps } from "../Elements/Flex"
import { Col, Row } from "../Elements/Grid"

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
        <Row p="2" pb="1" mb="1" {...props}>
          <Col>
            <Text variant="xs">{label}</Text>
          </Col>

          <Col alignItems="flex-end">{!!value && <Text numberOfLines={1}>{value}</Text>}</Col>

          <Col alignItems="flex-end" flexGrow={0} flexShrink={0} flexBasis="auto" flex={null}>
            <Text color="blue100" ml={3}>
              {Boolean(value) ? "Edit" : "Add"}
            </Text>
          </Col>
        </Row>
      </TouchableWithoutFeedback>
    )
  }
}
