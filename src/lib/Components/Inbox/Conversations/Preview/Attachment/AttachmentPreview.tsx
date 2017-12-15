import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { TouchableHighlight } from "react-native"
import styled from "styled-components/native"

import colors from "lib/data/colors"

const Container = styled.View`
  flex-direction: row;
`

export interface AttachmentProps {
  /**
   * This callback is bound to the attachment preview component, meaning that `this` refers to the instance you can pass
   * to e.g. `findNodeHandle`.
   */
  onSelected?: (attachmentID: string) => void
}

interface Props extends AttachmentProps, RelayProps {}

export class AttachmentPreview extends React.Component<Props, null> {
  render() {
    const { attachment, children, onSelected } = this.props
    return (
      <TouchableHighlight
        underlayColor={colors["gray-light"]}
        onPress={onSelected && onSelected.bind(this, attachment.id)}
      >
        <Container>{children}</Container>
      </TouchableHighlight>
    )
  }
}

export default createFragmentContainer(
  AttachmentPreview,
  graphql`
    fragment AttachmentPreview_attachment on Attachment {
      id
    }
  `
)

interface RelayProps {
  attachment: {
    id: string
  }
}
