import React from "react"
import { TouchableWithoutFeedback } from "react-native"

import { FlexProps } from "../Elements/Flex"
import { Col, Row } from "../Elements/Grid"
import { Sans12, Serif16, SerifSemibold16 } from "../Elements/Typography"

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
            <SerifSemibold16>{label}</SerifSemibold16>
          </Col>

          <Col alignItems="flex-end">{value && <Serif16 numberOfLines={1}>{value}</Serif16>}</Col>

          <Col alignItems="flex-end" flexGrow={0} flexShrink={0} flexBasis="auto" flex={null}>
            <Sans12 color="purple100" ml={3} mb={1}>
              {Boolean(value) ? "Edit" : "Add"}
            </Sans12>
          </Col>
        </Row>
      </TouchableWithoutFeedback>
    )
  }
}
