import { Text } from "@artsy/palette-mobile"
import { FlexProps } from "app/Components/Bidding/Elements/Flex"
import { Col, Row } from "app/Components/Bidding/Elements/Grid"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"

interface BidInfoRowProps extends FlexProps {
  label: string
  value?: string
  onPress?: () => void
}

export class BidInfoRow extends React.Component<BidInfoRowProps> {
  render() {
    const { label, value, onPress, ...props } = this.props

    return (
      <TouchableWithoutFeedback accessibilityRole="button" onPress={onPress}>
        <Row p={2} pb="1" mb={1} {...props}>
          <Col>
            <Text variant="sm-display">{label}</Text>
          </Col>

          <Col alignItems="flex-end">{!!value && <Text numberOfLines={1}>{value}</Text>}</Col>

          <Col alignItems="flex-end" flexGrow={0} flexShrink={0} flexBasis="auto" flex={null}>
            <Text color="blue100" ml={4}>
              {Boolean(value) ? "Edit" : "Add"}
            </Text>
          </Col>
        </Row>
      </TouchableWithoutFeedback>
    )
  }
}
