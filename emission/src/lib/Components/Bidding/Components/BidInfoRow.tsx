import { Sans, Serif } from "@artsy/palette"
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
        <Row p={4} pb={3} mb={1} {...props}>
          <Col>
            <Serif size="3" weight="semibold">
              {label}
            </Serif>
          </Col>

          <Col alignItems="flex-end">
            {!!value && (
              <Serif size="3" numberOfLines={1}>
                {value}
              </Serif>
            )}
          </Col>

          <Col alignItems="flex-end" flexGrow={0} flexShrink={0} flexBasis="auto" flex={null}>
            <Sans size="2" color="purple100" ml={3} mb={1}>
              {Boolean(value) ? "Edit" : "Add"}
            </Sans>
          </Col>
        </Row>
      </TouchableWithoutFeedback>
    )
  }
}
